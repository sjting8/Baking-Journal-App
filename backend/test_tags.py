import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_tags():
    print("Testing Tag Functionality...")

    # 1. Create a Journal with tags
    print("\n1. Creating a Journal with tags...")
    payload = {
        "title": "Test Recipe with Tags",
        "tags": ["test-tag-1", "test-tag-2"]
    }
    try:
        response = requests.post(f"{BASE_URL}/journals/", json=payload)
        if response.status_code == 201:
            journal = response.json()
            print(f"Success! Journal created with ID: {journal['id']}")
            print(f"Tags: {journal['tags']}")
            assert len(journal['tags']) == 2
            assert any(t['name'] == 'test-tag-1' for t in journal['tags'])
        else:
            print(f"Failed to create journal. Status: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"Error connecting to API: {e}")
        return

    journal_id = journal['id']

    # 2. Update Journal tags
    print("\n2. Updating Journal tags...")
    update_payload = {
        "title": "Test Recipe with Updated Tags",
        "tags": ["test-tag-1", "test-tag-3"] # Removing tag-2, adding tag-3
    }
    response = requests.put(f"{BASE_URL}/journals/{journal_id}/", json=update_payload)
    if response.status_code == 200:
        updated_journal = response.json()
        print("Success! Journal updated.")
        print(f"Tags: {updated_journal['tags']}")
        assert len(updated_journal['tags']) == 2
        assert any(t['name'] == 'test-tag-3' for t in updated_journal['tags'])
        assert not any(t['name'] == 'test-tag-2' for t in updated_journal['tags'])
    else:
        print(f"Failed to update journal. Status: {response.status_code}")
        print(response.text)

    # 3. List Journals and check tags
    print("\n3. Listing Journals...")
    response = requests.get(f"{BASE_URL}/journals/")
    if response.status_code == 200:
        journals = response.json()
        target_journal = next((j for j in journals if j['id'] == journal_id), None)
        if target_journal:
            print("Found created journal in list.")
            print(f"Tags in list view: {target_journal['tags']}")
            assert len(target_journal['tags']) == 2
        else:
            print("Created journal not found in list.")
    else:
        print(f"Failed to list journals. Status: {response.status_code}")

    # Cleanup
    print("\nCleaning up...")
    requests.delete(f"{BASE_URL}/journals/{journal_id}/")
    print("Test Journal deleted.")

if __name__ == "__main__":
    test_tags()
