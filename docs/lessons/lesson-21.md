# Debugging Strategies

## Goal

Learn to find and fix bugs in your Python code like a pro detective! 🕵️

---

## Explanation

**Bugs** are mistakes in your code that make it not work correctly. Every programmer (even experts!) writes bugs. The difference is that good programmers know how to find and fix them quickly.

**Why do bugs happen?**
- Typos (misspelled words or names)
- Missing quotes or parentheses
- Wrong logic (thinking through the problem incorrectly)
- Forgetting important parts of code

**Debugging** is like being a detective. You look for clues, follow leads, and solve the mystery of "why isn't this working?"

---

## Example 1: Reading Error Messages

Python tries to tell you what's wrong with error messages. Let's learn to read them!

```python
# This code has a bug
name = "Alice"
print(nam)
```

**Error Message:**
```
NameError: name 'nam' is not defined
```

**How to read this:**
1. **Error Type:** `NameError` - Something about a name/variable
2. **Details:** `name 'nam' is not defined` - Which name is wrong
3. **Line Number:** Shows which line has the error

**The Fix:** Change `nam` to `name`

```python
# Fixed code
name = "Alice"
print(name)  # Changed nam to name
```

---

## Example 2: print() Debugging

The simplest way to debug is to add `print()` statements to see what's happening in your code.

```python
# What's wrong with this?
total = 0
for i in range(5):
    total += i

print(f"The total is: {total}")
```

**Expected output:** 0+1+2+3+4 = 10  
**Actual output:** The total is: 10

That looks right! Let's try a different calculation:

```python
# Add debug prints to see each step
total = 0
for i in range(5):
    print(f"Adding {i} to total (currently {total})")
    total += i

print(f"\nThe total is: {total}")
```

**Output:**
```
Adding 0 to total (currently 0)
Adding 1 to total (currently 1)
Adding 2 to total (currently 3)
Adding 3 to total (currently 6)
Adding 4 to total (currently 10)

The total is: 10
```

Now you can see each step! This helps you understand what your code is doing.

---

## Example 3: Common Bugs and How to Fix Them

### Bug 1: Missing Quotes

```python
print(Hello)  # Wrong - missing quotes
print("Hello")  # Correct
```

### Bug 2: Mismatched Parentheses

```python
print((1 + 2) * 3  # Wrong - missing closing parenthesis
print((1 + 2) * 3)  # Correct
```

### Bug 3: Indentation Error

```python
for i in range(5):
print(i)  # Wrong - needs indentation

for i in range(5):
    print(i)  # Correct - indented with 4 spaces
```

### Bug 4: Using Assignment Instead of Comparison

```python
if age = 18:  # Wrong - single = is assignment
    print("You're an adult!")
    
if age == 18:  # Correct - double == is comparison
    print("You're an adult!")
```

---

## Guided Practice

**Exercise 1: Find the typo**

```python
# Find the bug!
name = "Bob"
age = 12
print(f"{name} is {yars} years old")
```

**Think about it:** What's different between the variable definition and where it's used?

**Answer:** `yars` should be `age`

---

**Exercise 2: Fix the math**

```python
# What's wrong?
price = 10
tax_rate = 0.08
total = price + tax_rate
print(f"Total: ${total}")
```

**Think about it:** How do you calculate tax? Is it addition?

**Answer:** Tax is calculated by multiplying: `total = price * (1 + tax_rate)`

---

**Exercise 3: Debug the loop**

```python
# Why isn't this working?
numbers = [1, 2, 3, 4, 5]
for i in numbers:
    if i == 3:
        print("Found it!")
```

**Question:** Does it print "Found it!"? Why or why not?

**Answer:** Yes! It prints "Found it!" because when i is 3, the condition `i == 3` is True.

---

## Debugging Checklist

When your code doesn't work, follow these steps:

1. ✅ **Read the error message** - It tells you what's wrong!
2. ✅ **Check the line number** - Look at where the error happened
3. ✅ **Look for typos** - Spelling matters!
4. ✅ **Check parentheses and quotes** - Make sure they match
5. ✅ **Add print() statements** - See what your code is doing
6. ✅ **Simplify the problem** - Test small pieces first
7. ✅ **Ask for help** - Sometimes a fresh pair of eyes helps

---

## Advanced Debugging Tip: Python Debugger

Python has a built-in debugger called `pdb`. It lets you pause your code and examine variables.

```python
import pdb

def calculate_average(numbers):
    pdb.set_trace()  # Pause here!
    total = sum(numbers)
    average = total / len(numbers)
    return average

nums = [10, 20, 30, 40, 50]
print(calculate_average(nums))
```

When you run this, the program pauses at `pdb.set_trace()`. You can type commands:
- `n` - Go to next line
- `p variable_name` - Print a variable
- `c` - Continue running
- `q` - Quit debugger

---

## Homework

**Debug Detective Challenge! 🕵️**

Find and fix all the bugs in this program. The program should:
1. Ask for a name
2. Ask for a favorite number
3. Calculate the number doubled
4. Print a friendly message

```python
# BUGGY CODE - Fix all the bugs!
name = input("What's your name? ")
number = int(input("What's your favorite number? "))

doubled = number + 2

if doubled > 20:
    print(f"{name}, your number doubled is huge!")
else
    print(f"{name}, your number doubled is {doubled}")
```

**Requirements:**
- Find all 3 bugs
- Fix them so the program runs correctly
- Add a comment explaining each bug
- Test with different inputs

**Hints:**
1. Check the math calculation
2. Check the if/else syntax
3. Test with different numbers

**Example Test:**
- Input: Alice, 10
- Expected: "Alice, your number doubled is 20!"

---

## Reflection

Before moving on, think about:

1. What is a bug?
2. How do you read a Python error message?
3. Why is print() debugging helpful?
4. What's the difference between `=` and `==`?
5. What do you do when you can't find a bug?

---

**Great detective work!** You now know how to find and fix bugs like a pro. Remember: every programmer writes bugs, but good programmers know how to find them quickly!

**Next up:** Real-World Mini Projects - Build cool things you can actually use! 🚀

**Deployment** means:
- Running your app on a server (not just your computer)
- Making it accessible via the internet
- Ensuring it's secure and reliable

**Key concepts:**

**Virtual Environments:**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install flask
```

**Requirements file:**
```bash
pip freeze > requirements.txt
```

**Environment variables:**
```python
import os

API_KEY = os.environ.get('API_KEY')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
```

---

## Golden Source Solutions

**Download the complete reference solutions for this lesson:**

<a href="golden_source/L21/" class="btn-primary" style="margin: 1rem 0; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; background-color: var(--color-primary); color: white; border-radius: 4px;">📥 Download Lesson 21 Solutions</a>

These solutions include:
- Complete homework solutions with detailed comments
- Additional examples and exercises
- Best practices and optimization techniques
- Common pitfalls and how to avoid them

**Note:** These solutions require real Python installed on your computer. They won't work in the browser-based editor.

---

## Example

Production-ready Flask app:

```python
from flask import Flask
import os

app = Flask(__name__)

# Use environment variables
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')
app.config['DEBUG'] = os.environ.get('DEBUG', 'False') == 'True'

@app.route('/')
def home():
    return "Production Flask App!"

@app.route('/health')
def health():
    return {"status": "healthy"}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

## Homework

Prepare one of your projects for deployment:
- Create requirements.txt
- Add environment variables for sensitive data
- Add health check endpoint
- Write deployment README
- Test locally before deployment

## Reflection

1. What is deployment?
2. Why use virtual environments?
3. What is requirements.txt?
4. Why use environment variables?
5. What is the difference between development and production?

**Great work!** You can now deploy real applications!




