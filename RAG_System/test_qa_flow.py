import sys
import os
sys.path.append("/Users/nipunnirman/Documents/GitHub/Astrosera/RAG_System")
from src.app.core.agents.graph import run_qa_flow

if __name__ == "__main__":
    try:
        from dotenv import load_dotenv
        load_dotenv("/Users/nipunnirman/Documents/GitHub/Astrosera/RAG_System/.env")
        result = run_qa_flow("What is a black hole?")
        print("RESULT:", result)
    except Exception as e:
        import traceback
        traceback.print_exc()
