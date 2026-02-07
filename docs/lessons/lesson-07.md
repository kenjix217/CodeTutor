# Lists and Dictionaries

## Goal

By the end of this lesson, you will understand how to work with lists and dictionaries to store and organize collections of data in Python.

---

## Explanation

So far, you have worked with single values in variables:

```python
name = "Alex"
age = 25
```

But what if you need to store many related values? Like a list of students or a collection of scores?

This is where **lists** and **dictionaries** come in.

**Lists:**

A **list** is an ordered collection of items. Think of it like a shopping list or a to-do list.

Here is how you create a list:

```python
fruits = ["apple", "banana", "cherry"]
```

Lists use square brackets. Items are separated by commas. Each item has a position (called an index) starting from 0.

**Accessing list items:**

```python
fruits = ["apple", "banana", "cherry"]

print(fruits[0])  # First item
print(fruits[1])  # Second item
print(fruits[2])  # Third item
```

**What this does:**

The numbers in square brackets are indices. Index 0 is the first item, index 1 is the second, and so on. The output is:

```
apple
banana
cherry
```

**Important:** Lists start counting at 0, not 1.

**Modifying lists:**

You can change list items, add new ones, or remove items:

```python
fruits = ["apple", "banana"]

fruits.append("cherry")  # Add to end
print(fruits)

fruits[0] = "orange"  # Change first item
print(fruits)
```

**What this does:**

The output is:

```
['apple', 'banana', 'cherry']
['orange', 'banana', 'cherry']
```

---

**Dictionaries:**

A **dictionary** stores data in key-value pairs. Think of it like a real dictionary: you look up a word (key) and get its definition (value).

Here is how you create a dictionary:

```python
person = {
    "name": "Alex",
    "age": 25,
    "city": "Boston"
}
```

Dictionaries use curly braces. Each entry has a key (like "name") and a value (like "Alex").

**Accessing dictionary values:**

```python
person = {"name": "Alex", "age": 25}

print(person["name"])
print(person["age"])
```

**What this does:**

You use the key in square brackets to get the value. The output is:

```
Alex
25
```

**Adding and changing values:**

```python
person = {"name": "Alex"}

person["age"] = 25  # Add new key-value pair
person["name"] = "Jordan"  # Change existing value

print(person)
```

**What this does:**

The output is:

```
{'name': 'Jordan', 'age': 25}
```

---

## Example

Here is a program that uses both lists and dictionaries:

```python
# List of scores
scores = [85, 92, 78, 90]

print("All scores:", scores)
print("First score:", scores[0])
print("Average:", sum(scores) / len(scores))

# Dictionary for a student
student = {
    "name": "Alex",
    "age": 20,
    "major": "Computer Science"
}

print(f"Student: {student['name']}")
print(f"Age: {student['age']}")
print(f"Major: {student['major']}")
```

**What happens here?**

We create a list of scores and calculate the average. Then we create a dictionary for a student and display the information. The output is:

```
All scores: [85, 92, 78, 90]
First score: 85
Average: 86.25
Student: Alex
Age: 20
Major: Computer Science
```

**Looping through lists and dictionaries:**

You can use loops to process every item:

```python
# Loop through list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# Loop through dictionary keys
person = {"name": "Alex", "age": 25}
for key in person:
    print(f"{key}: {person[key]}")
```

**What this does:**

The first loop goes through each fruit. The second loop goes through each key in the dictionary and prints the key-value pair.

---

## Guided Practice

Let's practice with lists and dictionaries.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Create a list of your three favorite hobbies:

```python
hobbies = ["reading", "coding", "gaming"]

for hobby in hobbies:
    print(f"I enjoy {hobby}")
```

**Step 3:** Run your code and see the output.

**Step 4:** Create a dictionary about yourself:

```python
me = {
    "name": "Your Name",
    "age": 25,
    "favorite_color": "blue"
}

print(f"My name is {me['name']}")
print(f"I am {me['age']} years old")
print(f"My favorite color is {me['favorite_color']}")
```

**Step 5:** Try adding a new item to your dictionary:

```python
me["city"] = "Boston"
print(me)
```

**What happens:**

Run this and see how dictionaries can grow as you add more information.

**Step 6:** Combine lists and functions:

```python
def get_longest(words):
    longest = ""
    for word in words:
        if len(word) > len(longest):
            longest = word
    return longest

my_words = ["cat", "elephant", "dog", "butterfly"]
result = get_longest(my_words)
print(f"Longest word: {result}")
```

**What this does:**

The function finds the longest word in a list. This combines lists, loops, conditions, and functions.

---

## Homework

Your task is to create a program that manages a simple contact list using a list of dictionaries.

**Requirements:**

- Create a list that contains at least 3 dictionaries
- Each dictionary represents a person with: name, age, and city
- Write a function that takes the list and prints all contacts in a formatted way
- Call the function to display all contacts

**Example output:**

```
Contact 1:
  Name: Alice
  Age: 28
  City: Boston

Contact 2:
  Name: Bob
  Age: 35
  City: Seattle

Contact 3:
  Name: Charlie
  Age: 22
  City: Austin
```

**Hints:**

Create the list of dictionaries:

```python
contacts = [
    {"name": "Alice", "age": 28, "city": "Boston"},
    {"name": "Bob", "age": 35, "city": "Seattle"},
    # Add one more...
]
```

Create the function:

```python
def print_contacts(contact_list):
    # Loop through the list
    # Print each contact's information
```

Use a for loop with enumerate to get the contact number:

```python
for index, contact in enumerate(contact_list):
    print(f"Contact {index + 1}:")
    # Print contact details
```

**Bonus challenge:** Add a function called `find_oldest` that takes the contact list and returns the name of the oldest person.

Try this yourself. Break it down into small steps. You know everything you need: lists, dictionaries, loops, and functions.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What is a list? How do you create one?
2. How do you access the first item in a list?
3. What is a dictionary? How is it different from a list?
4. How do you add a new key-value pair to a dictionary?
5. Can you store dictionaries inside a list? Can you store lists inside a dictionary?

If you understand these concepts, you are building advanced Python skills.

---

**Excellent work!** You now know how to work with collections of data. Lists and dictionaries are used in almost every real Python program. Combined with functions, you can build sophisticated applications. In the next lessons, you will learn about file handling, error management, and more advanced topics.




