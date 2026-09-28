import { useState } from 'react'
import HomePage from './pages/HomePage'
import AnalyzerPage from './pages/AnalyzerPage'
import { Toaster } from 'sonner'
import { useTranslation } from 'react-i18next'
import type { Language } from './lib/language'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'analyzer'>('home')
  const { i18n } = useTranslation()

  const goToAnalyzer = () => setCurrentPage('analyzer')
  const goToHome = () => setCurrentPage('home')

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      {currentPage === 'home' ? (
        <HomePage 
          onAnalyzeClick={goToAnalyzer}
          language={i18n.language as Language}
          onLanguageChange={handleLanguageChange}
        />
      ) : (
        <AnalyzerPage 
          onHome={goToHome} 
          language={i18n.language as Language}
          onLanguageChange={handleLanguageChange}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App