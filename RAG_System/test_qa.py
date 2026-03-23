import requests

def test_mars():
    url = "http://localhost:8000/qa"
    payload = {"question": "tell me all about mars"}
    response = requests.post(url, json=payload)
    print("Status:", response.status_code)
    try:
        data = response.json()
        print("Draft Answer:\n", data.get("draft_answer"))
        print("Answer:\n", data.get("answer"))
        print("\nContext:\n", data.get("context"))
    except Exception as e:
        print("Error:", e)
        print("Response:", response.text)

if __name__ == "__main__":
    test_mars()
