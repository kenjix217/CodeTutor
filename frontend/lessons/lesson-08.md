# File Handling

## Goal

By the end of this lesson, you will understand how to read from and write to files in Python, allowing your programs to save and load data.

---

## Explanation

So far, all your programs have worked with data that exists only while the program runs. When the program ends, the data disappears.

But what if you want to save information for later? What if you want to read data that already exists?

This is where **file handling** comes in.

**File handling** lets your programs:
- Read data from files
- Write data to files
- Save results permanently
- Process existing data

Think of files like notebooks. You can read what is written in a notebook, or you can write new information into it. Python lets your programs do the same thing with computer files.

**Why use files?**

Files allow programs to:
- Save user data (settings, progress, results)
- Process large amounts of information
- Share data between programs
- Store data permanently

---

**Reading from files:**

To read a file, you use the `open()` function:

```python
file = open("example.txt", "r")
content = file.read()
print(content)
file.close()
```

**What this does:**

The `open()` function takes two arguments: the filename and the mode. The mode `"r"` means "read". The `read()` method gets all the content. The `close()` method closes the file when done.

**A better way - using with:**

Python has a better way that automatically closes the file:

```python
with open("example.txt", "r") as file:
    content = file.read()
    print(content)
```

**What this does:**

The `with` statement automatically closes the file when done, even if an error occurs. This is the recommended way to work with files.

**Reading line by line:**

For large files, you can read one line at a time:

```python
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())
```

**What this does:**

The loop goes through each line in the file. The `strip()` method removes extra whitespace and newline characters.

---

**Writing to files:**

To write to a file, use mode `"w"` (write):

```python
with open("output.txt", "w") as file:
    file.write("Hello, file!\n")
    file.write("This is line 2\n")
```

**What this does:**

This creates a file called `output.txt` and writes two lines to it. The `\n` adds a newline character.

**Important:** Mode `"w"` creates a new file or **overwrites** an existing file. Use `"a"` (append) to add to an existing file without erasing it.

**Appending to files:**

```python
with open("log.txt", "a") as file:
    file.write("New log entry\n")
```

**What this does:**

This adds content to the end of the file without erasing what was already there.

---

## Example

Here is a program that writes data to a file and then reads it back:

```python
# Write data to file
with open("students.txt", "w") as file:
    file.write("Alice,92\n")
    file.write("Bob,88\n")
    file.write("Charlie,95\n")

print("Data written to file!")

# Read data from file
with open("students.txt", "r") as file:
    print("Reading file:")
    for line in file:
        name, score = line.strip().split(",")
        print(f"{name} scored {score}")
```

**What happens here?**

First, we create a file and write three lines (student names and scores). Then we read the file back, split each line by the comma, and display the information. The output is:

```
Data written to file!
Reading file:
Alice scored 92
Bob scored 88
Charlie scored 95
```

**Working with lists and files:**

You can save and load lists:

```python
# Save a list
data = ["apple", "banana", "cherry"]

with open("fruits.txt", "w") as file:
    for item in data:
        file.write(item + "\n")

# Load the list
loaded_data = []

with open("fruits.txt", "r") as file:
    for line in file:
        loaded_data.append(line.strip())

print(loaded_data)
```

**What this does:**

We save each list item on a separate line, then read them back into a new list.

---

## Guided Practice

Let's practice file operations.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Create a file with your favorite things:

```python
with open("favorites.txt", "w") as file:
    file.write("Color: blue\n")
    file.write("Food: pizza\n")
    file.write("Hobby: coding\n")

print("File created!")
```

**Note:** In the browser version (Pyodide), files are stored in a virtual file system. They exist during your session but are not saved to your actual computer.

**Step 3:** Read the file back:

```python
with open("favorites.txt", "r") as file:
    content = file.read()
    print(content)
```

**Step 4:** Try appending to the file:

```python
with open("favorites.txt", "a") as file:
    file.write("Movie: Star Wars\n")

# Read again to see the new line
with open("favorites.txt", "r") as file:
    print(file.read())
```

**What happens:**

The file now has four lines instead of three.

**Step 5:** Process a file line by line:

```python
# Create a file with numbers
with open("numbers.txt", "w") as file:
    for i in range(1, 6):
        file.write(f"{i}\n")

# Read and process
total = 0
with open("numbers.txt", "r") as file:
    for line in file:
        number = int(line.strip())
        total += number

print(f"Sum: {total}")
```

**What this does:**

We write numbers 1-5 to a file, then read them back and calculate the sum.

---

## Homework

Your task is to create a program that saves a list of tasks to a file and then reads them back.

**Requirements:**

- Create a list of at least 4 tasks (your to-do items)
- Write each task to a file called `tasks.txt` (one task per line)
- Read the file back and display each task with a number

**Example output:**

```
Tasks saved!
Your tasks:
1. Complete Python homework
2. Practice coding
3. Read a book
4. Exercise
```

**Hints:**

Create the task list:

```python
tasks = [
    "Complete Python homework",
    "Practice coding",
    "Read a book",
    "Exercise"
]
```

Write tasks to file:

```python
with open("tasks.txt", "w") as file:
    for task in tasks:
        file.write(task + "\n")
```

Read and display with numbers:

```python
with open("tasks.txt", "r") as file:
    for index, line in enumerate(file, start=1):
        print(f"{index}. {line.strip()}")
```

**Bonus challenge:** Add a function called `save_tasks(task_list, filename)` that takes a list of tasks and a filename, and saves them. Then add another function `load_tasks(filename)` that reads the file and returns the list.

Remember: In Pyodide (browser Python), files are virtual and temporary. This is perfect for learning - you can practice file operations without affecting your actual computer.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What does the `open()` function do?
2. What is the difference between mode `"r"` and mode `"w"`?
3. What does mode `"a"` do?
4. Why should you use `with` when working with files?
5. How do you read a file line by line?

If you understand these concepts, you know how to make programs that save and load data.

---

**Great work!** You now know how to work with files, one of the most important skills in programming. Files let your programs save data permanently and process information from external sources. In the next lesson, you will learn about error handling, which helps your programs deal with problems gracefully.




