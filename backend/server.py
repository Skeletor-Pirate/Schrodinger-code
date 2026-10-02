"""
Schrödinger's Codebase - Backend Server

This server orchestrates the Schrödinger platform, handling API requests
and connecting the frontend with backend services.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from schrodinger_codebase import generate_code
from ppo_training_loop import SchrödingerPPOTrainer
from illusion_fs import IllusionFS
import os

app = FastAPI()

# Initialize services
ppotrainer = SchrödingerPPOTrainer()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Request models
class CodeGenerationRequest(BaseModel):
    target: str
    draft: str = None
    quant_draft: str = None
    systems_draft: str = None
    risk_draft: str = None
    qa_draft: str = None

class TrainingRequest(BaseModel):
    num_steps: int = 2048
    model_path: str = None

# API Endpoints
@app.post("/api/generate-code")
def generate_code_endpoint(request: CodeGenerationRequest) -> Dict[str, Any]:
    """Generate code using the multi-agent pipeline"""
    try:
        result = generate_code(request.target)
        return {
            "status": "success",
            "data": result,
            "message": "Code generation completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/train-ppo")
def train_ppo_endpoint(request: TrainingRequest) -> Dict[str, Any]:
    """Train PPO model"""
    try:
        if request.model_path:
            ppotrainer.load_model(request.model_path)

        result = ppotrainer.train_episode(request.num_steps)
        return {
            "status": "success",
            "data": result,
            "message": "PPO training completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save-model")
def save_model_endpoint(model_path: str) -> Dict[str, Any]:
    """Save PPO model"""
    try:
        ppotrainer.save_model(model_path)
        return {
            "status": "success",
            "message": f"Model saved to {model_path}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
def get_status() -> Dict[str, Any]:
    """Get system status"""
    return {
        "status": "running",
        "services": {
            "code_generator": "active",
            "ppo_trainer": "active",
            "virtual_fs": "active"
        },
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)