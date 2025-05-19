'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { GenerateContent } from "@/components/generate-content"
import { useApp } from '@/context/app-context'
import { ArrowRight, FileText, Link, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const { setJobDescription, resumeFile, jobDescription, setGeneratedContent, generatedContent } = useApp()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [jobDescriptionAdded, setJobDescriptionAdded] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const handleUrlSubmit = async (url: string) => {
    if (!url) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/extract-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract job description')
      }

      const data = await response.json()
      setJobDescription(data.description)
      setJobDescriptionAdded(true)
      setTimeout(() => setCurrentStep(2), 500)
    } catch (error) {
      console.error('Error extracting job description:', error)
      // TODO: Show error toast
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (!resumeFile || !jobDescription) return

    setLoading(true)
    setGenerationProgress(0)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Create form data for both requests
      const formData = new FormData()
      formData.append('file', resumeFile)
      formData.append('job_description', jobDescription)

      // Make both requests simultaneously
      const [coverLetterResponse, coldEmailResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/generate-cover-letter`, {
          method: 'POST',
          body: formData,
        }),
        fetch(`${API_BASE_URL}/api/generate-cold-email`, {
          method: 'POST',
          body: formData,
        })
      ]);

      if (!coverLetterResponse.ok || !coldEmailResponse.ok) {
        throw new Error('Failed to generate content')
      }

      const [coverLetterData, coldEmailData] = await Promise.all([
        coverLetterResponse.json(),
        coldEmailResponse.json()
      ]);

      // Store both contents in context
      setGeneratedContent({
        coverLetter: coverLetterData.content,
        coldEmail: coldEmailData.content
      });

      setGenerationProgress(100)
    } catch (error) {
      console.error('Error generating content:', error)
      // TODO: Show error toast
    } finally {
      setLoading(false)
    }
  }

  // Add useEffect to handle content generation
  useEffect(() => {
    const shouldGenerateContent = 
      currentStep === 3 && 
      resumeFile && 
      jobDescription && 
      (!generatedContent.coverLetter || !generatedContent.coldEmail);

    if (shouldGenerateContent) {
      generateContent();
    }
  }, [currentStep, resumeFile, jobDescription, generatedContent]);

  const steps = [
    { id: 1, title: 'Add Job Details', description: 'Provide the job description or URL' },
    { id: 2, title: 'Upload Resume', description: 'Upload your professional background' },
    { id: 3, title: 'Generate Content', description: 'Create your perfect cover letter or cold email' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        </div>
        
        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6 p-3 rounded-2xl bg-primary/10"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div> */}
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              AI-Powered Cover Letters
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create compelling, personalized content in minutes. Let AI help you stand out.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-16">
        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: currentStep >= step.id ? 1 : 0.8,
                    opacity: currentStep >= step.id ? 1 : 0.5
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${currentStep >= step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'}`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </motion.div>
                <div className="text-center">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-[60%] w-[80%] h-[2px] bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Job Description */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Link className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Job Details</CardTitle>
                        <CardDescription>
                          {loading ? 'Extracting job description...' : 'Add the job description or URL to proceed'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://example.com/job-posting" 
                        type="url"
                        disabled={loading}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUrlSubmit((e.target as HTMLInputElement).value)
                          }
                        }}
                      />
                      <Button
                        variant="secondary"
                        disabled={loading}
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          handleUrlSubmit(input.value)
                        }}
                        className="shrink-0"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Extracting...</span>
                          </div>
                        ) : (
                          'Extract'
                        )}
                      </Button>
                    </div>
                    {loading && (
                      <div className="space-y-2">
                        <Progress value={100} className="h-1" />
                        <div className="text-center text-sm text-muted-foreground">
                          <p>Analyzing job posting...</p>
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">or paste below</span>
                      </div>
                    </div>
                    <Textarea 
                      placeholder="Paste job description here..." 
                      className="min-h-[200px] resize-none"
                      disabled={loading}
                      onChange={(e) => {
                        setJobDescription(e.target.value)
                        if (e.target.value.length > 50) {
                          setJobDescriptionAdded(true)
                          setTimeout(() => setCurrentStep(2), 500)
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Resume Upload */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
                        <CardDescription>Start by uploading your professional background</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FileUpload onUploadComplete={() => {
                      setResumeUploaded(true)
                      generateContent() // Generate content when resume is uploaded
                      setTimeout(() => setCurrentStep(3), 500)
                    }} />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Generate Content */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/10 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Generate Content</CardTitle>
                        <CardDescription>
                          {loading ? 'Generating your content...' : 'Choose your content type and customize'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        <Progress value={generationProgress} className="h-1" />
                        <div className="text-center text-muted-foreground">
                          <p className="mb-2">Creating your personalized content...</p>
                          <p className="text-sm">This may take a few moments</p>
                        </div>
                      </div>
                    ) : (
                      <Tabs defaultValue="cover-letter" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50">
                          <TabsTrigger value="cover-letter" className="data-[state=active]:bg-background">
                            Cover Letter
                          </TabsTrigger>
                          <TabsTrigger value="cold-email" className="data-[state=active]:bg-background">
                            Cold Email
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="cover-letter" className="mt-6">
                          <GenerateContent type="cover-letter" />
                        </TabsContent>
                        <TabsContent value="cold-email" className="mt-6">
                          <GenerateContent type="cold-email" />
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Previous Step
            </Button>
            <Button
              onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
              disabled={currentStep === 3 || (currentStep === 1 && !jobDescriptionAdded) || (currentStep === 2 && !resumeUploaded)}
              className="gap-2"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <a 
              href="https://nextjs.org" 
              className="font-medium hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
            <span>,</span>
            <a 
              href="https://www.firecrawl.dev/" 
              className="font-medium hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firecrawl
            </a>
            <span>and</span>
            <a 
              href="https://openai.com" 
              className="font-medium hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI
            </a>
            <ArrowRight className="w-4 h-4" />
          </div>
        </footer>
      </main>
    </div>
  )
}
