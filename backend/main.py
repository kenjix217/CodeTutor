"""
Python AI Tutor - Backend API v3.0
FastAPI application for Auth, Sync, and AI Proxy
"""

from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
import httpx
from pydantic import BaseModel, Field
import database, models, schemas, auth

# NOTE: Database initialization removed from startup to prevent PythonAnywhere timeouts.
# Run 'python -c "import database, models; models.Base.metadata.create_all(bind=database.engine)"' manually.

app = FastAPI(
    title="Python AI Tutor API",
    description="Backend for Python Learner Platform (Phase 3)",
    version="3.0.0"
)

# ---------------------------
# Health Check
# ---------------------------

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Python AI Tutor Backend is Live"}

# ---------------------------
# CORS (MVP settings)
# ---------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# AUTH ROUTES
# ---------------------------

@app.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(
        models.User.username == user.username
    ).first()

    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = auth.get_password_hash(user.password)

    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = auth.create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(
        models.User.username == form_data.username
    ).first()

    if not user or not auth.verify_password(
        form_data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return schemas.UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        created_at=current_user.created_at,
        has_api_key=bool(current_user.api_key_vault)
    )

# ---------------------------
# PROGRESS SYNC
# ---------------------------

@app.post("/sync/push")
def sync_progress(
    progress_list: List[schemas.ProgressCreate],
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    for item in progress_list:
        db_progress = db.query(models.Progress).filter(
            models.Progress.user_id == current_user.id,
            models.Progress.lesson_id == item.lesson_id
        ).first()

        if db_progress:
            if db_progress.status != "completed" and item.status == "completed":
                db_progress.status = "completed"
                db_progress.homework_passed = item.homework_passed
        else:
            new_progress = models.Progress(
                user_id=current_user.id,
                lesson_id=item.lesson_id,
                status=item.status,
                homework_passed=item.homework_passed
            )
            db.add(new_progress)

    db.commit()
    return {"status": "synced"}

@app.get("/sync/pull", response_model=List[schemas.ProgressResponse])
def get_cloud_progress(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Progress).filter(
        models.Progress.user_id == current_user.id
    ).all()

# ---------------------------
# API KEY VAULT
# ---------------------------

@app.post("/vault")
def update_api_key(
    key_data: schemas.APIKeyUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    current_user.api_key_vault = key_data.api_key
    db.commit()
    return {"status": "updated"}

# ---------------------------
# AI PROXY
# ---------------------------

class AIChatRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, str]] = Field(default_factory=list)
    provider: str = "openrouter"
    model: str = "thudm/glm-4-9b-chat:free" # Default model

@app.post("/api/ai/chat")
async def ai_chat(
    request: AIChatRequest,
    current_user: Optional[models.User] = Depends(auth.get_current_user)
):
    # CENTRAL API KEY CONFIGURATION
    # Replace the string below with your actual OpenRouter API Key
    api_key = "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" 
    
    if not api_key or "YOUR-KEY-HERE" in api_key:
        print("⚠️ Warning: Server API Key not configured in backend/main.py")
        # Fallback to user key if server key is missing (optional)
        if current_user and current_user.api_key_vault:
            api_key = current_user.api_key_vault

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Server AI configuration missing. Please contact administrator."
        )

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://python-learner.app",
                },
                json={
                    "model": request.model,
                    "messages": request.conversation_history,
                },
                timeout=45.0
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        data = response.json()
        content = data["choices"][0]["message"]["content"]
        return {"response": content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Local dev only
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
