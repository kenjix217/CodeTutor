# Introduction to Web Development with Flask

## Goal

By the end of this lesson, you will understand web development basics and how to create simple web applications using the Flask framework.

---

## Explanation

You have built programs that run in the terminal or in our browser platform. But what if you want to share your programs with others through the web? What if you want to build websites and web apps?

This is where **web development** comes in.

**Web development** means building applications that run in a web browser. These can be:
- Websites (like blogs, portfolios)
- Web apps (like to-do lists, calculators)
- APIs (services other programs can use)

**Flask** is a Python web framework. A framework is a library that provides structure and tools for building a specific type of application. Flask makes it easy to build web applications with Python.

**Why Flask?**

Flask is:
- Simple and easy to learn
- Lightweight (doesn't force decisions on you)
- Well-documented
- Used in production by major companies
- Perfect for beginners and experts

---

## Golden Source Solutions

**Download the complete reference solutions for this lesson:**

<a href="golden_source/L14/" class="btn-primary" style="margin: 1rem 0; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; background-color: var(--color-primary); color: white; border-radius: 4px;">📥 Download Lesson 14 Solutions</a>

These solutions include:
- Complete homework solutions with detailed comments
- Additional examples and exercises
- Best practices and optimization techniques
- Common pitfalls and how to avoid them

**Note:** These solutions require real Python installed on your computer. They won't work in the browser-based editor.

---

**Basic web concepts:**

**HTTP:** The protocol (language) web browsers and servers use to communicate.

**Routes:** URLs that map to specific functions in your code.

**Templates:** HTML files with placeholders for dynamic content.

**Example:**
- URL: `/hello` → Runs function → Returns "Hello, World!" webpage

---

**Your first Flask app:**

**In real Python** (install Flask first: `pip install flask`):

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, World! This is my first web app!"

if __name__ == '__main__':
    app.run(debug=True)
```

**What this does:**

- Creates a Flask application
- Defines a route `/` (homepage)
- When someone visits the homepage, returns "Hello, World!"
- Runs the web server

Run this and visit `http://localhost:5000` in your browser!

---

**Routes and functions:**

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to my website!"

@app.route('/about')
def about():
    return "This is the about page."

@app.route('/user/<name>')
def greet_user(name):
    return f"Hello, {name}!"

if __name__ == '__main__':
    app.run(debug=True)
```

**What this does:**

- `/` → Shows welcome message
- `/about` → Shows about page
- `/user/Alice` → Shows "Hello, Alice!"
- `/user/Bob` → Shows "Hello, Bob!"

The `<name>` in the route is a variable - it captures whatever is in the URL!

---

**Returning HTML:**

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    html = """
    <!DOCTYPE html>
    <html>
    <head><title>My App</title></head>
    <body>
        <h1>Welcome to My Website</h1>
        <p>This is built with Flask!</p>
        <a href="/about">About Page</a>
    </body>
    </html>
    """
    return html

if __name__ == '__main__':
    app.run(debug=True)
```

**What this does:**

Returns actual HTML (the language of web pages) instead of plain text. The browser renders it as a formatted webpage with heading, paragraph, and link.

---

## Example

Here is a complete Flask app with multiple routes and dynamic content:

```python
from flask import Flask
from datetime import datetime

app = Flask(__name__)

# Homepage
@app.route('/')
def home():
    return '''
    <h1>My Python Web App</h1>
    <ul>
        <li><a href="/time">Current Time</a></li>
        <li><a href="/greet/YourName">Greet Me</a></li>
        <li><a href="/calculate/10/5">Calculator</a></li>
    </ul>
    '''

# Show current time
@app.route('/time')
def show_time():
    now = datetime.now()
    time_str = now.strftime('%I:%M:%S %p')
    return f'<h2>Current Time: {time_str}</h2><a href="/">Back</a>'

# Greet user by name
@app.route('/greet/<name>')
def greet(name):
    return f'''
    <h2>Hello, {name}!</h2>
    <p>Welcome to the web app!</p>
    <a href="/">Back</a>
    '''

# Simple calculator
@app.route('/calculate/<int:a>/<int:b>')
def calculate(a, b):
    return f'''
    <h2>Calculator</h2>
    <p>{a} + {b} = {a + b}</p>
    <p>{a} - {b} = {a - b}</p>
    <p>{a} × {b} = {a * b}</p>
    <p>{a} ÷ {b} = {a / b if b != 0 else "Cannot divide by zero"}</p>
    <a href="/">Back</a>
    '''

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

**What happens here?**

We create a small website with multiple pages. Each route returns HTML. The calculator route takes two numbers from the URL and performs calculations.

Visit:
- `http://localhost:5000/` → Homepage with links
- `http://localhost:5000/time` → Current time
- `http://localhost:5000/greet/Alice` → Greeting
- `http://localhost:5000/calculate/20/4` → Math operations

**This is a real web application!**

---

## Guided Practice

**Note:** Flask requires installation outside the browser. These examples teach the concepts.

**Step 1:** Understand the Flask pattern:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/path')
def function_name():
    return "What to show on webpage"

app.run()
```

**Step 2:** Practice in our browser (concept simulation):

```python
# Simulate route functions
def home():
    return "Welcome to homepage!"

def about():
    return "This is the about page"

def user_profile(username):
    return f"Profile for: {username}"

# Test them
print(home())
print(about())
print(user_profile("Alice"))
```

**Step 3:** Build route logic:

```python
def process_route(path, data=None):
    """Simulate Flask routing"""
    if path == '/':
        return "Homepage"
    elif path == '/about':
        return "About page"
    elif path.startswith('/user/'):
        username = path.split('/')[-1]
        return f"Hello, {username}!"
    else:
        return "404 Not Found"

# Test routes
print(process_route('/'))
print(process_route('/about'))
print(process_route('/user/Alice'))
print(process_route('/unknown'))
```

**What this teaches:**

The logic behind web routing - matching URLs to functions and returning appropriate content.

---

## Homework

Your task is to **design a Flask web application** (planning exercise).

**Requirements:**

- Design an app with at least 5 routes
- Write the Flask code structure (even if you can't run it in browser)
- Include:
  - Homepage route ('/')
  - About route ('/about')
  - Dynamic route with parameter (e.g., '/item/<name>')
  - Route that shows current date/time
  - Route with simple calculation or logic
- Add HTML formatting to make responses look good
- Include error handling (try-except)

**Example structure:**

```python
from flask import Flask
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return '''
    <h1>My App</h1>
    <p>Links:</p>
    <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/time">Time</a></li>
    </ul>
    '''

# Add 3 more routes...

if __name__ == '__main__':
    app.run(debug=True)
```

**Hints:**

Each route needs:
- `@app.route('/path')` decorator
- Function that returns HTML string
- Can use f-strings for dynamic content

Dynamic routes:

```python
@app.route('/product/<product_name>')
def show_product(product_name):
    return f"<h2>Product: {product_name}</h2>"
```

HTML formatting:

```python
return f'''
<html>
<body>
    <h1>{title}</h1>
    <p>{content}</p>
</body>
</html>
'''
```

**Bonus challenge:** Add a route that takes two numbers in the URL and returns a formatted multiplication table.

**Note:** This homework is about understanding web concepts. You'll deploy real Flask apps in later lessons!

---

## Reflection

Before continuing, answer these questions:

1. What is Flask and what is it used for?
2. What is a route in web development?
3. How do you pass data to a Flask route through the URL?
4. What does the `@app.route()` decorator do?
5. How is web development different from terminal programs?

If you understand these concepts, you are ready to build web applications.

---

**Amazing progress!** You now understand web development fundamentals and the Flask framework. Web development is one of the most popular uses of Python. In the next lessons, you will build complete web applications with forms, databases, and user interactions - the skills used by professional web developers every day.




