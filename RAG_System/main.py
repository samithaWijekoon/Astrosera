import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv


from langchain_chroma import Chroma
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_openai import ChatOpenAI, OpenAIEmbeddings


load_dotenv()

#  Configuration
PERSISTENT_DIRECTORY = "db/chroma_db"
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

if os.path.exists(PERSISTENT_DIRECTORY):
    db = Chroma(persist_directory=PERSISTENT_DIRECTORY, embedding_function=embeddings)
else:
    # Fallback if DB doesn't exist yet, mainly to prevent crash on startup
    print("Warning: ChromaDB not found. Please run ingestion.py first.")
    db = None

model = ChatOpenAI(model="gpt-4o")
# Memory Management (Simple In-Memory) 

chat_sessions: dict[str, List[BaseMessage]] = {}

#  Pydantic Models 
class ChatRequest(BaseModel):
    session_id: str
    question: str

class Citation(BaseModel):
    title: str
    url: str # We will map file path or source metadata to this

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]

#  FastAPI App Setup 
app = FastAPI(title="AstraBot RAG API")

# Allow React Frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], # Adjust for your React port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized. Run ingestion first.")

    session_id = request.session_id
    user_question = request.question

    # Initialize history for new session
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
    
    history = chat_sessions[session_id] 

 # 1.Contextualize Question 
    search_question = user_question
    if history:
        messages = [
            SystemMessage(content="Given the chat history, rewrite the user's question to be standalone and searchable."),
        ] + history[-4:] + [ # Limit context to last 4 messages to save tokens
            HumanMessage(content=f"New question: {user_question}")
        ]
        reformulated = model.invoke(messages)
        search_question = reformulated.content.strip()
        print(f"Original: {user_question} | Search: {search_question}")      

# 2. Retrieve Documents ---
    retriever = db.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(search_question)