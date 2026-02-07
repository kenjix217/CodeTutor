# Loops (for and while)

## Goal

By the end of this lesson, you will understand how to make your programs repeat actions using for loops and while loops.

---

## Explanation

Imagine you want to print the numbers 1 through 10. You could write:

```python
print(1)
print(2)
print(3)
# ... and so on
```

But that is tedious and repetitive. What if you wanted to print 1 through 1000? You would need 1000 lines of code!

This is where **loops** come in.

A **loop** is a way to repeat a block of code multiple times. Instead of writing the same code over and over, you write it once and let Python repeat it.

Python has two types of loops: **for loops** and **while loops**.

---

**The for loop:**

A for loop repeats code a specific number of times. Here is the basic pattern:

```python
for variable in sequence:
    # Code here repeats for each item in sequence
```

The most common way to use a for loop is with `range()`:

```python
for i in range(5):
    print(i)
```

**What this does:**

The `range(5)` creates a sequence of numbers: 0, 1, 2, 3, 4

The loop runs 5 times. Each time, `i` gets the next number from the sequence. The output is:

```
0
1
2
3
4
```

Notice that `range(5)` starts at 0 and stops before 5.

**You can also specify start and end:**

```python
for i in range(1, 6):
    print(i)
```

This prints 1, 2, 3, 4, 5 (starts at 1, stops before 6).

---

**The while loop:**

A while loop repeats code as long as a condition is True. Here is the pattern:

```python
while condition:
    # Code here repeats while condition is True
```

Example:

```python
count = 0

while count < 5:
    print(count)
    count = count + 1
```

**What this does:**

The loop checks: Is count less than 5? If yes, run the code. Then check again.

The code prints the number and then increases count by 1. This repeats until count reaches 5.

**Important:** You must change the variable inside the loop, or it will run forever!

---

## Example

Here is a program that uses both types of loops:

```python
# For loop example
print("Counting with for loop:")
for i in range(1, 6):
    print(i)

print()  # Empty line

# While loop example
print("Counting with while loop:")
count = 1
while count <= 5:
    print(count)
    count = count + 1
```

**What happens here?**

Both loops do the same thing: print numbers 1 through 5. The for loop is simpler when you know how many times to repeat. The while loop is better when you repeat based on a condition.

The output is:

```
Counting with for loop:
1
2
3
4
5

Counting with while loop:
1
2
3
4
5
```

**Looping through lists:**

You can loop through any sequence, including lists:

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
```

**What this does:**

The loop goes through each item in the list. Each time, `fruit` gets the next item. The output is:

```
apple
banana
cherry
```

---

## Guided Practice

Let's practice using loops.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Write a for loop that prints the numbers 10 through 15:

```python
for i in range(10, 16):
    print(i)
```

**Step 3:** Run your code and verify the output.

**Step 4:** Now write a loop that prints each number multiplied by 2:

```python
for i in range(1, 6):
    print(i * 2)
```

**What happens:**

Run this and see: 2, 4, 6, 8, 10

**Step 5:** Try a while loop that counts down:

```python
countdown = 5

while countdown > 0:
    print(countdown)
    countdown = countdown - 1

print("Blast off!")
```

**What this does:**

The loop prints 5, 4, 3, 2, 1, then "Blast off!" This is a countdown.

**Step 6:** Loop through a list of your favorite things:

```python
favorites = ["pizza", "movies", "coding"]

for item in favorites:
    print(f"I like {item}")
```

**What happens:**

The loop prints one sentence for each item in the list.

---

## Homework

Your task is to write a program that calculates the sum of all numbers from 1 to 100.

**Requirements:**

- Use a for loop to go through numbers 1 to 100
- Keep a running total
- Print the final sum

**Expected output:**

```
The sum of numbers 1 to 100 is: 5050
```

**Hints:**

Start with a variable to track the total:

```python
total = 0
```

Use a for loop to go through the numbers:

```python
for number in range(1, 101):
    # Add number to total
```

After the loop, print the total.

**Bonus challenge:** Can you modify your program to also print all even numbers from 1 to 20? Use a for loop and an if statement together.

Try this yourself. Break it down into small steps. You have all the knowledge you need.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What is the difference between a for loop and a while loop?
2. What does `range(5)` produce?
3. What does `range(2, 8)` produce?
4. Why must you change the condition variable in a while loop?
5. How do you loop through a list?

If you understand these concepts, you are building a strong programming foundation.

---

**Fantastic progress!** You now know how to make programs repeat actions. Combined with conditions from the previous lesson, you can build programs that make decisions and repeat tasks. You are ready for more advanced topics in the next lessons.




