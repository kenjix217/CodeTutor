/**
 * Friendly Error Handler for Kids
 * Interprets Python errors into kid-friendly messages with examples and fixes
 */

export class FriendlyErrorHandler {
  constructor() {
    this.errorPatterns = {
      'NameError': {
        emoji: '🤔',
        title: "I don't know that name!",
        explanation: "You tried to use a variable or function that doesn't exist yet. It's like calling a friend by the wrong name!",
        fix: "Check if you spelled it correctly and defined it before using it.",
        example: {
          correct: 'name = "Alice"\nprint(name)',
          wrong: 'print(nam)'
        }
      },
      'SyntaxError': {
        emoji: '🔧',
        title: "Oops! Something doesn't look right",
        explanation: "Python doesn't understand this code structure. It's like writing a sentence with wrong punctuation!",
        fix: "Check for missing quotes, parentheses, colons, or extra spaces.",
        example: {
          correct: 'print("Hello")',
          wrong: 'print("Hello)'
        }
      },
      'TypeError': {
        emoji: '🔢',
        title: "Wrong kind of number!",
        explanation: "You tried to do math with different types of things. You can't add a word to a number!",
        fix: "Make sure you're using the same type of values in your operation.",
        example: {
          correct: 'age = 10\nfuture_age = age + 5',
          wrong: 'age = "10"\nfuture_age = age + 5'
        }
      },
      'IndentationError': {
        emoji: '➡️',
        title: "Oops! Indentation mistake",
        explanation: "Python uses spaces to show which code belongs together. It's like a staircase - each step needs more spaces!",
        fix: "Make sure code inside if/for/while/def/class has 4 spaces (1 tab) more indentation.",
        example: {
          correct: 'if x > 5:\n    print("Big number!")',
          wrong: 'if x > 5:\nprint("Big number!")'
        }
      },
      'IndexError': {
        emoji: '📦',
        title: "Box number doesn't exist!",
        explanation: "You tried to get something from a list at a position that doesn't exist. It's like trying to open box #6 when you only have 3 boxes!",
        fix: "Check that your index is between 0 and (list length - 1).",
        example: {
          correct: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])',
          wrong: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[5])'
        }
      },
      'ValueError': {
        emoji: '🎯',
        title: "Value doesn't work here!",
        explanation: "You used a value that Python can't handle in this situation. Like trying to turn 'hello' into a number!",
        fix: "Check the value type and make sure it matches what the function expects.",
        example: {
          correct: 'number = int("42")',
          wrong: 'number = int("hello")'
        }
      },
      'KeyError': {
        emoji: '🔑',
        title: "Key not found in dictionary!",
        explanation: "You tried to get information using a key that doesn't exist in your dictionary. It's like trying to unlock a door with the wrong key!",
        fix: "Check that you're using the exact same key that's in the dictionary.",
        example: {
          correct: 'ages = {"Alice": 10, "Bob": 12}\nprint(ages["Alice"])',
          wrong: 'ages = {"Alice": 10, "Bob": 12}\nprint(ages["alice"])'
        }
      },
      'AttributeError': {
        emoji: '🎨',
        title: "That thing doesn't have that feature!",
        explanation: "You tried to use a method or property that doesn't exist for this type of object. It's like trying to use a TV remote on a radio!",
        fix: "Check what methods are available for this type of object.",
        example: {
          correct: 'message = "Hello"\nprint(message.upper())',
          wrong: 'message = "Hello"\nprint(message.length())'
        }
      },
      'ZeroDivisionError': {
        emoji: '÷️',
        title: "Can't divide by zero!",
        explanation: "You tried to divide a number by zero. Even mathematicians can't do that!",
        fix: "Add a check to make sure you're not dividing by zero, or handle the error gracefully.",
        example: {
          correct: 'if divisor != 0:\n    result = numerator / divisor',
          wrong: 'result = numerator / 0'
        }
      },
      'FileNotFoundError': {
        emoji: '📄',
        title: "File not found!",
        explanation: "Python can't find the file you're trying to open. Check the filename and that it's in the right folder.",
        fix: "Make sure the file exists in the same folder as your Python script.",
        example: {
          correct: 'with open("notes.txt") as f:\n    content = f.read()',
          wrong: 'with open("note.txt") as f:\n    content = f.read()'
        }
      }
    };
  }

  /**
   * Parse Python error and return friendly message
   */
  interpretError(error) {
    const errorText = error.toString();
    
    // Detect error type
    for (const [errorType, info] of Object.entries(this.errorPatterns)) {
      if (errorText.includes(errorType)) {
        return {
          type: errorType,
          ...info,
          originalError: errorText
        };
      }
    }
    
    // Default error
    return {
      emoji: '😕',
      title: "Something went wrong!",
      explanation: "Python encountered an error. Let's look at the message together.",
      fix: "Read the error message carefully and check your code for mistakes.",
      example: {
        correct: 'print("Hello, World!")',
        wrong: 'prnt("Hello, World!")'
      },
      originalError: errorText
    };
  }

  /**
   * Generate progressive hints for specific errors
   */
  getHint(error, attemptNumber) {
    const hints = {
      'NameError': [
        '🤔 Hint 1: Read the error message carefully - what name does it say is not defined?',
        '💡 Hint 2: Check if you spelled it correctly (uppercase/lowercase matters!)',
        '🔍 Hint 3: Did you define the variable before using it?',
        '✨ Hint 4: Look at the example code above for the correct spelling!'
      ],
      'SyntaxError': [
        '🤔 Hint 1: Look at the line number mentioned in the error',
        '💡 Hint 2: Check for missing quotes around text',
        '🔍 Hint 3: Make sure you have matching parentheses and brackets',
        '✨ Hint 4: Did you forget a colon (:) after if, for, or def?'
      ],
      'TypeError': [
        '🤔 Hint 1: What types of values are you combining?',
        '💡 Hint 2: Use int() for whole numbers or float() for decimals',
        '🔍 Hint 3: Convert values to the same type before doing math',
        '✨ Hint 4: Remember: text + number causes an error!',
      ],
      'IndentationError': [
        '🤔 Hint 1: Code inside if/for/while/def/class needs 4 spaces more than the line above',
        '💡 Hint 2: Use the Tab key or press Space 4 times to indent',
        '🔍 Hint 3: Python is picky - don't mix spaces and tabs!',
        '✨ Hint 4: Most editors have a "Show Indentation" feature to help!'
      ],
      'IndexError': [
        '🤔 Hint 1: Remember: Python starts counting at 0, not 1!',
        '💡 Hint 2: If you have 3 items, valid indices are 0, 1, and 2',
        '🔍 Hint 3: Use len(your_list) - 1 to get the last valid index',
        '✨ Hint 4: Negative indices work from the end: list[-1] gets the last item!',
      ],
      'ValueError': [
        '🤔 Hint 1: What function are you using and what does it expect?',
        '💡 Hint 2: Use str() for text or int() for whole numbers',
        '🔍 Hint 3: Some functions need exact types - check the documentation!',
        '✨ Hint 4: Try using try/except to handle conversion errors!',
      ],
      'KeyError': [
        '🤔 Hint 1: Case matters! "Name" and "name" are different keys',
        '💡 Hint 2: Print the dictionary keys to see what you have',
        '🔍 Hint 3: Use .get() with a default value to avoid errors',
        '✨ Hint 4: Check your spelling character by character!',
      ],
      'AttributeError': [
        '🤔 Hint 1: Check what type of object you have (list, dict, string, etc.)',
        '💡 Hint 2: Check the documentation for available methods for this type',
        '🔍 Hint 3: You might need to convert or initialize the object differently',
        '✨ Hint 4: String objects have methods like .upper(), .lower() - not .append()!',
      ],
      'ZeroDivisionError': [
        '🤔 Hint 1: Add an if statement to check for zero before dividing',
        '💡 Hint 2: Use try/except to catch the error and give a nice message',
        '🔍 Hint 3: Consider returning 0 or a special value instead of dividing',
        '✨ Hint 4: Or ask the user for a different number to divide by!'
      ],
      'FileNotFoundError': [
        '🤔 Hint 1: Is the filename spelled correctly?',
        '💡 Hint 2: Is the file in the same folder as your script?',
        '🔍 Hint 3: Use os.path.join() or os.path.dirname() to construct paths',
        '✨ Hint 4: Make sure the file extension is correct (.py, .txt, .json, etc.)!',
      ]
    };
    
    const errorType = Object.keys(this.errorPatterns).find(type => 
      errorText.includes(type)
    ) || 'default';
    
    const errorHints = hints[errorType] || hints['default'];
    
    return errorHints[Math.min(attemptNumber, errorHints.length - 1)];
  }

  /**
   * Format error for display in UI
   */
  formatForDisplay(errorInfo) {
    return `
      <div class="error-card error-shake">
        <div class="error-card__header">
          <span class="error-card__emoji">${errorInfo.emoji}</span>
          <h3 class="error-card__title">${errorInfo.title}</h3>
        </div>
        
        <p class="error-card__explanation">
          ${errorInfo.explanation}
        </p>
        
        <div class="error-card__fix">
          <div class="error-card__fix-title">
            <span>🔧</span>
            <span>Here's how to fix it:</span>
          </div>
          <p>${errorInfo.fix}</p>
        </div>
        
        <div class="error-card__example">
          <p style="color: var(--color-error); margin-bottom: 8px;">❌ Wrong:</p>
          <pre style="margin-bottom: 8px;">${this.escapeHtml(errorInfo.example.wrong)}</pre>
          
          <p style="color: var(--color-success); margin-top: 8px;">✅ Correct:</p>
          <pre>${this.escapeHtml(errorInfo.example.correct)}</pre>
        </div>
      </div>
    `;
  }

  /**
   * Format hint for display
   */
  formatHint(hintText, hintNumber) {
    return `
      <div class="hint-box">
        <div class="hint-box__header">
          <span class="hint-number">${hintNumber}</span>
          <span>Hint</span>
        </div>
        <p>${hintText}</p>
      </div>
    `;
  }

  /**
   * Create error card with progressive hints
   */
  createErrorCard(error, attemptNumber = 0) {
    const errorInfo = this.interpretError(error);
    const hint = this.getHint(error, attemptNumber);
    
    return `
      ${this.formatForDisplay(errorInfo)}
      <div id="hint-container" style="margin-top: 16px;">
        ${this.formatHint(hint, attemptNumber + 1)}
      </div>
      <button id="show-next-hint" class="btn-secondary" style="margin-top: 16px;">
        💡 Show Next Hint
      </button>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export singleton instance
export const errorHandler = new FriendlyErrorHandler();
