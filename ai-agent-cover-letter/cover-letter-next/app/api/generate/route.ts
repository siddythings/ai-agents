import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription, type } = await req.json();

    if (!resumeText || !jobDescription || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = type === 'cover-letter'
      ? `Based on the following resume and job description, generate a professional cover letter.
         Focus on matching the candidate's experience with the job requirements.
         
         Resume:
         ${resumeText}
         
         Job Description:
         ${jobDescription}
         
         Generate a compelling cover letter that highlights relevant experience and skills.`
      : `Based on the following resume and job description, generate a professional cold email.
         Make it concise, engaging, and focused on creating a connection.
         
         Resume:
         ${resumeText}
         
         Job Description:
         ${jobDescription}
         
         Generate a compelling cold email that demonstrates value and interest.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: type === 'cover-letter'
            ? "You are a professional career coach helping to write compelling cover letters."
            : "You are a professional career coach helping to write effective cold emails."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: type === 'cover-letter' ? 1000 : 800,
    });

    return NextResponse.json({
      content: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 