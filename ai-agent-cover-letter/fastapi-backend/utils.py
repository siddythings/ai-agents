import os
import PyPDF2
import docx
import requests
from bs4 import BeautifulSoup
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai
from dotenv import load_dotenv
from firecrawl import FirecrawlApp
from fastapi import UploadFile

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')

# Load environment variables
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def extract_text_from_pdf(file):
    """Extract text from PDF file."""
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file):
    """Extract text from DOCX file."""
    doc = docx.Document(file)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

def extract_text_from_resume(file: UploadFile):
    """Extract text from resume file (PDF or DOCX)."""
    if not file or not file.filename:
        raise ValueError("No file provided")
        
    if file.filename.endswith('.pdf'):
        return extract_text_from_pdf(file.file)
    elif file.filename.endswith('.docx'):
        return extract_text_from_docx(file.file)
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX file.")

def extract_job_description(url):
    """Extract job description from URL using Firecrawl."""
    try:
        print(os.getenv('FIRECRAWL_API_KEY'))
        app = FirecrawlApp(
            api_key=os.getenv('FIRECRAWL_API_KEY')
        )
        result = app.scrape_url(
            url
        )
        # Firecrawl returns a dict with 'text' and possibly 'html' keys
        print(result)
        text = result.get('markdown', '')
        if not text:
            raise Exception('No text content found from Firecrawl.')
        return text
    except Exception as e:
        raise Exception(f"Error extracting job description with Firecrawl: {str(e)}")

def calculate_relevance_score(resume_text, job_description):
    """Calculate relevance score between resume and job description."""
    # Preprocess texts
    stop_words = set(stopwords.words('english'))
    
    def preprocess_text(text):
        tokens = word_tokenize(text.lower())
        tokens = [token for token in tokens if token.isalnum() and token not in stop_words]
        return ' '.join(tokens)
    
    # Preprocess both texts
    resume_processed = preprocess_text(resume_text)
    jd_processed = preprocess_text(job_description)
    
    # Calculate TF-IDF and cosine similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_processed, jd_processed])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    return round(similarity * 100, 2)

def generate_cover_letter(resume_text, job_description):
    """Generate a cover letter using OpenAI API."""
    try:
        prompt = f"""Based on the following resume and job description, generate a professional cover letter.
        Focus on matching the candidate's experience with the job requirements.
        
        Resume:
        {resume_text}
        
        Job Description:
        {job_description}
        
        Generate a compelling cover letter that highlights relevant experience and skills."""
        
        response = openai.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a professional career coach helping to write compelling cover letters."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error generating cover letter: {str(e)}")

def generate_cold_email(resume_text, job_description):
    """Generate a cold email using OpenAI API."""
    try:
        prompt = f"""Based on the following resume and job description, generate a professional cold email.
        Make it concise, engaging, and focused on creating a connection.
        
        Resume:
        {resume_text}
        
        Job Description:
        {job_description}
        
        Generate a compelling cold email that demonstrates value and interest."""
        
        response = openai.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a professional career coach helping to write effective cold emails."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error generating cold email: {str(e)}") 