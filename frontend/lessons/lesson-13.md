# Data Processing Basics

## Goal

By the end of this lesson, you will understand how to read, process, and analyze data from CSV files, and perform basic data operations that are essential in real-world programming.

---

## Explanation

In the real world, data comes in many formats. One of the most common is **CSV** (Comma-Separated Values). CSV files are used everywhere: spreadsheets, databases exports, data analysis, and more.

A CSV file looks like this:

```
name,age,city
Alice,25,Boston
Bob,30,Seattle
Charlie,22,Austin
```

The first line is usually headers (column names). Each following line is a row of data. Values are separated by commas.

**Why learn data processing?**

Data processing is crucial for:
- Business analytics (sales reports, customer data)
- Scientific research (experimental results)
- Web scraping (extracting information)
- Machine learning (preparing training data)
- Automation (processing logs, reports)

**Python's csv library:**

Python has a built-in `csv` library for working with CSV files:

```python
import csv
```

No installation needed - it's part of Python!

---

**Reading CSV files:**

```python
import csv

# Reading CSV
with open('data.csv', 'r') as file:
    reader = csv.reader(file)
    
    for row in reader:
        print(row)  # Each row is a list
```

**What this does:**

The csv.reader reads each line and splits it by commas. Each row becomes a list of values.

**Reading with dictionary format:**

```python
import csv

with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    
    for row in reader:
        print(row)  # Each row is a dictionary!
        print(f"Name: {row['name']}, Age: {row['age']}")
```

**What this does:**

DictReader uses the first line as keys. Each row becomes a dictionary, making it easier to access values by name instead of position.

---

**Writing CSV files:**

```python
import csv

data = [
    ['name', 'age', 'city'],
    ['Alice', 25, 'Boston'],
    ['Bob', 30, 'Seattle']
]

with open('output.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)
```

**What this does:**

We create a CSV file from a list of lists. The first list becomes the header row.

**Writing with DictWriter:**

```python
import csv

data = [
    {'name': 'Alice', 'age': 25, 'city': 'Boston'},
    {'name': 'Bob', 'age': 30, 'city': 'Seattle'}
]

with open('output.csv', 'w', newline='') as file:
    fieldnames = ['name', 'age', 'city']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    writer.writeheader()
    writer.writerows(data)
```

**What this does:**

We write dictionaries to CSV. DictWriter handles converting dictionaries to CSV rows.

---

**Data processing operations:**

**Filtering data:**

```python
# Filter students over age 25
students = [
    {'name': 'Alice', 'age': 28, 'grade': 92},
    {'name': 'Bob', 'age': 22, 'grade': 88},
    {'name': 'Charlie', 'age': 30, 'grade': 95}
]

older_students = [s for s in students if s['age'] > 25]
print(older_students)
```

**Aggregating data:**

```python
# Calculate average grade
grades = [student['grade'] for student in students]
average = sum(grades) / len(grades)
print(f"Average grade: {average}")
```

**Sorting data:**

```python
# Sort by grade (highest first)
sorted_students = sorted(students, key=lambda x: x['grade'], reverse=True)

for student in sorted_students:
    print(f"{student['name']}: {student['grade']}")
```

---

## Example

Here is a program that processes sales data:

```python
import csv
from datetime import datetime

# Create sample sales data
sales_data = '''date,product,quantity,price
2026-01-10,Widget A,5,29.99
2026-01-11,Widget B,3,49.99
2026-01-11,Widget A,2,29.99
2026-01-12,Widget C,7,19.99
2026-01-12,Widget A,4,29.99'''

# Write to CSV (simulating file)
with open('sales.csv', 'w') as f:
    f.write(sales_data)

# Read and process CSV
total_revenue = 0
product_sales = {}

with open('sales.csv', 'r') as file:
    reader = csv.DictReader(file)
    
    for row in reader:
        quantity = int(row['quantity'])
        price = float(row['price'])
        product = row['product']
        revenue = quantity * price
        
        # Track total revenue
        total_revenue += revenue
        
        # Track per-product sales
        if product in product_sales:
            product_sales[product] += quantity
        else:
            product_sales[product] = quantity

# Display results
print(f"Total Revenue: ${total_revenue:.2f}")
print("\nSales by Product:")
for product, quantity in sorted(product_sales.items(), key=lambda x: x[1], reverse=True):
    print(f"{product}: {quantity} units")
```

**What happens here?**

We create CSV data, read it, calculate total revenue, and summarize sales by product. The output is:

```
Total Revenue: $629.80

Sales by Product:
Widget A: 11 units
Widget C: 7 units
Widget B: 3 units
```

This is the type of data processing businesses do every day!

---

## Guided Practice

Let's practice data processing.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Create and process CSV data:

```python
import csv

# Create sample student data
students_csv = '''name,math,science,english
Alice,92,88,90
Bob,78,85,82
Charlie,95,90,88
Diana,88,92,94'''

# Write to file
with open('students.csv', 'w') as f:
    f.write(students_csv)

# Read and process
with open('students.csv', 'r') as file:
    reader = csv.DictReader(file)
    
    for student in reader:
        math_score = int(student['math'])
        science_score = int(student['science'])
        english_score = int(student['english'])
        
        average = (math_score + science_score + english_score) / 3
        
        print(f"{student['name']}: {average:.1f} average")
```

**Step 3:** Try data aggregation:

```python
import csv

# Read the file again for analysis
all_math_scores = []
all_science_scores = []

with open('students.csv', 'r') as file:
    reader = csv.DictReader(file)
    
    for student in reader:
        all_math_scores.append(int(student['math']))
        all_science_scores.append(int(student['science']))

print(f"Math class average: {sum(all_math_scores) / len(all_math_scores):.1f}")
print(f"Science class average: {sum(all_science_scores) / len(all_science_scores):.1f}")
```

**Step 4:** Filter and sort data:

```python
import csv

students_data = []

with open('students.csv', 'r') as file:
    reader = csv.DictReader(file)
    students_data = list(reader)

# Find students with math score > 85
high_math = [s for s in students_data if int(s['math']) > 85]

print("Students with Math > 85:")
for student in high_math:
    print(f"- {student['name']} ({student['math']})")
```

---

## Homework

Your task is to build a **sales report generator** that processes sales data and generates summary statistics.

**Requirements:**

- Create CSV data for at least 10 sales transactions
  - Include: date, product name, quantity, unit price
- Read the CSV file
- Calculate:
  - Total revenue (quantity × price for all transactions)
  - Best-selling product (most units sold)
  - Average transaction value
  - Number of unique products
- Write a summary report to a new CSV file with these statistics

**Example output:**

```
Sales Summary Report
====================
Total Revenue: $1,234.56
Best-Selling Product: Widget A (45 units)
Average Transaction: $123.46
Unique Products: 5

Detailed Report saved to: sales_report.csv
```

**Hints:**

Create sample data:

```python
import csv

sales_data = [
    ['date', 'product', 'quantity', 'price'],
    ['2026-01-10', 'Widget A', 5, 29.99],
    ['2026-01-10', 'Widget B', 3, 49.99],
    # Add 8 more rows...
]

with open('sales.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(sales_data)
```

Read and analyze:

```python
with open('sales.csv', 'r') as f:
    reader = csv.DictReader(f)
    sales = list(reader)

# Calculate total revenue
total = sum(int(row['quantity']) * float(row['price']) for row in sales)
```

Find best-selling product:

```python
product_quantities = {}
for row in sales:
    product = row['product']
    qty = int(row['quantity'])
    product_quantities[product] = product_quantities.get(product, 0) + qty

best_product = max(product_quantities.items(), key=lambda x: x[1])
```

**Bonus challenge:** Add date filtering - calculate revenue for a specific date range or find the best sales day.

This homework combines file I/O, CSV processing, data analysis, and functions - all critical skills for real-world Python work.

---

## Reflection

Before moving forward, answer these questions:

1. What is CSV format and why is it commonly used?
2. What's the difference between csv.reader and csv.DictReader?
3. How do you calculate aggregate statistics (sum, average, max)?
4. What is a list comprehension and when is it useful?
5. How would you process large datasets efficiently?

If you can answer these, you have strong data processing fundamentals.

---

**Outstanding work!** You now have the skills to work with real-world data files, process information, and generate insights. Data processing is one of the most in-demand Python skills in industry. In the next lessons, you will learn web development with Flask, taking your skills to the next level by building interactive web applications.




