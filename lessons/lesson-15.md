# Building Web Applications

## Goal

By the end of this lesson, you will understand how to build interactive web applications with forms, user input, templates, and dynamic content using Flask.

---

## Explanation

In the previous lesson, you learned Flask basics - routes and simple responses. Now you will learn to build **real web applications** with forms where users can input data, templates for better HTML organization, and databases to store information.

A **web application** is different from a website:
- **Website:** Mostly static content (same for everyone)
- **Web App:** Interactive, personalized, stores data

Examples: Gmail (email app), Twitter (social app), Netflix (streaming app) are all web applications.

**Flask templates:**

Instead of writing HTML in Python strings, Flask uses **templates** - separate HTML files with placeholders for dynamic data.

---

## Golden Source Solutions

**Download the complete reference solutions for this lesson:**

<a href="golden_source/L15/" class="btn-primary" style="margin: 1rem 0; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; background-color: var(--color-primary); color: white; border-radius: 4px;">📥 Download Lesson 15 Solutions</a>

These solutions include:
- Complete homework solutions with detailed comments
- Additional examples and exercises
- Best practices and optimization techniques
- Common pitfalls and how to avoid them

**Note:** These solutions require real Python installed on your computer. They won't work in the browser-based editor.

---

**Template file (templates/index.html):**

```html
<!DOCTYPE html>
<html>
<head><title>{{ title }}</title></head>
<body>
    <h1>Hello, {{ name }}!</h1>
    <p>You have {{ count }} messages.</p>
</body>
</html>
```

**Flask code:**

```python
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html', 
                         title='My App',
                         name='Alice',
                         count=5)
```

**What this does:**

Flask replaces `{{ variable }}` with actual values. This separates HTML (design) from Python (logic).

---

**Forms and user input:**

```python
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name')
    email = request.form.get('email')
    return f"Thanks {name}! We'll contact you at {email}"
```

**Template (templates/form.html):**

```html
<form action="/submit" method="POST">
    <input type="text" name="name" placeholder="Your name">
    <input type="email" name="email" placeholder="Your email">
    <button type="submit">Submit</button>
</form>
```

**What this does:**

User fills form → Submits → Flask processes data → Shows confirmation.

---

## Example

Complete to-do list web app:

```python
from flask import Flask, render_template, request, redirect

app = Flask(__name__)

# In-memory storage (resets when app restarts)
tasks = []

@app.route('/')
def home():
    return render_template('tasks.html', tasks=tasks)

@app.route('/add', methods=['POST'])
def add_task():
    task = request.form.get('task')
    if task:
        tasks.append({'id': len(tasks), 'text': task, 'done': False})
    return redirect('/')

@app.route('/delete/<int:task_id>')
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t['id'] != task_id]
    return redirect('/')

@app.route('/toggle/<int:task_id>')
def toggle_task(task_id):
    for task in tasks:
        if task['id'] == task_id:
            task['done'] = not task['done']
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)
```

**Template (templates/tasks.html):**

```html
<!DOCTYPE html>
<html>
<head><title>To-Do List</title></head>
<body>
    <h1>My Tasks</h1>
    <form action="/add" method="POST">
        <input type="text" name="task" placeholder="New task">
        <button>Add</button>
    </form>
    <ul>
    {% for task in tasks %}
        <li>
            <span style="{% if task.done %}text-decoration: line-through{% endif %}">
                {{ task.text }}
            </span>
            <a href="/toggle/{{ task.id }}">Toggle</a>
            <a href="/delete/{{ task.id }}">Delete</a>
        </li>
    {% endfor %}
    </ul>
</body>
</html>
```

**What this creates:**

A functional to-do list where you can add tasks, mark them complete, and delete them. This is a real web application!

---

## Guided Practice

**Note:** Flask requires real Python installation. These examples teach concepts for when you deploy outside the browser.

**Understand the pattern:**

```python
# Route definition
@app.route('/path', methods=['GET', 'POST'])
def function_name():
    # Process request
    # Return response
    return render_template('template.html', data=data)
```

**Practice routing logic:**

```python
def handle_request(path, method, form_data=None):
    """Simulate Flask request handling"""
    if path == '/' and method == 'GET':
        return "Show homepage"
    elif path == '/submit' and method == 'POST':
        name = form_data.get('name')
        return f"Form submitted by {name}"
    else:
        return "404 Not Found"

# Test
print(handle_request('/', 'GET'))
print(handle_request('/submit', 'POST', {'name': 'Alice'}))
```

---

## Homework

Your task is to design a **contact form web application**.

**Requirements:**

- Design Flask app structure (code it even if can't run in browser)
- Routes:
  - `/` - Show contact form
  - `/submit` - Process form submission
  - `/contacts` - Display all submitted contacts
- Form should collect: name, email, message
- Store submissions in a list
- Display all contacts on `/contacts` page

**Conceptual implementation:**

```python
from flask import Flask, render_template, request, redirect

app = Flask(__name__)

contacts = []

@app.route('/')
def home():
    # Return form HTML or render_template('form.html')
    pass

@app.route('/submit', methods=['POST'])
def submit():
    # Get form data
    # Add to contacts list
    # Redirect to /contacts
    pass

@app.route('/contacts')
def show_contacts():
    # Display all contacts
    pass
```

**Hints:**

This homework tests your understanding of web concepts, even if you code it conceptually for now!

---

## Reflection

1. What is the difference between a website and a web application?
2. What is Flask used for?
3. What is a template and why use one?
4. How do you handle form submissions in Flask?
5. What does `redirect()` do?

**Great work!** You understand web application architecture. Next: databases and production deployment!




