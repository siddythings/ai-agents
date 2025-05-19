import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the webpage content
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch job posting')
    }

    const html = await response.text()

    // Use OpenAI to extract the job description
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts job descriptions from HTML content. Extract only the job description, requirements, and responsibilities. Ignore any company information, benefits, or other content."
        },
        {
          role: "user",
          content: `Extract the job description from this HTML: ${html}`
        }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    })

    return NextResponse.json({
      description: completion.choices[0].message.content
    })
  } catch (error) {
    console.error('Error extracting job description:', error)
    return NextResponse.json(
      { error: 'Failed to extract job description' },
      { status: 500 }
    )
  }
} 