"""
NASA Data Ingestion Script

Chunks all PDF and .txt files in a folder and stores them into Pinecone.


"""

import argparse
import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

# Load environment variables from .env
load_dotenv(override=True)


def get_pinecone_store() -> PineconeVectorStore:
    """Connect to Pinecone and return the vector store."""
    api_key = os.environ["PINECONE_API_KEY"]
    index_name = os.environ["PINECONE_INDEX_NAME"]
    openai_api_key = os.environ["OPENAI_API_KEY"]
    embedding_model = os.environ.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-large")

    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)

    embeddings = OpenAIEmbeddings(model=embedding_model, api_key=openai_api_key)
    return PineconeVectorStore(index=index, embedding=embeddings)


def load_file(file_path: Path):
    """Load a PDF or TXT file and return a list of LangChain Documents."""
    suffix = file_path.suffix.lower()
    if suffix == ".pdf":
        loader = PyPDFLoader(str(file_path))
    elif suffix in (".txt", ".md"):
        loader = TextLoader(str(file_path), encoding="utf-8")
    else:
        print(f"  ⚠️  Skipping unsupported file type: {file_path.name}")
        return []
    return loader.load()


def ingest_folder(folder: Path, chunk_size: int, chunk_overlap: int) -> None:
    """Chunk all files in a folder and upsert them into Pinecone."""

    # Gather all supported files
    files = sorted([
        f for f in folder.rglob("*")
        if f.is_file() and f.suffix.lower() in (".pdf", ".txt", ".md")
    ])

    if not files:
        print(f"❌ No PDF or TXT files found in: {folder}")
        return

    print(f"\n✅ Found {len(files)} file(s) in '{folder}'")
    print(f"   Chunk size: {chunk_size}, Overlap: {chunk_overlap}\n")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )

    vector_store = get_pinecone_store()
    total_chunks = 0

    for file_path in files:
        print(f"📄 Processing: {file_path.name} ...", end=" ", flush=True)
        docs = load_file(file_path)
        if not docs:
            continue

        chunks = text_splitter.split_documents(docs)
        if not chunks:
            print("no content found, skipping.")
            continue

        # Add source metadata
        for chunk in chunks:
            chunk.metadata["source_file"] = file_path.name

        vector_store.add_documents(chunks)
        total_chunks += len(chunks)
        print(f"→ {len(chunks)} chunks indexed ✅")

    print(f"\n🎉 Done! Total chunks stored to Pinecone: {total_chunks}")


def main():
    parser = argparse.ArgumentParser(description="Ingest NASA data into Pinecone")
    parser.add_argument(
        "--folder",
        type=str,
        default="src/app/data/uploads",
        help="Folder containing PDF/TXT files to ingest (default: src/app/data/uploads)",
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=500,
        help="Max characters per chunk (default: 500)",
    )
    parser.add_argument(
        "--overlap",
        type=int,
        default=50,
        help="Overlap between chunks (default: 50)",
    )
    args = parser.parse_args()

    folder = Path(args.folder)
    if not folder.exists():
        print(f"❌ Folder not found: {folder}")
        return

    ingest_folder(folder, chunk_size=args.chunk_size, chunk_overlap=args.overlap)


if __name__ == "__main__":
    main()
