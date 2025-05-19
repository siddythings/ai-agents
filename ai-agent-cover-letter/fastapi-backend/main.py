from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import openai
import requests
from dotenv import load_dotenv
from utils import extract_job_description, generate_cover_letter, generate_cold_email, extract_text_from_resume
from typing import Optional

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    resumeText: str
    jobDescription: str
    type: str

class ExtractJobRequest(BaseModel):
    url: str

@app.post("/api/generate-cover-letter")
async def generate_cover_letter_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        resume_text = extract_text_from_resume(file)
        content = generate_cover_letter(resume_text, job_description)
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/generate-cold-email")
async def generate_cold_email_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        resume_text = extract_text_from_resume(file)
        content = generate_cold_email(resume_text, job_description)
        return {"content": content}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/extract-job")
async def extract_job(req: ExtractJobRequest):
    try:
        description = extract_job_description(req.url)
        return {"description": description}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
