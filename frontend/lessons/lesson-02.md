# Variables and Data Types

## Goal

By the end of this lesson, you will understand what variables are, how to create them, and how to work with different types of data in Python.

---

## Explanation

A **variable** is a container that stores a value. Think of it like a labeled box. You can put something inside the box, and later you can look inside to see what you stored.

In Python, you create a variable by giving it a name and assigning it a value using the equals sign.

Here is an example:

```python
age = 25
```

**What this does:**

This creates a variable called `age` and stores the number `25` inside it.

**Why use variables?**

Variables let you store information and reuse it. Instead of typing the same value over and over, you store it once and refer to it by name.

**Data Types**

Python works with different types of data. Here are the most common ones:

**1. Numbers (integers):** Whole numbers like:

```python
10
42
-5
```

**2. Numbers (floats):** Decimal numbers like:

```python
3.14
0.5
-2.7
```

**3. Text (strings):** Words or sentences inside quotes like:

```python
"hello"
"Python"
```

**4. True or False (booleans):**

```python
True
False
```

Python is smart. It figures out the type automatically based on what you give it.

---

## Example

Here is a program that uses variables:

```python
name = "Alex"
age = 25
height = 5.9
is_student = True

print("Name:", name)
print("Age:", age)
print("Height:", height)
print("Student:", is_student)
```

**What happens here?**

- We create four variables: `name`, `age`, `height`, and `is_student`
- Each variable stores a different type of data
- We use `print()` to display each variable

When you run this program, Python shows:

```
Name: Alex
Age: 25
Height: 5.9
Student: True
```

Notice how Python remembered what we stored in each variable.

---

## Guided Practice

Let's practice creating and using variables.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Create three variables:

```python
favorite_color = "blue"
lucky_number = 7
is_learning = True
```

**Step 3:** Use `print()` to display each variable:

```python
print(favorite_color)
print(lucky_number)
print(is_learning)
```

**Step 4:** Run your code and check the output.

**Step 5:** Now try this. Change the value of lucky_number to a different number, then print it again:

```python
favorite_color = "blue"
lucky_number = 7
print(lucky_number)

lucky_number = 13
print(lucky_number)
```

**What happens:**

Run this and notice that the variable now holds the new value. Variables can change—that is why they are called variables.

---

## Homework

Your task is to create a program about yourself using **at least five variables**.

**Requirements:**

- Create variables for: your name, age, favorite hobby, favorite food, and whether you like Python
- Use appropriate data types:
  - Text must be in quotes
  - Numbers without quotes  
  - True or False without quotes
- Print all five variables with labels so someone reading the output knows what each value means

**Example output format:**

```
Name: Jordan
Age: 17
Hobby: reading
Food: pizza
Likes Python: True
```

**Hints:**

Text needs quotes:

```python
"like this"
```

Numbers do not need quotes:

```python
17
```

True and False start with a capital letter and have no quotes:

```python
True
False
```

Try to complete this on your own. If you get stuck, review the example above.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What is a variable?
2. How do you create a variable in Python?
3. What are the four main types of data we learned about?
4. Can a variable's value change after you create it?

If you can explain these concepts, you are ready to continue.

---

**Well done!** You now know how to store and use information in Python. In the next lesson, you will learn how to get input from users and show output in more useful ways.

