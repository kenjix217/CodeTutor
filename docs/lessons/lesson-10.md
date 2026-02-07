# Introduction to Object-Oriented Programming

## Goal

By the end of this lesson, you will understand the basics of Object-Oriented Programming (OOP) and how to create and use classes and objects in Python.

---

## Explanation

So far, you have organized your code using functions. Functions group actions together. But what if you want to group related data AND actions together?

This is where **Object-Oriented Programming** (OOP) comes in.

**Object-Oriented Programming** is a way to organize code by creating **objects** that contain both data (attributes) and actions (methods).

Think of it this way: A car has properties (color, model, speed) and actions (accelerate, brake, turn). In OOP, you would create a Car object that bundles these together.

**Why use OOP?**

OOP helps you:
- Model real-world things in code
- Keep related data and functions together
- Reuse code more effectively
- Build larger programs that stay organized

**Classes and Objects:**

A **class** is a blueprint or template. It defines what properties and actions an object will have.

An **object** is a specific instance created from a class. Like a blueprint for a house (class) versus an actual house (object).

**Creating a class:**

```python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def bark(self):
        print(f"{self.name} says Woof!")
```

**What this does:**

The `class` keyword creates a new class called Dog. The `__init__` method is special - it runs when you create a new Dog object. The `self` parameter refers to the object itself.

**Creating and using objects:**

```python
my_dog = Dog("Buddy", 3)
print(f"My dog's name is {my_dog.name}")
print(f"My dog is {my_dog.age} years old")
my_dog.bark()
```

**What this does:**

We create a Dog object called `my_dog` with name "Buddy" and age 3. Then we access its properties and call its method. The output is:

```
My dog's name is Buddy
My dog is 3 years old
Buddy says Woof!
```

---

**Attributes and Methods:**

**Attributes** are variables that belong to an object (like `name` and `age`).

**Methods** are functions that belong to an object (like `bark()`).

**The self parameter:**

`self` refers to the specific object. When you write `self.name = name`, you are saying "this object's name is the name parameter."

**Creating multiple objects:**

```python
dog1 = Dog("Buddy", 3)
dog2 = Dog("Max", 5)

dog1.bark()
dog2.bark()
```

**What this does:**

We create two different Dog objects. Each has its own name and age. When we call `bark()`, each dog uses its own name. The output is:

```
Buddy says Woof!
Max says Woof!
```

---

## Example

Here is a class that models a bank account:

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    
    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited ${amount}. New balance: ${self.balance}")
    
    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds!")
        else:
            self.balance -= amount
            print(f"Withdrew ${amount}. New balance: ${self.balance}")
    
    def get_balance(self):
        return self.balance

# Create account
account = BankAccount("Alice", 100)

# Use the account
account.deposit(50)
account.withdraw(30)
print(f"Final balance: ${account.get_balance()}")
```

**What happens here?**

We create a BankAccount class with attributes (owner, balance) and methods (deposit, withdraw, get_balance). We create an account for Alice starting with $100, then deposit and withdraw money. The output is:

```
Deposited $50. New balance: $150
Withdrew $30. New balance: $120
Final balance: $120
```

**Real-world modeling:**

OOP is powerful because it models real-world things:

```python
class Student:
    def __init__(self, name):
        self.name = name
        self.grades = []
    
    def add_grade(self, grade):
        self.grades.append(grade)
    
    def get_average(self):
        if len(self.grades) == 0:
            return 0
        return sum(self.grades) / len(self.grades)

# Create student
student = Student("Bob")
student.add_grade(85)
student.add_grade(92)
student.add_grade(88)

print(f"{student.name}'s average: {student.get_average()}")
```

**What this does:**

We model a student with a name and a list of grades. We can add grades and calculate the average. The student object keeps all related data together.

---

## Guided Practice

Let's create classes step by step.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Create a simple class:

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        print(f"Hi, I'm {self.name} and I'm {self.age} years old")

person1 = Person("Alice", 25)
person1.introduce()
```

**Step 3:** Run your code and see the introduction.

**Step 4:** Create multiple objects:

```python
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)

person1.introduce()
person2.introduce()
```

**What happens:**

Each person has their own data. The method uses the data from the specific object.

**Step 5:** Add a method that modifies data:

```python
class Counter:
    def __init__(self):
        self.count = 0
    
    def increment(self):
        self.count += 1
    
    def get_count(self):
        return self.count

counter = Counter()
counter.increment()
counter.increment()
counter.increment()
print(f"Count: {counter.get_count()}")
```

**What this does:**

The Counter keeps track of a number. Each time you call `increment()`, the count goes up. The output is:

```
Count: 3
```

**Step 6:** Combine OOP with everything you learned:

```python
class TodoList:
    def __init__(self):
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append(task)
        print(f"Added: {task}")
    
    def show_tasks(self):
        if len(self.tasks) == 0:
            print("No tasks yet!")
        else:
            for i, task in enumerate(self.tasks, 1):
                print(f"{i}. {task}")

my_list = TodoList()
my_list.add_task("Learn Python")
my_list.add_task("Build a project")
my_list.show_tasks()
```

**What this does:**

We create a to-do list object that manages tasks. This uses classes, lists, loops, and conditionals all together.

---

## Homework

Your task is to create a `Book` class and a simple library system.

**Requirements:**

- Create a `Book` class with attributes: title, author, pages
- Add a method called `info()` that prints the book's information
- Create at least 3 Book objects
- Store them in a list
- Write a function that takes the list and prints all books
- The function should also print the total number of pages across all books

**Example output:**

```
Book 1: Python Basics by John Smith (350 pages)
Book 2: Data Science by Jane Doe (420 pages)
Book 3: Web Development by Bob Johnson (380 pages)

Total pages in library: 1150
```

**Hints:**

Define the Book class:

```python
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
    
    def info(self):
        # Print book information
```

Create book objects:

```python
book1 = Book("Python Basics", "John Smith", 350)
book2 = Book("Data Science", "Jane Doe", 420)
# Add one more
```

Store in a list and process:

```python
library = [book1, book2, book3]

for index, book in enumerate(library, 1):
    print(f"Book {index}:", end=" ")
    book.info()
```

Calculate total pages:

```python
total_pages = 0
for book in library:
    total_pages += book.pages
print(f"Total pages: {total_pages}")
```

**Bonus challenge:** Add a method to the Book class called `is_long()` that returns True if the book has more than 400 pages, False otherwise. Use this to print which books are long.

This is your final homework. It combines everything: classes, functions, lists, loops, and conditionals. You have learned all the tools you need.

---

## Reflection

This is your final reflection. Answer these questions:

1. What is a class? What is an object?
2. What is the difference between an attribute and a method?
3. What does the `__init__` method do?
4. What does `self` refer to?
5. Why is Object-Oriented Programming useful?

If you can answer these questions, you have completed the beginner to intermediate Python curriculum.

---

**Congratulations!** You have reached the end of the structured lessons. You now have a strong foundation in Python programming. You know:

- Programming fundamentals
- Variables and data types
- Input and output
- Conditions and loops
- Functions
- Lists and dictionaries
- File handling
- Error handling
- Object-Oriented Programming

**You are ready to build real applications!**

From here, you can:
- Build your own projects
- Explore advanced Python topics
- Learn web development (Flask, Django)
- Dive into data science (Pandas, NumPy)
- Create games (Pygame)
- Automate tasks
- And much more!

**You are now a Python programmer. Keep coding, keep learning, and keep building!** 🎉🐍




