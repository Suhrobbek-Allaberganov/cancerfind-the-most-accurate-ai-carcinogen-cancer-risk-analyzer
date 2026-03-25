import { useState, useEffect } from 'react'
import { createClient } from '@blinkdotnew/sdk'
import HomePage from './pages/HomePage'
import AnalyzerPage from './pages/AnalyzerPage'
import { Toaster } from 'sonner'
import { detectLanguage } from './lib/language'
import type { Language } from './lib/language'

const blink = createClient({
  projectId: 'cancerfind-ai-carcinogen-analyzer-96v7t8q5',
  authRequired: false
})

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'analyzer'>('home')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [language, setLanguage] = useState<Language>(() => {
    // Detect language from browser navigator
    const browserLang = navigator.language || navigator.languages[0] || 'en'
    if (browserLang.startsWith('uz')) return 'uz'
    if (browserLang.startsWith('ru')) return 'ru'
    return 'en'
  })

  // Detect language from user input in real-time
  const updateLanguageFromInput = (text: string) => {
    if (text.trim()) {
      const detectedLang = detectLanguage(text)
      setLanguage(detectedLang)
    }
  }

  const goToAnalyzer = () => setCurrentPage('analyzer')
  const goToHome = () => {
    setCurrentPage('home')
    setAnalysisResult(null)
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentPage === 'home' ? (
        <HomePage 
          onAnalyzeClick={goToAnalyzer}
          language={language}
          onLanguageChange={changeLanguage}
        />
      ) : (
        <AnalyzerPage 
          onHome={goToHome} 
          onResult={setAnalysisResult}
          blink={blink}
          language={language}
          onLanguageChange={changeLanguage}
          onInputChange={updateLanguageFromInput}
        />
      )}
      <Toaster />
    </div>
  )
}

export default App
