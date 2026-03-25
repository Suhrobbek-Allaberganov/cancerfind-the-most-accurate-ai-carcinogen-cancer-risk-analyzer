import { Button } from '@/components/ui/button'
import { type Language } from '@/lib/language'
import { Globe } from 'lucide-react'

interface LanguageSelectorProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const languages: { code: Language; label: string; name: string }[] = [
    { code: 'en', label: 'English', name: 'EN' },
    { code: 'ru', label: 'Русский', name: 'РУ' },
    { code: 'uz', label: "O'zbekcha", name: 'UZ' },
  ]

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4 text-muted-foreground mr-1" />
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onLanguageChange(lang.code)}
          title={lang.label}
          className="text-xs font-semibold min-w-8 h-8"
        >
          {lang.name}
        </Button>
      ))}
    </div>
  )
}
