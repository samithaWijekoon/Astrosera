from pathlib import Path
import sys
import os

# Dynamically set the project root to the directory containing this script
PROJECT_ROOT = Path(__file__).parent.absolute()
sys.path.append(str(PROJECT_ROOT))

if __name__ == "__main__":
    try:
        from dotenv import load_dotenv
        # Use relative path for .env file
        load_dotenv(PROJECT_ROOT / ".env")
        from src.app.core.agents.graph import run_qa_flow
        result = run_qa_flow("What is a black hole?")
        print("RESULT:", result)
    except Exception as e:
        import traceback
        traceback.print_exc()
