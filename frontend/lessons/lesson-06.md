# Functions

## Goal

By the end of this lesson, you will understand what functions are, how to create them, and why they make your code more organized and reusable.

---

## Explanation

Imagine you need to greet different people in your program. You could write:

```python
print("Hello, Alice!")
print("Hello, Bob!")
print("Hello, Charlie!")
```

But what if the greeting gets more complex? What if you want to change the greeting format? You would have to update every line.

This is where **functions** come in.

A **function** is a reusable block of code that performs a specific task. You define it once, then use it many times.

Think of a function like a recipe. You write the recipe once (define the function), then you can cook the dish anytime you want (call the function).

**Why use functions?**

Functions help you:
- Avoid repeating the same code
- Organize your program into logical parts
- Make code easier to read and maintain
- Fix bugs in one place instead of many

**How to create a function:**

```python
def function_name():
    # Code here runs when function is called
```

The word `def` tells Python you are defining a function. The name comes next, followed by parentheses and a colon. The code inside must be indented.

**How to use (call) a function:**

```python
function_name()
```

Simply write the function name with parentheses. Python will run the code inside the function.

---

## Example

Here is a simple function:

```python
def greet():
    print("Hello!")
    print("Welcome to Python!")

greet()
greet()
greet()
```

**What this does:**

We define a function called `greet` that prints two messages. Then we call it three times. The output is:

```
Hello!
Welcome to Python!
Hello!
Welcome to Python!
Hello!
Welcome to Python!
```

The function runs three times because we called it three times. We wrote the code once but used it three times.

**Functions with parameters:**

You can make functions more flexible by giving them **parameters** (also called arguments). Parameters are values you pass to the function.

```python
def greet(name):
    print(f"Hello, {name}!")
    print("Welcome to Python!")

greet("Alice")
greet("Bob")
```

**What this does:**

The function takes a parameter called `name`. When we call the function, we give it a value. The output is:

```
Hello, Alice!
Welcome to Python!
Hello, Bob!
Welcome to Python!
```

Each call uses a different name. The function is flexible.

**Functions that return values:**

Functions can also give back a result using `return`:

```python
def double(number):
    return number * 2

result = double(5)
print(result)
```

**What this does:**

The function takes a number, multiplies it by 2, and returns the result. We store the result in a variable and print it. The output is:

```
10
```

The `return` statement sends a value back to where the function was called.

---

## Guided Practice

Let's create and use functions.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Create a function that adds two numbers:

```python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)
```

**Step 3:** Run your code. You should see:

```
8
```

**Step 4:** Now create a function that checks if a number is even:

```python
def is_even(number):
    if number % 2 == 0:
        return True
    else:
        return False

print(is_even(4))
print(is_even(7))
```

**What this does:**

The `%` operator gives the remainder after division. If a number divided by 2 has no remainder, it is even. The output is:

```
True
False
```

**Step 5:** Create a function that uses a loop:

```python
def print_countdown(start):
    for i in range(start, 0, -1):
        print(i)
    print("Blast off!")

print_countdown(5)
```

**What this does:**

The function counts down from the given number. The output is:

```
5
4
3
2
1
Blast off!
```

Notice how functions can use everything you have learned: variables, conditions, loops.

---

## Homework

Your task is to create a function that calculates the area of a rectangle and use it to calculate areas for different rectangles.

**Requirements:**

- Create a function called `rectangle_area`
- The function should take two parameters: `width` and `height`
- The function should return the area (width times height)
- Call the function at least three times with different values
- Print the results with labels

**Example output:**

```
Rectangle 1 area: 20
Rectangle 2 area: 50
Rectangle 3 area: 12
```

**Hints:**

Define the function:

```python
def rectangle_area(width, height):
    # Calculate and return area
```

Call the function:

```python
area1 = rectangle_area(4, 5)
print("Rectangle 1 area:", area1)
```

Repeat for different rectangles.

**Bonus challenge:** Create a second function called `square_area` that takes only one parameter (side length) and returns the area of a square. Use it to calculate areas of three different squares.

Try this on your own. Think about what the function needs to do, then write it step by step.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What is a function?
2. What is the difference between defining a function and calling a function?
3. What are parameters used for?
4. What does the `return` statement do?
5. Why are functions useful?

If you can explain these concepts clearly, you are ready to continue.

---

**Amazing progress!** You now know how to organize code into reusable functions. This is a crucial skill that professional programmers use every day. Functions make your programs cleaner, easier to understand, and easier to maintain. In the next lesson, you will learn about more advanced data structures like lists and dictionaries.




