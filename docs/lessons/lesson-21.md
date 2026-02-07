# Deployment and Production

## Goal

Learn to prepare your Python applications for deployment and share them with the world.

## Explanation

You've built applications. Now learn to **deploy** them - make them available for others to use.

**Deployment** means:
- Running your app on a server (not just your computer)
- Making it accessible via the internet
- Ensuring it's secure and reliable

**Key concepts:**

**Virtual Environments:**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install flask
```

**Requirements file:**
```bash
pip freeze > requirements.txt
```

**Environment variables:**
```python
import os

API_KEY = os.environ.get('API_KEY')
DEBUG = os.environ.get('DEBUG', 'False') == 'True'
```

---

## Golden Source Solutions

**Download the complete reference solutions for this lesson:**

<a href="golden_source/L21/" class="btn-primary" style="margin: 1rem 0; display: inline-block; padding: 0.5rem 1rem; text-decoration: none; background-color: var(--color-primary); color: white; border-radius: 4px;">📥 Download Lesson 21 Solutions</a>

These solutions include:
- Complete homework solutions with detailed comments
- Additional examples and exercises
- Best practices and optimization techniques
- Common pitfalls and how to avoid them

**Note:** These solutions require real Python installed on your computer. They won't work in the browser-based editor.

---

## Example

Production-ready Flask app:

```python
from flask import Flask
import os

app = Flask(__name__)

# Use environment variables
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')
app.config['DEBUG'] = os.environ.get('DEBUG', 'False') == 'True'

@app.route('/')
def home():
    return "Production Flask App!"

@app.route('/health')
def health():
    return {"status": "healthy"}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

## Homework

Prepare one of your projects for deployment:
- Create requirements.txt
- Add environment variables for sensitive data
- Add health check endpoint
- Write deployment README
- Test locally before deployment

## Reflection

1. What is deployment?
2. Why use virtual environments?
3. What is requirements.txt?
4. Why use environment variables?
5. What is the difference between development and production?

**Great work!** You can now deploy real applications!




