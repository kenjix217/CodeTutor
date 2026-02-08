"""
Flask Backend for Python AI Tutor
A robust, synchronous alternative to the FastAPI version.
Run this on PythonAnywhere if FastAPI/uvicorn times out.
"""

from flask import Flask, request, jsonify, g, url_for, session, redirect
from flask_cors import CORS
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from authlib.integrations.flask_client import OAuth
import requests
import os

# Import existing logic
import database
import models
import schemas

app = Flask(__name__)
app.secret_key = "REPLACE_WITH_LONG_RANDOM_STRING_SESSION_KEY" # Required for OAuth session

# Enable CORS for all domains
CORS(app)

# SECURITY CONFIG (Same as FastAPI version)
SECRET_KEY = "CHANGE_THIS_TO_A_REALLY_LONG_RANDOM_STRING_FOR_PRODUCTION"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------------------
# OAuth Setup (Google)
# ---------------------------
oauth = OAuth(app)

# NOTE: You must set these in PythonAnywhere WSGI config (os.environ)
# OR replace them here directly for testing (but don't commit real secrets!)
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID_HERE"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET", "YOUR_GOOGLE_CLIENT_SECRET_HERE"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

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

    # Check existing username
    if db.query(models.User).filter(models.User.username == user_data.username).first():
        return jsonify({"detail": "Username already registered"}), 400

    # Check existing email
    if db.query(models.User).filter(models.User.email == user_data.email).first():
        return jsonify({"detail": "Email already registered"}), 400
    
    # Create
    hashed_pw = get_password_hash(user_data.password)
    new_user = models.User(
        username=user_data.username, 
        email=user_data.email, 
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        dob=user_data.dob,
        hashed_password=hashed_pw
    )
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

# ---------------------------
# OAuth Routes
# ---------------------------

@app.route('/login/google')
def login_google():
    """Initiate Google OAuth flow"""
    # Requires HTTPS on production
    redirect_uri = url_for('authorize_google', _external=True)
    return google.authorize_redirect(redirect_uri)

@app.route('/auth/google/callback')
def authorize_google():
    """Handle Google OAuth callback"""
    db = get_db()
    try:
        token = google.authorize_access_token()
        # "userinfo" is now automatically parsed if scope includes 'openid'
        user_info = token.get('userinfo')
        
        # Fallback if not in token (fetch manually)
        if not user_info:
            user_info = google.userinfo()
        
        email = user_info['email']
        username = email.split('@')[0] # Default username from email
        
        # Check if user exists
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if not user:
            # Create new user automatically
            # We set a random unguessable password since they use Google to login
            import secrets
            random_pw = secrets.token_urlsafe(16)
            hashed_pw = get_password_hash(random_pw)
            
            user = models.User(username=username, email=email, hashed_password=hashed_pw)
            db.add(user)
            db.commit()
            db.refresh(user)
            
        # Create JWT for our app
        app_token = create_access_token(data={"sub": user.username})
        
        # Redirect to frontend with token
        # NOTE: Update this URL to your actual frontend URL
        frontend_url = "https://kenjix217.github.io/CodeTutor?token=" + app_token
        return redirect(frontend_url)
        
    except Exception as e:
        return f"Auth failed: {str(e)}", 400

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
