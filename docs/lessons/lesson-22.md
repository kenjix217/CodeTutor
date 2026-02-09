# Real-World Mini Projects

## Goal

Build practical, useful Python projects that you can actually use! 🚀

---

## Explanation

Now that you know the basics of Python, it's time to build something real! Projects are the best way to learn because they force you to combine everything you know into something useful.

**Why build projects?**
- 🎯 Real-world practice
- 📦 Portfolio pieces
- 💡 Problem-solving skills
- 🏆 Something to show off!

**How to approach a project:**
1. Start small - Break it into tiny pieces
2. Get it working - Don't worry about being perfect
3. Test it - Try different inputs
4. Improve it - Add features one at a time

---

## Project 1: Simple Calculator 🧮

A calculator that can do basic math operations!

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error: Cannot divide by zero!"
    return a / b

def calculator():
    print("🧮 Simple Calculator")
    print("Choose operation:")
    print("1. Add (+)")
    print("2. Subtract (-)")
    print("3. Multiply (*)")
    print("4. Divide (/)")
    
    choice = input("Enter choice (1/2/3/4): ")
    
    try:
        num1 = float(input("Enter first number: "))
        num2 = float(input("Enter second number: "))
        
        if choice == '1':
            result = add(num1, num2)
            operation = '+'
        elif choice == '2':
            result = subtract(num1, num2)
            operation = '-'
        elif choice == '3':
            result = multiply(num1, num2)
            operation = '×'
        elif choice == '4':
            result = divide(num1, num2)
            operation = '÷'
        else:
            print("❌ Invalid choice!")
            return
        
        print(f"\n{num1} {operation} {num2} = {result}")
        
    except ValueError:
        print("❌ Please enter valid numbers!")
```

**Features:**
- ✅ Four operations (add, subtract, multiply, divide)
- ✅ Error handling (divide by zero, invalid input)
- ✅ User-friendly menu

**Challenge:** Add more operations like exponentiation (`**`) or modulus (`%`)!

---

## Project 2: To-Do List Manager 📝

Keep track of your tasks with a simple to-do list!

```python
class TodoList:
    def __init__(self):
        self.tasks = []
    
    def add_task(self, task):
        self.tasks.append(task)
        print(f"✅ Added: {task}")
    
    def show_tasks(self):
        if not self.tasks:
            print("📋 No tasks yet!")
        else:
            print("\n📋 Your Tasks:")
            for i, task in enumerate(self.tasks, 1):
                status = "✓ " if task.startswith("✓ ") else ""
                print(f"{i}. {status} {task}")
    
    def remove_task(self, task_number):
        if 1 <= task_number <= len(self.tasks):
            removed = self.tasks.pop(task_number - 1)
            print(f"❌ Removed: {removed}")
        else:
            print("❌ Invalid task number!")
    
    def complete_task(self, task_number):
        if 1 <= task_number <= len(self.tasks):
            task = self.tasks[task_number - 1]
            self.tasks[task_number - 1] = f"✓ {task}"
            print(f"🎉 Completed: {task}")
        else:
            print("❌ Invalid task number!")

def todo_app():
    todo = TodoList()
    
    while True:
        print("\n📝 To-Do List Manager")
        print("1. Add task")
        print("2. Show tasks")
        print("3. Remove task")
        print("4. Complete task")
        print("5. Exit")
        
        choice = input("Choose option: ")
        
        if choice == '1':
            task = input("Enter task: ")
            todo.add_task(task)
        elif choice == '2':
            todo.show_tasks()
        elif choice == '3':
            todo.show_tasks()
            num = input("Enter task number to remove: ")
            todo.remove_task(int(num))
        elif choice == '4':
            todo.show_tasks()
            num = input("Enter task number to complete: ")
            todo.complete_task(int(num))
        elif choice == '5':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice!")

# Run the to-do app
todo_app()
```

**Features:**
- ✅ Add, show, remove, and complete tasks
- ✅ Interactive menu
- ✅ Error handling

**Challenge:** Save tasks to a file so they persist between runs!

---

## Project 3: Password Generator 🔐

Create strong, random passwords for better security!

```python
import random
import string

def generate_password(length=12, use_symbols=True):
    """Generate a random password"""
    
    # Define character sets
    letters = string.ascii_letters  # a-z, A-Z
    digits = string.digits  # 0-9
    symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?" if use_symbols else ""
    
    # Combine all characters
    all_chars = letters + digits + symbols
    
    # Generate random password
    password = ''.join(random.choice(all_chars) for _ in range(length))
    
    return password

def password_strength(password):
    """Check password strength"""
    
    strength = 0
    feedback = []
    
    # Check length
    if len(password) >= 8:
        strength += 1
    else:
        feedback.append("Too short (use 8+ characters)")
    
    # Check for uppercase
    if any(c.isupper() for c in password):
        strength += 1
    else:
        feedback.append("Add uppercase letters")
    
    # Check for lowercase
    if any(c.islower() for c in password):
        strength += 1
    else:
        feedback.append("Add lowercase letters")
    
    # Check for digits
    if any(c.isdigit() for c in password):
        strength += 1
    else:
        feedback.append("Add numbers")
    
    # Check for symbols
    if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        strength += 1
    else:
        feedback.append("Add symbols")
    
    return strength, feedback

def password_generator_app():
    print("🔐 Password Generator")
    
    while True:
        print("\nOptions:")
        print("1. Generate password")
        print("2. Check password strength")
        print("3. Exit")
        
        choice = input("Choose option: ")
        
        if choice == '1':
            try:
                length = int(input("Password length (12): ") or 12)
                use_symbols = input("Use symbols? (y/n): ").lower() == 'y'
                
                password = generate_password(length, use_symbols)
                print(f"\n🔑 Generated Password: {password}")
                
                strength, feedback = password_strength(password)
                print(f"Strength: {strength}/5")
                if feedback:
                    print("Suggestions:", ", ".join(feedback))
                else:
                    print("✅ Strong password!")
                    
            except ValueError:
                print("❌ Please enter a valid number!")
                
        elif choice == '2':
            password = input("Enter password to check: ")
            strength, feedback = password_strength(password)
            print(f"\nStrength: {strength}/5")
            if feedback:
                print("Suggestions:", ", ".join(feedback))
            else:
                print("✅ Strong password!")
                
        elif choice == '3':
            print("👋 Stay safe!")
            break
        else:
            print("❌ Invalid choice!")

# Run the password generator
password_generator_app()
```

**Features:**
- ✅ Custom password length
- ✅ Option for symbols
- ✅ Password strength checker
- ✅ Feedback and suggestions

**Challenge:** Add a feature to generate multiple passwords at once!

---

## Guided Practice

**Try this mini-project:**

**Project: Simple Quiz Game**
Create a quiz that asks Python questions and tracks the score!

```python
def quiz_game():
    questions = [
        {
            "question": "What does print() do?",
            "options": ["A. Adds numbers", "B. Displays text", "C. Creates files"],
            "answer": "B"
        },
        {
            "question": "What symbol starts a comment?",
            "options": ["A. //", "B. /*", "C. #"],
            "answer": "C"
        },
        {
            "question": "How do you create a variable?",
            "options": ["A. var x = 5", "B. x := 5", "C. x = 5"],
            "answer": "C"
        }
    ]
    
    score = 0
    
    print("🎯 Python Quiz Game!")
    print(f"Total questions: {len(questions)}\n")
    
    for i, q in enumerate(questions, 1):
        print(f"Question {i}: {q['question']}")
        for option in q['options']:
            print(f"  {option}")
        
        answer = input("Your answer (A/B/C): ").upper()
        
        if answer == q['answer']:
            print("✅ Correct!\n")
            score += 1
        else:
            print(f"❌ Wrong! The answer was {q['answer']}\n")
    
    percentage = (score / len(questions)) * 100
    print(f"\n🏆 Quiz Complete!")
    print(f"Your score: {score}/{len(questions)} ({percentage:.0f}%)")
    
    if percentage >= 80:
        print("🌟 Amazing job! You're a Python pro!")
    elif percentage >= 60:
        print("👍 Good job! Keep practicing!")
    else:
        print("📚 Keep learning! You'll get there!")

# Run the quiz
quiz_game()
```

**What this teaches:**
- Using dictionaries for data
- Loops through questions
- User input validation
- Score calculation
- Conditional feedback

---

## Homework

**Choose ONE project to complete:**

### Option 1: Enhanced Calculator
- Add memory functions (M+, M-, MR)
- Add scientific operations (power, square root)
- Add a history of calculations

### Option 2: Smart To-Do List
- Add due dates
- Add priority levels
- Save tasks to file
- Load tasks from file

### Option 3: Multi-Purpose Converter
- Add weight conversion (kg, lb, oz)
- Add speed conversion (mph, kph, m/s)
- Add data conversion (MB, GB, TB)

**Requirements:**
- Use functions and classes
- Include error handling
- Have clear user instructions
- Test with different inputs

**Bonus:**
- Add keyboard shortcuts
- Create a GUI (optional, requires tkinter)
- Add sound effects (optional)

---

## Reflection

1. Which project did you choose? Why?
2. What was the hardest part?
3. How did you solve problems you encountered?
4. What features would you add next?
5. How could you share this project with others?

---

**Awesome work!** 🎉 You've built real, useful Python applications. You're now ready to tackle even more advanced projects!

**Next up:** Web Scraping - Get data from websites automatically! 🌐
