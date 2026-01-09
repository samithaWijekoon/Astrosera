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