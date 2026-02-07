# Data Analysis with Python

## Goal

Learn to analyze and visualize data using Python's data analysis tools.

## Explanation

**Data analysis** means finding patterns and insights in data. Python is the #1 language for data science because of powerful libraries.

**Key libraries:**
- **pandas:** Data manipulation
- **matplotlib:** Visualization
- **numpy:** Numerical computing

**Basic data analysis workflow:**
1. Load data
2. Clean data (handle missing values, errors)
3. Analyze (calculate statistics, find patterns)
4. Visualize (create charts)
5. Draw conclusions

---

## Golden Source Solutions

**Download the complete reference solutions for this lesson:**

<a href="golden_source/L18/" class="btn-primary" style="margin: 1rem 0; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; background-color: var(--color-primary); color: white; border-radius: 4px;">📥 Download Lesson 18 Solutions</a>

These solutions include:
- Complete homework solutions with detailed comments
- Additional examples and exercises
- Best practices and optimization techniques
- Common pitfalls and how to avoid them

**Note:** These solutions require real Python installed on your computer. They won't work in the browser-based editor.

---

## Example

```python
import json

# Sample sales data
data = [
    {"month": "Jan", "sales": 15000, "expenses": 8000},
    {"month": "Feb", "sales": 18000, "expenses": 9000},
    {"month": "Mar", "sales": 21000, "expenses": 10000}
]

# Analysis
total_sales = sum(m['sales'] for m in data)
total_profit = sum(m['sales'] - m['expenses'] for m in data)
avg_profit_margin = (total_profit / total_sales) * 100

print(f"Total Sales: ${total_sales:,}")
print(f"Total Profit: ${total_profit:,}")
print(f"Profit Margin: {avg_profit_margin:.1f}%")

# Find best month
best_month = max(data, key=lambda x: x['sales'])
print(f"Best Month: {best_month['month']} (${best_month['sales']:,})")
```

## Guided Practice

```python
# Student grade analysis
grades = [85, 92, 78, 95, 88, 76, 90, 84]

# Statistics
average = sum(grades) / len(grades)
highest = max(grades)
lowest = min(grades)
passing = len([g for g in grades if g >= 80])

print(f"Average: {average:.1f}")
print(f"Highest: {highest}")
print(f"Lowest: {lowest}")
print(f"Passing (≥80): {passing}/{len(grades)}")
```

## Homework

Analyze a **sales dataset**:
- Create data for 12 months (sales, expenses, customers)
- Calculate total revenue, profit, ROI
- Find best/worst months
- Calculate growth rate month-over-month
- Identify trends

## Reflection

1. What is data analysis?
2. What statistics are commonly calculated?
3. How do you find patterns in data?
4. What is data visualization?
5. Why is Python popular for data science?

**Outstanding!** Data skills are highly valuable!




