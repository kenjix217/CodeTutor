"""
Flask Backend for Python AI Tutor
A robust, synchronous alternative to the FastAPI version.
Run this on PythonAnywhere if FastAPI/uvicorn times out.
"""

from flask import Flask, request, jsonify, g
from flask_cors import CORS
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import requests
import os

# Import existing logic
import database
import models
import schemas

app = Flask(__name__)

# Enable CORS for all domains
CORS(app)

# SECURITY CONFIG (Same as FastAPI version)
SECRET_KEY = "CHANGE_THIS_TO_A_REALLY_LONG_RANDOM_STRING_FOR_PRODUCTION"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------------------
# Database Helpers
# ---------------------------

def get_db():
    """Get DB session for current request"""
    if 'db' not in g:
        g.db = database.SessionLocal()
    return g.db

@app.teardown_appcontext
def teardown_db(exception):
    """Close DB session after request"""
    db = g.pop('db', None)
    if db is not None:
        db.close()

# ---------------------------
# Auth Helpers
# ---------------------------

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=43200) # 30 days
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user():
    """Extract user from Authorization header"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    db = get_db()
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
        
    user = db.query(models.User).filter(models.User.username == username).first()
    return user

def login_required(f):
    """Decorator to require login"""
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"detail": "Not authenticated"}), 401
        g.user = user
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

# ---------------------------
# Routes
# ---------------------------

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Python AI Tutor Backend (Flask) is Live"})

@app.route("/register", methods=["POST"])
def register():
    db = get_db()
    data = request.json
    
    # Validation
    try:
        user_data = schemas.UserCreate(**data)
    except Exception as e:
        return jsonify({"detail": str(e)}), 422

    # Check existing
    db_user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if db_user:
        return jsonify({"detail": "Username already registered"}), 400
    
    # Create
    hashed_pw = get_password_hash(user_data.password)
    new_user = models.User(username=user_data.username, email=user_data.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": new_user.username})
    return jsonify({"access_token": token, "token_type": "bearer"})

@app.route("/token", methods=["POST"])
def login():
    db = get_db()
    data = request.json
    
    try:
        login_data = schemas.UserLogin(**data)
    except Exception as e:
        return jsonify({"detail": str(e)}), 422

    user = db.query(models.User).filter(models.User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        return jsonify({"detail": "Incorrect username or password"}), 401
    
    token = create_access_token(data={"sub": user.username})
    return jsonify({"access_token": token, "token_type": "bearer"})

@app.route("/users/me", methods=["GET"])
@login_required
def read_users_me():
    user = g.user
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat(),
        "has_api_key": bool(user.api_key_vault)
    })

@app.route("/sync/push", methods=["POST"])
@login_required
def sync_progress():
    db = get_db()
    user = g.user
    data_list = request.json
    
    for item_data in data_list:
        item = schemas.ProgressCreate(**item_data)
        
        db_progress = db.query(models.Progress).filter(
            models.Progress.user_id == user.id,
            models.Progress.lesson_id == item.lesson_id
        ).first()
        
        if db_progress:
            if db_progress.status != "completed" and item.status == "completed":
                db_progress.status = "completed"
                db_progress.homework_passed = item.homework_passed
        else:
            new_progress = models.Progress(
                user_id=user.id,
                lesson_id=item.lesson_id,
                status=item.status,
                homework_passed=item.homework_passed
            )
            db.add(new_progress)
            
    db.commit()
    return jsonify({"status": "synced"})

@app.route("/sync/pull", methods=["GET"])
@login_required
def get_cloud_progress():
    db = get_db()
    user = g.user
    progress_records = db.query(models.Progress).filter(models.Progress.user_id == user.id).all()
    
    # Serialize manually or use Pydantic
    results = []
    for p in progress_records:
        results.append({
            "lesson_id": p.lesson_id,
            "status": p.status,
            "homework_passed": p.homework_passed,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None
        })
    
    return jsonify(results)

@app.route("/vault", methods=["POST"])
@login_required
def update_api_key():
    db = get_db()
    user = g.user
    data = request.json
    
    user.api_key_vault = data.get("api_key")
    db.commit()
    return jsonify({"status": "updated"})

@app.route("/api/ai/chat", methods=["POST"])
@login_required
def ai_chat():
    user = g.user
    data = request.json
    
    api_key = user.api_key_vault
    if not api_key:
        return jsonify({"detail": "No API Key found. Please add one in Settings (Vault)."}), 400
        
    # Extract request data
    model = data.get("model", "thudm/glm-4-9b-chat:free")
    messages = data.get("conversation_history", [])
    
    # Call AI Provider (Synchronous Request)
    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://python-learner.app",
            },
            json={
                "model": model,
                "messages": messages
            },
            timeout=45
        )
        
        if response.status_code != 200:
            return jsonify({"detail": response.text}), response.status_code
            
        result = response.json()
        content = result['choices'][0]['message']['content']
        return jsonify({"response": content})
        
    except Exception as e:
        return jsonify({"detail": str(e)}), 500

if __name__ == "__main__":
    # Local dev
    app.run(port=8000, debug=True)
