# Creating Games with Python (Bonus!)

## Goal

Learn to create fun, interactive games using Python - making programming enjoyable and engaging!

---

## Explanation

Programming isn't just about business applications and data - it's also about creating **fun things**! Games are one of the most exciting ways to practice programming.

**Why learn through games?**
- More fun and engaging
- Instant visual feedback
- Combines all programming concepts
- Builds problem-solving skills
- Great for portfolios!

**Types of games you can build:**
- Text-based games (adventure, quiz)
- Logic puzzles (tic-tac-toe, sudoku)
- Drawing games (turtle graphics)
- Simple arcade games (with pygame in real Python)

---

## Example 1: Number Guessing Game

```python
import random

def number_guessing_game():
    """Classic number guessing game"""
    number = random.randint(1, 100)
    guesses = 0
    max_guesses = 10
    
    print("🎮 Number Guessing Game!")
    print("I'm thinking of a number between 1 and 100.")
    print(f"You have {max_guesses} guesses.\n")
    
    while guesses < max_guesses:
        try:
            guess = int(input(f"Guess #{guesses + 1}: "))
            guesses += 1
            
            if guess < number:
                print("📈 Too low! Try higher.")
            elif guess > number:
                print("📉 Too high! Try lower.")
            else:
                print(f"🎉 Correct! You won in {guesses} guesses!")
                return
        except ValueError:
            print("❌ Please enter a valid number!")
    
    print(f"😔 Game over! The number was {number}")

# Play the game
number_guessing_game()
```

**What this teaches:**
- Random numbers
- Loops
- Conditions
- User input
- Functions

---

## Example 2: Tic-Tac-Toe

```python
def print_board(board):
    """Display the tic-tac-toe board"""
    print("\n")
    for i in range(0, 9, 3):
        print(f" {board[i]} | {board[i+1]} | {board[i+2]} ")
        if i < 6:
            print("-----------")
    print("\n")

def check_winner(board, player):
    """Check if player won"""
    wins = [
        [0,1,2], [3,4,5], [6,7,8],  # Rows
        [0,3,6], [1,4,7], [2,5,8],  # Columns
        [0,4,8], [2,4,6]             # Diagonals
    ]
    
    for combo in wins:
        if all(board[i] == player for i in combo):
            return True
    return False

def play_tic_tac_toe():
    """Two-player tic-tac-toe game"""
    board = [str(i) for i in range(1, 10)]
    current_player = 'X'
    moves = 0
    
    print("🎮 Tic-Tac-Toe!")
    print("Player X and Player O")
    print("Enter position (1-9) to play\n")
    
    while moves < 9:
        print_board(board)
        
        try:
            position = int(input(f"Player {current_player}, enter position: "))
            
            if position < 1 or position > 9:
                print("❌ Enter a number between 1 and 9!")
                continue
            
            if board[position - 1] in ['X', 'O']:
                print("❌ That spot is taken!")
                continue
            
            board[position - 1] = current_player
            moves += 1
            
            if check_winner(board, current_player):
                print_board(board)
                print(f"🎉 Player {current_player} wins!")
                return
            
            # Switch player
            current_player = 'O' if current_player == 'X' else 'X'
            
        except ValueError:
            print("❌ Please enter a valid number!")
    
    print_board(board)
    print("🤝 It's a tie!")

# Play the game
play_tic_tac_toe()
```

**What this teaches:**
- Lists and indexing
- Functions
- Loops and conditions
- Game logic
- Input validation

---

## Example 3: Text Adventure

```python
def start_adventure():
    """Simple text adventure game"""
    print("🏰 Welcome to the Python Adventure!")
    print("\nYou wake up in a mysterious castle...")
    
    health = 100
    has_key = False
    
    while health > 0:
        print(f"\n💚 Health: {health}")
        print("\nWhat do you do?")
        print("1. Explore the north corridor")
        print("2. Search the room")
        print("3. Rest (restore health)")
        print("4. Exit game")
        
        choice = input("\nYour choice (1-4): ")
        
        if choice == '1':
            print("\n🚪 You walk down the dark corridor...")
            if has_key:
                print("✅ You unlock the treasure room with your key!")
                print("🏆 You found the treasure! You win!")
                return
            else:
                print("❌ The door is locked. You need a key.")
                health -= 10
        
        elif choice == '2':
            print("\n🔍 You search the room carefully...")
            if not has_key:
                print("✨ You found a golden key!")
                has_key = True
            else:
                print("Nothing else here.")
        
        elif choice == '3':
            print("\n😴 You rest and restore energy.")
            health = min(100, health + 20)
            print(f"💚 Health restored to {health}")
        
        elif choice == '4':
            print("\n👋 Thanks for playing!")
            return
        
        else:
            print("\n❌ Invalid choice!")
    
    print("\n💀 Game Over! Your health reached zero.")
    print("Better luck next time!")

# Start the adventure
start_adventure()
```

**What this teaches:**
- Game state management
- Decision trees
- Story design
- Loop control
- Variables and conditions

---

## Example 4: Simple Drawing (Matplotlib)

```python
import matplotlib.pyplot as plt
import random

def draw_colorful_pattern():
    """Create colorful geometric pattern"""
    plt.figure(figsize=(8, 8))
    
    # Draw circles
    for i in range(20):
        x = random.uniform(0, 10)
        y = random.uniform(0, 10)
        size = random.uniform(100, 500)
        color = (random.random(), random.random(), random.random())
        alpha = random.uniform(0.3, 0.7)
        
        circle = plt.Circle((x, y), 0.5, color=color, alpha=alpha)
        plt.gca().add_patch(circle)
    
    plt.xlim(0, 10)
    plt.ylim(0, 10)
    plt.axis('equal')
    plt.title('Random Colorful Pattern', fontsize=16)
    plt.show()
    
    print("🎨 Art created!")

draw_colorful_pattern()
```

**Creates:** Beautiful random art! 🎨

---

## Guided Practice

**Try these mini-games:**

### **1. Rock, Paper, Scissors**
```python
import random

choices = ['rock', 'paper', 'scissors']

player = input("Choose (rock/paper/scissors): ").lower()
computer = random.choice(choices)

print(f"\nYou chose: {player}")
print(f"Computer chose: {computer}")

if player == computer:
    print("🤝 It's a tie!")
elif (player == 'rock' and computer == 'scissors') or \
     (player == 'paper' and computer == 'rock') or \
     (player == 'scissors' and computer == 'paper'):
    print("🎉 You win!")
else:
    print("😔 Computer wins!")
```

---

### **2. Word Scramble**
```python
import random

words = ['python', 'programming', 'computer', 'function', 'variable']
word = random.choice(words)
scrambled = ''.join(random.sample(word, len(word)))

print(f"🎮 Unscramble this word: {scrambled}")
guess = input("Your answer: ").lower()

if guess == word:
    print("🎉 Correct!")
else:
    print(f"😔 Wrong! It was: {word}")
```

---

### **3. Simple Visualization Game**
```python
import matplotlib.pyplot as plt
import random

# Create a simple race
racers = ['🐢 Turtle', '🐇 Rabbit', '🦊 Fox', '🐎 Horse']
speeds = [random.randint(1, 10) for _ in racers]

plt.figure(figsize=(10, 6))
plt.barh(racers, speeds, color=['green', 'brown', 'orange', 'gray'])
plt.xlabel('Speed')
plt.title('Animal Race!')
plt.tight_layout()
plt.show()

winner_idx = speeds.index(max(speeds))
print(f"\n🏆 Winner: {racers[winner_idx]} (Speed: {speeds[winner_idx]})")
```

**Creates:** Visual race results! 🏁

---

## Homework

**Create your own game!**

**Choose ONE:**

**Option 1: Quiz Game**
- 5 Python questions
- Multiple choice or text input
- Track score
- Show results at end

**Option 2: Story Adventure**
- At least 5 decision points
- Track inventory or health
- Multiple endings
- Use functions for different scenes

**Option 3: Data Visualization Game**
- Random data generation
- Create bar chart or line plot
- Guess which is highest/lowest
- Score based on accuracy

**Requirements:**
- Use functions
- Use loops and conditions
- Have user interaction (input or randomness)
- Print results
- Be fun! 🎮

**Bonus:** Add error handling, scoring system, and replay option!

---

## Reflection

1. Why are games good for learning programming?
2. What programming concepts do games combine?
3. How do you manage game state (score, health, inventory)?
4. What's the difference between text games and graphical games?
5. What Python libraries are useful for game development?

---

**Awesome!** Games make programming fun and engaging. You've learned that Python isn't just for serious applications - it's also for creativity and entertainment. Whether you want to build data analysis tools or video games, Python can do it all!

**Keep coding, keep creating, and most importantly - have fun!** 🎮🐍✨




