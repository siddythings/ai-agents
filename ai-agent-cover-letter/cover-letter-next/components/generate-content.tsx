'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Download } from 'lucide-react'
import { useApp } from '@/context/app-context'

interface GenerateContentProps {
  type: 'cover-letter' | 'cold-email'
}

export function GenerateContent({ type }: GenerateContentProps) {
  const { generatedContent } = useApp()

  const handleCopy = () => {
    const content = type === 'cover-letter' 
      ? generatedContent.coverLetter 
      : generatedContent.coldEmail;
    
    if (content) {
      navigator.clipboard.writeText(content)
      // TODO: Show success toast
    }
  }

  const handleDownload = () => {
    const content = type === 'cover-letter' 
      ? generatedContent.coverLetter 
      : generatedContent.coldEmail;
    
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const content = type === 'cover-letter' 
    ? generatedContent.coverLetter 
    : generatedContent.coldEmail;

  if (!content) {
    return null
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-4">
        <Textarea
          value={content}
          readOnly
          className="min-h-[300px] font-mono"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  )
} 