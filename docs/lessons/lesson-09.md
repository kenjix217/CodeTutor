# Error Handling

## Goal

By the end of this lesson, you will understand how to handle errors gracefully in your programs using try, except, and finally statements.

---

## Explanation

When you write programs, errors will happen. A user might enter invalid input. A file might not exist. A calculation might divide by zero.

Without error handling, your program crashes when an error occurs. All progress is lost. The user sees a confusing error message.

This is where **error handling** comes in.

**Error handling** lets your program:
- Catch errors before they crash the program
- Respond to problems gracefully
- Give users helpful messages
- Continue running after an error

Think of error handling like a safety net. If something goes wrong, the safety net catches it instead of letting the program fall apart.

**Types of errors:**

Python has many error types. Here are common ones:

```python
# ValueError - wrong value type
int("hello")  # Can't convert text to number

# ZeroDivisionError - division by zero
10 / 0  # Math error

# FileNotFoundError - file doesn't exist
open("missing.txt")  # File not found

# TypeError - wrong data type
"5" + 5  # Can't add string and number
```

Each error type tells you what went wrong.

---

**The try-except block:**

To handle errors, use a try-except block:

```python
try:
    # Code that might cause an error
    number = int(input("Enter a number: "))
    print(f"You entered: {number}")
except:
    # Code that runs if an error occurs
    print("That's not a valid number!")
```

**What this does:**

Python tries to run the code in the `try` block. If an error occurs, it runs the code in the `except` block instead of crashing. The program continues.

**Catching specific errors:**

You can catch specific error types:

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Error: Cannot divide by zero!")
```

**What this does:**

This catches only ZeroDivisionError. Other errors would still cause the program to crash. This is more precise.

**Multiple except blocks:**

You can handle different errors differently:

```python
try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print(f"Result: {result}")
except ValueError:
    print("Please enter a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
```

**What this does:**

If the user enters text, the ValueError is caught. If they enter 0, the ZeroDivisionError is caught. The program handles each situation appropriately.

---

**The finally block:**

Sometimes you want code to run whether an error occurred or not. Use `finally`:

```python
try:
    file = open("data.txt", "r")
    content = file.read()
    print(content)
except FileNotFoundError:
    print("File not found")
finally:
    print("Attempted to read file")
```

**What this does:**

The `finally` block always runs, whether the try succeeded or failed. This is useful for cleanup operations.

---

## Example

Here is a program that safely gets user input:

```python
def get_positive_number():
    while True:
        try:
            number = int(input("Enter a positive number: "))
            if number > 0:
                return number
            else:
                print("Please enter a positive number (greater than 0)")
        except ValueError:
            print("That's not a valid number. Try again.")

result = get_positive_number()
print(f"You entered: {result}")
```

**What happens here?**

The function keeps asking until it gets a valid positive number. If the user enters text, the ValueError is caught and they get a helpful message. If they enter a negative number, they are told to enter a positive one. The loop continues until valid input is provided.

**Working with files safely:**

```python
def read_file_safe(filename):
    try:
        with open(filename, "r") as file:
            return file.read()
    except FileNotFoundError:
        return f"Error: {filename} not found"
    except Exception as e:
        return f"Error reading file: {e}"

content = read_file_safe("data.txt")
print(content)
```

**What this does:**

If the file exists, it reads it. If not, it returns an error message instead of crashing. The program continues either way.

---

## Guided Practice

Let's practice error handling.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Try this code without error handling (it will crash):

```python
number = int(input("Enter a number: "))
print(f"Double: {number * 2}")
```

**Step 3:** Run it and enter text (like "hello"). You will see a ValueError.

**Step 4:** Now add error handling:

```python
try:
    number = int(input("Enter a number: "))
    print(f"Double: {number * 2}")
except ValueError:
    print("Error: Please enter a valid number")
```

**What happens:**

Run this and enter text. Instead of crashing, you see the error message.

**Step 5:** Handle division by zero:

```python
try:
    a = int(input("Enter first number: "))
    b = int(input("Enter second number: "))
    result = a / b
    print(f"Result: {result}")
except ValueError:
    print("Please enter valid numbers")
except ZeroDivisionError:
    print("Cannot divide by zero")
```

**Step 6:** Add a finally block:

```python
try:
    number = int(input("Enter a number: "))
    print(f"Square: {number ** 2}")
except ValueError:
    print("Invalid input")
finally:
    print("Thank you for using the calculator!")
```

**What happens:**

The finally block runs whether the calculation succeeded or failed.

---

## Homework

Your task is to create a safe calculator that handles all possible errors.

**Requirements:**

- Ask the user for two numbers and an operation (+, -, *, /)
- Perform the calculation
- Handle these errors:
  - ValueError (if input is not a number)
  - ZeroDivisionError (if dividing by zero)
- If an error occurs, show a helpful message
- Use try-except blocks for error handling

**Example interaction (successful):**

```
Enter first number: 10
Enter second number: 2
Enter operation (+, -, *, /): /
Result: 5.0
```

**Example interaction (error):**

```
Enter first number: 10
Enter second number: 0
Enter operation (+, -, *, /): /
Error: Cannot divide by zero
```

**Hints:**

Get the inputs:

```python
try:
    num1 = int(input("Enter first number: "))
    num2 = int(input("Enter second number: "))
    operation = input("Enter operation (+, -, *, /): ")
```

Perform the calculation with error handling:

```python
    if operation == "/":
        result = num1 / num2
    elif operation == "*":
        result = num1 * num2
    # Add + and -
    
    print(f"Result: {result}")
```

Add except blocks for errors:

```python
except ValueError:
    print("Error: Please enter valid numbers")
except ZeroDivisionError:
    print("Error: Cannot divide by zero")
```

**Bonus challenge:** Add a `finally` block that always prints "Calculator finished" at the end, regardless of whether an error occurred.

This homework combines functions, conditionals, and error handling. Take your time and think through each part.

---

## Reflection

Before moving to the final lesson, answer these questions:

1. What does a try-except block do?
2. What is the difference between `except ValueError` and just `except`?
3. What does the `finally` block do?
4. Why is error handling important in real programs?
5. What are some common errors you might need to handle?

If you can answer these, you understand how to write robust programs that handle problems gracefully.

---

**Excellent progress!** You now know how to make your programs resilient to errors. Error handling is what separates toy programs from professional applications. In the final lesson, you will get an introduction to Object-Oriented Programming, a powerful way to organize complex programs.




