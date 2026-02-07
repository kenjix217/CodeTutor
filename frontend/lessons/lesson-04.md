# Conditions (if/else)

## Goal

By the end of this lesson, you will understand how to make your programs make decisions using if, elif, and else statements.

---

## Explanation

So far, your programs have run the same way every time. Every line executes in order from top to bottom.

But what if you want your program to do different things depending on the situation?

That is where **conditions** come in.

A **condition** is a question your program asks. Based on the answer, it decides what to do next.

Think of it like this: If it is raining, you bring an umbrella. If it is sunny, you bring sunglasses. Your decision depends on the weather. Programs make decisions the same way.

**The if statement:**

The most basic condition is the if statement. Here is how it works:

```python
if condition:
    # Code here runs ONLY if condition is True
```

**What is a condition?**

A condition is something that can be True or False. For example:

```python
age = 18
if age >= 18:
    print("You are an adult")
```

**What this does:**

The condition is `age >= 18`. This asks: Is age greater than or equal to 18?

If the answer is True, Python runs the indented code. If False, Python skips it.

**Comparison operators:**

You can compare values using these operators:

```python
==  # Equal to
!=  # Not equal to
>   # Greater than
<   # Less than
>=  # Greater than or equal to
<=  # Less than or equal to
```

**Important:** Use two equals signs (`==`) to compare, not one. One equals sign (`=`) is for assignment.

---

## Example

Here is a program that uses conditions:

```python
temperature = 75

if temperature > 80:
    print("It's hot outside!")

if temperature < 60:
    print("It's cold outside!")

if temperature >= 60 and temperature <= 80:
    print("The weather is nice!")
```

**What happens here?**

The program checks the temperature three times:
- Is it greater than 80? If yes, print "It's hot"
- Is it less than 60? If yes, print "It's cold"
- Is it between 60 and 80? If yes, print "The weather is nice"

In this case, temperature is 75, so only the third condition is True. The output is:

```
The weather is nice!
```

**The else statement:**

If you want to do one thing when a condition is True and something else when it is False, use else:

```python
age = 16

if age >= 18:
    print("You can vote")
else:
    print("You cannot vote yet")
```

**What this does:**

If age is 18 or more, print one message. Otherwise, print a different message.

**The elif statement:**

Sometimes you have more than two possibilities. Use elif (short for "else if"):

```python
score = 85

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
```

**What this does:**

Python checks each condition in order. When it finds one that is True, it runs that code and skips the rest.

With a score of 85, the output is:

```
Grade: B
```

---

## Guided Practice

Let's write a program that makes decisions.

**Step 1:** Go to the **Practice** tab.

**Step 2:** Write a program that checks if a number is positive, negative, or zero:

```python
number = 10

if number > 0:
    print("The number is positive")
elif number < 0:
    print("The number is negative")
else:
    print("The number is zero")
```

**Step 3:** Run your code. You should see:

```
The number is positive
```

**Step 4:** Change `number` to -5 and run again. What do you see?

**Step 5:** Change `number` to 0 and run again. What happens?

Notice how the same program produces different output depending on the value of `number`. This is the power of conditions.

**Step 6:** Now try using `and` to check multiple conditions at once:

```python
age = 20
has_license = True

if age >= 18 and has_license:
    print("You can drive")
else:
    print("You cannot drive")
```

**What this does:**

The condition checks TWO things: Is age 18 or more AND is has_license True? Both must be True for the code to run.

---

## Homework

Your task is to write a program that determines if someone can watch a movie based on their age and whether they have parental permission.

**Requirements:**

- Ask the user for their age (use `input()`)
- Ask if they have parental permission (True or False)
- Use conditions to determine if they can watch:
  - If age is 18 or older: They can watch
  - If age is 13-17 AND they have permission: They can watch
  - Otherwise: They cannot watch

**Example interaction:**

```
What is your age? 15
Do you have parental permission? (True/False) True
You can watch the movie.
```

**Another example:**

```
What is your age? 12
Do you have parental permission? (True/False) False
You cannot watch the movie.
```

**Hints:**

Get user input:

```python
age = int(input("What is your age? "))
permission = input("Do you have parental permission? (True/False) ")
```

Convert permission to boolean:

```python
has_permission = (permission == "True")
```

Use if, elif, else to check conditions.

Remember to use `and` to check multiple things at once.

Try this on your own. Think through the logic step by step. You can do this.

---

## Reflection

Before moving to the next lesson, answer these questions:

1. What does an if statement do?
2. What is the difference between `=` and `==`?
3. When would you use `elif` instead of just another `if`?
4. What does the `and` operator do in a condition?
5. What happens to code inside an `else` block?

If you can explain these concepts in your own words, you are ready to continue.

---

**Excellent work!** You now know how to make your programs make decisions. This is one of the most important programming concepts. In the next lesson, you will learn about loops, which let your programs repeat actions.




