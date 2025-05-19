'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface GeneratedContent {
  coverLetter: string | null;
  coldEmail: string | null;
}

interface AppContextType {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  generatedContent: GeneratedContent;
  setGeneratedContent: (content: GeneratedContent) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    coverLetter: null,
    coldEmail: null
  })

  return (
    <AppContext.Provider
      value={{
        resumeFile,
        setResumeFile,
        jobDescription,
        setJobDescription,
        generatedContent,
        setGeneratedContent
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 