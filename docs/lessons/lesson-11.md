# Working with External Libraries

---

## ⚠️ **IMPORTANT: Transitioning to Real Python**

**Congratulations on completing Lessons 1-10!** You have mastered Python fundamentals in the browser.

**Starting with Lesson 11, you'll learn advanced topics that work best with real Python installed on your computer.**

**📚 Before continuing, please visit our installation guide:**

<div style="background: #dbeafe; padding: 1rem; border-radius: 4px; border-left: 4px solid #3b82f6; margin: 1rem 0;">
  <strong>🔗 Installation Guide:</strong> <a href="../install-python.html" target="_blank" style="color: #3b82f6; font-weight: bold;">How to Install Real Python</a>
</div>

This guide covers:
- Installing Python on Windows/Mac/Linux
- Setting up a code editor (VS Code)
- Using pip to install libraries
- Virtual environments
- Everything you need!

**Direct download:** <a href="https://www.python.org/downloads/" target="_blank">Python.org Official Downloads</a>

**You can still READ these lessons in the browser, but to PRACTICE the examples, you'll need real Python installed.**

---

## Goal

By the end of this lesson, you will understand what Python libraries are, how to install and use them, and how they dramatically expand what you can build with Python.

---

## Explanation

So far, you have used Python's built-in features: print, input, lists, functions, and classes. These are powerful, but Python becomes even more powerful when you use **libraries**.

A **library** (also called a package or module) is pre-written code that someone else created and shared. Instead of writing everything from scratch, you can use libraries to add features to your programs quickly.

Think of libraries like tools in a toolbox. Python comes with some basic tools (built-in functions), but libraries give you specialized tools for specific jobs: web scraping, data analysis, game development, machine learning, and much more.

**Why use libraries?**

Libraries help you:
- Save time (don't reinvent the wheel)
- Use tested, reliable code
- Build complex features quickly
- Focus on your unique application logic
- Learn from professional code

**The Python ecosystem has over 400,000 libraries!**

---

**Installing libraries with pip:**

**pip** is Python's package installer. It downloads and installs libraries from the Python Package Index (PyPI).

**In a real Python installation** (not browser):

```bash
pip install requests
```

**What this does:**

This command downloads the `requests` library and installs it so you can use it in your programs.

**Note:** In our browser environment (Pyodide), some packages are pre-installed, and others can be loaded with `micropip`. For real development, you'll use pip on your computer.

---

**Importing libraries:**

After a library is installed, you import it in your code:

```python
import requests
```

**What this does:**

This makes the `requests` library available in your program. You can now use its functions.

**Using library functions:**

```python
import requests

response = requests.get('https://api.github.com')
print(response.status_code)
```

**What this does:**

We use the `requests.get()` function to fetch data from a website. This function comes from the requests library - we didn't have to write the HTTP request code ourselves!

---

**Common import patterns:**

**Import entire library:**

```python
import math

result = math.sqrt(16)
print(result)
```

**Import specific functions:**

```python
from math import sqrt, pi

print(sqrt(16))
print(pi)
```

**Import with alias (shorter name):**

```python
import datetime as dt

now = dt.datetime.now()
print(now)
```

**What these do:**

Different ways to import give you flexibility in how you use library code in your program.

---

## Example

Here is a program using the `datetime` library (built-in):

```python
from datetime import datetime, timedelta

# Get current date and time
now = datetime.now()
print(f"Current time: {now.strftime('%Y-%m-%d %H:%M:%S')}")

# Calculate future date
tomorrow = now + timedelta(days=1)
print(f"Tomorrow: {tomorrow.strftime('%Y-%m-%d')}")

# Calculate age
birthday = datetime(2000, 5, 15)
age_days = (now - birthday).days
age_years = age_days // 365
print(f"Age: {age_years} years ({age_days} days)")
```

**What happens here?**

We import datetime functions, get the current time, calculate tomorrow's date, and compute someone's age. All using the datetime library's powerful date handling. The output might be:

```
Current time: 2026-01-13 14:30:00
Tomorrow: 2026-01-14
Age: 25 years (9244 days)
```

**Using the json library:**

```python
import json

# Convert Python dictionary to JSON string
person = {"name": "Alice", "age": 25, "city": "Boston"}
json_string = json.dumps(person, indent=2)
print(json_string)

# Convert JSON string back to Python dictionary
data = json.loads(json_string)
print(f"Name: {data['name']}")
```

**What this does:**

JSON is a common data format. The json library lets you convert between Python dictionaries and JSON strings easily.

---

## Guided Practice

Let's practice using libraries.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Use the math library for calculations:

```python
import math

# Square root
print(f"Square root of 25: {math.sqrt(25)}")

# Power
print(f"2 to the power of 10: {math.pow(2, 10)}")

# Rounding
print(f"Pi rounded: {math.ceil(math.pi)}")

# Trigonometry
print(f"Sin(90 degrees): {math.sin(math.radians(90))}")
```

**Step 3:** Run your code and see mathematical operations.

**Step 4:** Use the random library:

```python
import random

# Random number between 1 and 100
print(f"Random number: {random.randint(1, 100)}")

# Random choice from list
colors = ["red", "blue", "green", "yellow"]
print(f"Random color: {random.choice(colors)}")

# Shuffle a list
numbers = [1, 2, 3, 4, 5]
random.shuffle(numbers)
print(f"Shuffled: {numbers}")
```

**Step 5:** Work with dates:

```python
from datetime import datetime, timedelta

today = datetime.now()
print(f"Today: {today.strftime('%A, %B %d, %Y')}")

# Add 7 days
next_week = today + timedelta(days=7)
print(f"Next week: {next_week.strftime('%A, %B %d, %Y')}")

# Calculate days until New Year
new_year = datetime(today.year + 1, 1, 1)
days_until = (new_year - today).days
print(f"Days until New Year: {days_until}")
```

**Step 6:** Convert data with json:

```python
import json

# Create a student record
student = {
    "name": "Alex",
    "grades": [85, 92, 88],
    "active": True
}

# Convert to JSON
json_data = json.dumps(student, indent=2)
print("JSON format:")
print(json_data)

# Parse back
parsed = json.loads(json_data)
print(f"\nStudent name: {parsed['name']}")
print(f"Average grade: {sum(parsed['grades']) / len(parsed['grades'])}")
```

**What happens:**

You see how to convert Python data to JSON (used in web APIs) and back.

---

## Homework

Your task is to build a **simple data analyzer** using the json library and your Python skills.

**Requirements:**

- Create a dictionary representing a small business's monthly sales data
  - Include: month name, total sales, number of customers, top product
- Create a list with data for 3 months
- Convert the list to JSON format (use json.dumps with indent=2)
- Print the JSON string
- Parse it back (use json.loads)
- Calculate and print:
  - Total sales across all months
  - Average customers per month
  - Which month had highest sales

**Example data structure:**

```python
sales_data = [
    {"month": "January", "sales": 15000, "customers": 120, "top_product": "Widget A"},
    {"month": "February", "sales": 18000, "customers": 145, "top_product": "Widget B"},
    {"month": "March", "sales": 21000, "customers": 160, "top_product": "Widget A"}
]
```

**Hints:**

Import json library:

```python
import json
```

Convert to JSON and print:

```python
json_string = json.dumps(sales_data, indent=2)
print("JSON Data:")
print(json_string)
```

Parse back and analyze:

```python
data = json.loads(json_string)

total_sales = sum(month["sales"] for month in data)
```

Find month with highest sales:

```python
best_month = max(data, key=lambda x: x["sales"])
print(f"Best month: {best_month['month']}")
```

**Bonus challenge:** Add the datetime library to include actual dates for each month, and calculate how long ago each month was from today.

This homework combines dictionaries, lists, libraries, loops, and data analysis.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What is a Python library?
2. How do you import a library?
3. What is the difference between `import math` and `from math import sqrt`?
4. What is pip used for?
5. Name three built-in Python libraries you learned about.

If you understand these concepts, you are ready to explore the vast Python ecosystem.

---

**Fantastic work!** You now understand how to leverage Python's massive library ecosystem. This is a game-changer - instead of building everything from scratch, you can use proven, professional tools. In the next lesson, you will learn how to work with web APIs to fetch data from the internet, opening up even more possibilities.

