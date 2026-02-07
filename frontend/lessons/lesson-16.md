# Building REST APIs with Python

## Goal

Learn to build REST APIs that other programs can use to access your data and services.

## Explanation

An **API** (Application Programming Interface) is a way for programs to communicate. A **REST API** uses HTTP and returns data (usually JSON) instead of HTML webpages.

**Why build APIs?**
- Mobile apps need data from servers
- Other programs can use your services
- Frontend and backend separation
- Microservices architecture

**Flask makes API building easy:**

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/hello')
def api_hello():
    return jsonify({"message": "Hello from API!"})
```

Returns JSON: `{"message": "Hello from API!"}`

---

## Golden Source Solutions

**Download the complete reference solutions for this lesson:**

<a href="golden_source/L16/" class="btn-primary" style="margin: 1rem 0; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; background-color: var(--color-primary); color: white; border-radius: 4px;">📥 Download Lesson 16 Solutions</a>

These solutions include:
- Complete homework solutions with detailed comments
- Additional examples and exercises
- Best practices and optimization techniques
- Common pitfalls and how to avoid them

**Note:** These solutions require real Python installed on your computer. They won't work in the browser-based editor.

---

## Example

Complete REST API for managing notes:

```python
from flask import Flask, jsonify, request

app = Flask(__name__)
notes = []

# GET all notes
@app.route('/api/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)

# POST new note
@app.route('/api/notes', methods=['POST'])
def create_note():
    data = request.get_json()
    note = {
        'id': len(notes) + 1,
        'title': data['title'],
        'content': data['content']
    }
    notes.append(note)
    return jsonify(note), 201

# GET specific note
@app.route('/api/notes/<int:note_id>', methods=['GET'])
def get_note(note_id):
    note = next((n for n in notes if n['id'] == note_id), None)
    if note:
        return jsonify(note)
    return jsonify({"error": "Not found"}), 404

# DELETE note
@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    global notes
    notes = [n for n in notes if n['id'] != note_id]
    return jsonify({"message": "Deleted"})

if __name__ == '__main__':
    app.run(debug=True)
```

## Guided Practice

Understand API patterns (simulate in browser):

```python
import json

# Simulate API data store
api_data = []

def api_create(data):
    """Simulate POST request"""
    item = {'id': len(api_data) + 1, **data}
    api_data.append(item)
    return json.dumps(item)

def api_get_all():
    """Simulate GET request"""
    return json.dumps(api_data)

# Test
print(api_create({'name': 'Item 1', 'value': 100}))
print(api_create({'name': 'Item 2', 'value': 200}))
print(api_get_all())
```

## Homework

Design a **Book API** with CRUD operations:
- GET /api/books - List all books
- POST /api/books - Add book
- GET /api/books/<id> - Get specific book
- DELETE /api/books/<id> - Remove book

Include: title, author, year, isbn

## Reflection

1. What is REST API?
2. What's the difference between API and webpage?
3. What HTTP methods are used for CRUD?
4. Why return JSON instead of HTML?
5. What is API endpoint?

**Excellent!** APIs are essential for modern development!




