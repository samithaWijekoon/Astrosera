from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Astrosera RAG API",
    description="Astronomy Learning Platform - RAG System API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # React default
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, description="User's question about astronomy")
    session_id: Optional[str] = Field(default="default", description="Session ID for chat history")
    use_history: Optional[bool] = Field(default=True, description="Whether to use chat history")
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "What is a black hole?",
                "session_id": "user_123",
                "use_history": True
            }
        }

class Citation(BaseModel):
    title: str
    url: Optional[str] = None
    content_preview: str
    
class QueryResponse(BaseModel):
    answer: str
    citations: List[Citation]
    session_id: str
    timestamp: str
    search_query: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    vector_store_status: str
    documents_count: int

class IngestResponse(BaseModel):
    message: str
    documents_processed: int
    chunks_created: int

# Global variables for chat history and vector store
chat_sessions: Dict[str, List] = {}
vectorstore = None
embeddings = None
llm = None

# Initialize models and vector store
def initialize_rag_system():
    """Initialize RAG system components"""
    global vectorstore, embeddings, llm
    
    try:
        # Initialize embeddings
        embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        
        # Initialize LLM
        llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
        
        # Load existing vector store
        persistent_directory = "db/chroma_db"
        if os.path.exists(persistent_directory):
            vectorstore = Chroma(
                persist_directory=persistent_directory,
                embedding_function=embeddings,
                collection_metadata={"hnsw:space": "cosine"}
            )
            print(f"Vector store loaded with {vectorstore._collection.count()} documents")
        else:
            print(" Vector store not found. Please run ingestion first.")
            vectorstore = None
            
    except Exception as e:
        print(f" Error initializing RAG system: {e}")
        raise e

# Initialize on startup
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print(" Starting Astrosera RAG API...")
    initialize_rag_system()
    print(" RAG system initialized")

def get_or_create_session(session_id: str) -> List:
    """Get or create chat history for a session"""
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
    return chat_sessions[session_id]

def rewrite_question_with_history(question: str, history: List) -> str:
    """Rewrite question to be standalone using chat history"""
    if not history or len(history) == 0:
        return question
    
    try:
        messages = [
            SystemMessage(content="Given the chat history, rewrite the new question to be standalone and searchable. Just return the rewritten question, nothing else."),
        ] + history[-4:] + [  # Last 2 exchanges (4 messages)
            HumanMessage(content=f"New question: {question}")
        ]
        
        result = llm.invoke(messages)
        rewritten = result.content.strip()
        print(f"Rewritten question: {rewritten}")
        return rewritten
    except Exception as e:
        print(f" Error rewriting question: {e}")
        return question

def retrieve_documents(query: str, k: int = 3):
    """Retrieve relevant documents from vector store"""
    if not vectorstore:
        raise ValueError("Vector store not initialized. Please run ingestion first.")
    
    retriever = vectorstore.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(query)
    
    print(f"📚 Found {len(docs)} relevant documents")
    for i, doc in enumerate(docs, 1):
        preview = doc.page_content[:100].replace('\n', ' ')
        print(f"  Doc {i}: {preview}...")
    
    return docs

def generate_answer(question: str, docs: List, history: List) -> str:
    """Generate answer using LLM with context and history"""
    
    # Prepare context from documents
    context = "\n\n".join([
        f"Document {i+1}:\n{doc.page_content}" 
        for i, doc in enumerate(docs)
    ])
    
    # Create the prompt
    prompt = f"""Based on the following astronomy documents, please answer this question: {question}

Documents:
{context}

Instructions:
- Provide a clear, accurate answer using the information from the documents
- If the documents don't contain enough information, say so honestly
- Be educational and engaging, as this is for an astronomy learning platform
- Keep the answer concise but informative

Answer:"""
    
    # Build messages with history
    messages = [
        SystemMessage(content="""You are AstraBot, an expert astronomy assistant for the Astrosera learning platform. 
You help students learn about space, astronomy, and the cosmos. 
Provide accurate, educational, and engaging answers based on the provided documents and chat history.
If you don't know something or it's not in the documents, be honest about it."""),
    ]
    
    # Add recent history (last 3 exchanges)
    if history:
        messages.extend(history[-6:])
    
    # Add current question with context
    messages.append(HumanMessage(content=prompt))
    
    # Generate response
    result = llm.invoke(messages)
    return result.content

@app.post("/api/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """
    Query the RAG system with a question
    
    Returns an answer with citations from the astronomy knowledge base
    """
    try:
        # Validate vector store
        if not vectorstore:
            raise HTTPException(
                status_code=503, 
                detail="Vector store not initialized. Please run document ingestion first."
            )
        
        # Get chat history for session
        chat_history = get_or_create_session(request.session_id)
        
        # Step 1: Rewrite question with history context
        search_query = request.question
        if request.use_history and chat_history:
            search_query = rewrite_question_with_history(request.question, chat_history)
        
        # Step 2: Retrieve relevant documents
        docs = retrieve_documents(search_query, k=3)
        
        if not docs:
            return QueryResponse(
                answer="I couldn't find relevant information in the knowledge base to answer your question.",
                citations=[],
                session_id=request.session_id,
                timestamp=datetime.now().isoformat(),
                search_query=search_query
            )
        
        # Step 3: Generate answer
        answer = generate_answer(request.question, docs, chat_history)
        
        # Step 4: Create citations
        citations = []
        for i, doc in enumerate(docs):
            source = doc.metadata.get('source', 'Unknown')
            filename = os.path.basename(source)
            preview = doc.page_content[:200].replace('\n', ' ') + "..."
            
            citations.append(Citation(
                title=f"Document: {filename}",
                url=None,  # Add URL if you have it in metadata
                content_preview=preview
            ))
        
        # Step 5: Update chat history
        chat_history.append(HumanMessage(content=request.question))
        chat_history.append(AIMessage(content=answer))
        
        # Limit history to last 10 exchanges (20 messages)
        if len(chat_history) > 20:
            chat_sessions[request.session_id] = chat_history[-20:]
        
        return QueryResponse(
            answer=answer,
            citations=citations,
            session_id=request.session_id,
            timestamp=datetime.now().isoformat(),
            search_query=search_query if search_query != request.question else None
        )
        
    except Exception as e:
        print(f" Error in query endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.delete("/api/session/{session_id}")
async def clear_session(session_id: str):
    """Clear chat history for a specific session"""
    if session_id in chat_sessions:
        del chat_sessions[session_id]
        return {"message": f"Session {session_id} cleared successfully"}
    return {"message": f"Session {session_id} not found"}

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns the status of the RAG system and vector store
    """
    doc_count = 0
    vs_status = "not_initialized"
    
    if vectorstore:
        try:
            doc_count = vectorstore._collection.count()
            vs_status = "healthy"
        except:
            vs_status = "error"
    
    return HealthResponse(
        status="healthy",
        service="Astrosera RAG API",
        vector_store_status=vs_status,
        documents_count=doc_count
    )

@app.get("/api/sessions")
async def list_sessions():
    """List all active chat sessions"""
    return {
        "active_sessions": list(chat_sessions.keys()),
        "total_sessions": len(chat_sessions)
    }

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "service": "Astrosera RAG API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "query": "/api/query",
            "health": "/api/health",
            "sessions": "/api/sessions",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )