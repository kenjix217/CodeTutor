# Working with Databases

## Goal

Learn to store and retrieve data permanently using SQLite databases and SQL queries.

## Explanation

Files store data, but **databases** are better for structured data with relationships. A database is like an organized filing system with powerful search and update capabilities.

**SQLite** is a simple database that's built into Python. Perfect for learning and small applications.

**Database concepts:**
- **Table:** Like a spreadsheet (rows and columns)
- **Row:** One record (like one person)
- **Column:** One attribute (like 'name' or 'age')
- **SQL:** Language for database queries

---

## Golden Source Solutions

**Download the complete reference solutions for this lesson:**

<a href="golden_source/L17/" class="btn-primary" style="margin: 1rem 0; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; background-color: var(--color-primary); color: white; border-radius: 4px;">📥 Download Lesson 17 Solutions</a>

These solutions include:
- Complete homework solutions with detailed comments
- Additional examples and exercises
- Best practices and optimization techniques
- Common pitfalls and how to avoid them

**Note:** These solutions require real Python installed on your computer. They won't work in the browser-based editor.

---

## Example

```python
import sqlite3

# Connect to database (creates if doesn't exist)
conn = sqlite3.connect('students.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    grade REAL
)
''')

# Insert data
cursor.execute("INSERT INTO students (name, age, grade) VALUES (?, ?, ?)",
              ('Alice', 20, 92.5))
cursor.execute("INSERT INTO students (name, age, grade) VALUES (?, ?, ?)",
              ('Bob', 22, 88.0))

# Commit changes
conn.commit()

# Query data
cursor.execute("SELECT * FROM students WHERE grade > 90")
results = cursor.fetchall()

for row in results:
    print(f"ID: {row[0]}, Name: {row[1]}, Grade: {row[3]}")

# Close connection
conn.close()
```

## Guided Practice

```python
import sqlite3

# Create and populate database
conn = sqlite3.connect(':memory:')  # In-memory (temporary)
c = conn.cursor()

c.execute('''CREATE TABLE products 
            (id INTEGER PRIMARY KEY, name TEXT, price REAL)''')

c.execute("INSERT INTO products VALUES (1, 'Laptop', 999.99)")
c.execute("INSERT INTO products VALUES (2, 'Mouse', 29.99)")
c.execute("INSERT INTO products VALUES (3, 'Keyboard', 79.99)")

conn.commit()

# Query
c.execute("SELECT * FROM products WHERE price < 100")
for row in c.fetchall():
    print(f"{row[1]}: ${row[2]}")

conn.close()
```

## Homework

Build a **contact manager database**:
- Create contacts table (name, phone, email)
- Insert at least 5 contacts
- Query to find all contacts
- Query to search by name
- Update a contact's phone
- Delete a contact

## Reflection

1. What is a database?
2. What is SQL?
3. How do you insert data into a table?
4. What does SELECT do?
5. Why use databases instead of files?

**Excellent!** Databases are fundamental to most applications!




