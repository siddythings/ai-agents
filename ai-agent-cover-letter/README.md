# AI-Powered Cover Letter & Cold Email Generator

An intelligent application that helps job seekers create personalized cover letters and cold emails using AI. The application analyzes your resume and job description to generate compelling, tailored content that helps you stand out.

## Features

- **Job Description Extraction**: Automatically extract job descriptions from URLs or paste them manually
- **Resume Analysis**: Upload your resume in PDF or DOCX format for AI analysis
- **Dual Content Generation**: Generate both cover letters and cold emails simultaneously
- **Modern UI**: Clean, intuitive interface with step-by-step guidance
- **Real-time Progress**: Visual feedback during content generation
- **Easy Export**: Copy to clipboard or download generated content
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **Framer Motion**: For smooth animations
- **Shadcn/ui**: For UI components
- **React Context**: For state management

### Backend
- **FastAPI**: Python web framework
- **OpenAI API**: For AI-powered content generation
- **Python-docx**: For DOCX file processing
- **PyPDF2**: For PDF file processing
- **Requests**: For web scraping job descriptions

## Project Structure

```
custom-cover-letter/
├── cover-letter-next/     # Frontend application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── context/         # React context
│   └── public/          # Static assets
│
└── fastapi-backend/      # Backend application
    ├── main.py          # FastAPI application
    └── utils.py         # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd custom-cover-letter
   ```

2. Set up the frontend:
   ```bash
   cd cover-letter-next
   npm install
   ```

3. Set up the backend:
   ```bash
   cd ../fastapi-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Create environment files:

   Frontend (.env.local):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   Backend (.env):
   ```
   OPENAI_API_KEY=your_openai_api_key
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd fastapi-backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn main:app --reload
   ```

2. Start the frontend development server:
   ```bash
   cd cover-letter-next
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Add Job Details**
   - Enter a job posting URL or paste the job description
   - The system will automatically extract and analyze the job requirements

2. **Upload Resume**
   - Upload your resume in PDF or DOCX format
   - The system will analyze your professional background

3. **Generate Content**
   - Both cover letter and cold email are generated simultaneously
   - View, copy, or download the generated content
   - Switch between cover letter and cold email using tabs

## API Endpoints

- `POST /api/extract-job`: Extract job description from URL
- `POST /api/generate-cover-letter`: Generate cover letter
- `POST /api/generate-cold-email`: Generate cold email

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- Next.js team for the amazing framework
- FastAPI for the efficient backend framework
- All contributors who have helped shape this project 