# Input and Output

## Goal

By the end of this lesson, you will know how to get information from users and display results in a clear and useful way.

---

## Explanation

So far, you have written programs that display messages using `print()`. But what if you want your program to interact with the person using it?

That is where **input** comes in.

**Input** means getting information from the user. In Python, we use the input() function to ask the user a question and store their answer.

**Output** means showing information to the user. You already know how to do this with print().

When you combine input and output, you can create programs that feel interactive and personal.

**How input works:**

When you use input(), Python pauses and waits for the user to type something. After they press Enter, Python stores what they typed.

Here is the basic pattern:

```python
variable_name = input("Your question here: ")
```

**What this does:**

The text inside the parentheses is the question or message shown to the user. Their answer gets stored in the variable.

---

## Example

Here is a simple interactive program:

```python
name = input("What is your name? ")
print("Hello, " + name + "!")
```

**What happens when you run this?**

1. Python displays: `What is your name?`
2. The program waits for you to type something
3. You type your name and press Enter
4. Python stores your answer in the variable `name`
5. Python displays: `Hello, [your name]!`

Notice how we combined text and a variable using the `+` sign. This is called **concatenation**—joining pieces of text together.

**Another example:**

```python
age = input("How old are you? ")
print("You are " + age + " years old.")
```

**What happens:**

When you run this, Python asks for your age, stores it, and then displays it back to you in a sentence.

---

## Guided Practice

Let's create an interactive program together.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Write a program that asks two questions:

```python
favorite_food = input("What is your favorite food? ")
favorite_color = input("What is your favorite color? ")
```

**Step 3:** Display the answers in a friendly way:

```python
print("You like " + favorite_food + " and the color " + favorite_color + ".")
```

**Step 4:** Run your program. Type answers when prompted and see the result.

**Step 5:** Try adding a third question about a hobby. Ask the question, store the answer, and include it in your output message.

You are now creating programs that respond to what users tell them. This is the foundation of all interactive software.

---

## Homework

Your task is to create a program that asks the user **three questions** and then displays a summary using their answers.

**Requirements:**

- Ask for: their name, their favorite animal, and their favorite season
- Store each answer in a variable
- Display a complete sentence using all three answers

**Example interaction:**

```
What is your name? Taylor
What is your favorite animal? dolphin
What is your favorite season? summer

Hi Taylor! You like dolphins and enjoy summer the most.
```

**Hints:**

Use input() three times to ask questions:

```python
name = input("What is your name? ")
animal = input("What is your favorite animal? ")
season = input("What is your favorite season? ")
```

Use print() with + to combine text and variables:

```python
print("Hi " + name + "! You like " + animal + ".")
```

Make sure there are spaces in your output so words do not run together.

Do not rush. Think through each step. Try it yourself before looking for help.

---

## Reflection

Before moving forward, answer these questions:

1. What does the `input()` function do?
2. What happens when Python runs a line with `input()`?
3. How do you combine text and variables in a `print()` statement?
4. Why is it useful to get input from users?

If you understand these concepts, you are building a strong foundation.

---

**Excellent progress!** You now know how to create programs that interact with users. This is a key skill in programming. You are ready for more advanced topics in the next lessons.

