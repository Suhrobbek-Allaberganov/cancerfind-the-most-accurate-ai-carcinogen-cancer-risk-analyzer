import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { t, type Language, translations } from '@/lib/language'

interface Carcinogen {
  name: string
  iarcGroup: string
  evaluationYear: number
  primaryCancerSites: string[]
  exposureRoutes: string[]
  evidenceStrength: string
  source: string
  safeLimit?: string
  notes?: string
}

interface ResultsDisplayProps {
  results: {
    inputType: string
    carcinogensFound: Carcinogen[]
    overallAssessment: string
    recommendations?: string[]
  }
  onNewAnalysis: () => void
  language?: Language
}

const getGroupColor = (group: string) => {
  if (group === 'Group 1') return 'bg-destructive text-destructive-foreground'
  if (group === 'Group 2A') return 'bg-accent text-accent-foreground'
  if (group === 'Group 2B') return 'bg-accent/80 text-accent-foreground'
  if (group === 'Group 3') return 'bg-muted text-muted-foreground'
  return 'bg-muted text-muted-foreground'
}

const getGroupLabel = (group: string, language: Language) => {
  const labels: Record<Language, Record<string, string>> = {
    en: {
      'Group 1': 'CARCINOGENIC TO HUMANS',
      'Group 2A': 'PROBABLY CARCINOGENIC',
      'Group 2B': 'POSSIBLY CARCINOGENIC',
      'Group 3': 'NOT CLASSIFIABLE',
      'Group 4': 'PROBABLY NOT CARCINOGENIC',
    },
    ru: {
      'Group 1': 'КАНЦЕРОГЕННО ДЛЯ ЧЕЛОВЕКА',
      'Group 2A': 'ВЕРОЯТНО КАНЦЕРОГЕННО',
      'Group 2B': 'ВОЗМОЖНО КАНЦЕРОГЕННО',
      'Group 3': 'НЕ КЛАССИФИЦИРУЕТСЯ',
      'Group 4': 'ВЕРОЯТНО НЕ КАНЦЕРОГЕННО',
    },
    uz: {
      'Group 1': 'INSONLAR UCHUN KANSEROGEN',
      'Group 2A': 'EHTIMOLIY KANSEROGEN',
      'Group 2B': 'BOʻLISHI MUMKIN BOʻLGAN KANSEROGEN',
      'Group 3': 'TASNIFLANMAGAN',
      'Group 4': 'EHTIMOL KANSEROGEN EMAS',
    }
  }
  return labels[language][group] || group
}

export default function ResultsDisplay({ results, onNewAnalysis, language = 'en' }: ResultsDisplayProps) {
  const hasCarcinogens = results.carcinogensFound && results.carcinogensFound.length > 0

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <Card className={`p-6 border-2 ${hasCarcinogens ? 'border-destructive/30' : 'border-primary/30'}`}>
        <div className="flex gap-4 items-start">
          {hasCarcinogens ? (
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t('results.assessment', language)}
            </h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {results.overallAssessment === "Доказательства недостаточны" || 
               results.overallAssessment === "Dalillar yetarli emas" ||
               results.overallAssessment === "Insufficient evidence" 
               ? t('label.insufficient', language) 
               : results.overallAssessment}
            </p>
          </div>
        </div>
      </Card>

      {/* Carcinogens List */}
      {hasCarcinogens && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            {t('results.carcinogenFound', language)} {results.carcinogensFound.length}
          </h3>
          
          {results.carcinogensFound.map((carcinogen, idx) => (
            <Card key={idx} className="p-6 border-2 border-border hover:border-primary/30 transition">
              <div className="space-y-4">
                {/* Name and Classification */}
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-xl font-bold text-foreground">
                    {carcinogen.name}
                  </h4>
                  <Badge className={`${getGroupColor(carcinogen.iarcGroup)} whitespace-nowrap text-xs font-bold`}>
                    {carcinogen.iarcGroup}
                  </Badge>
                </div>

                {/* Group Label and Year */}
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    {getGroupLabel(carcinogen.iarcGroup, language)}
                  </p>
                  <p className="text-muted-foreground">
                    {t('results.year', language)}: {carcinogen.evaluationYear}
                  </p>
                </div>

                {/* Evidence Strength */}
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-muted-foreground">{t('results.strength', language)}:</span>
                  <Badge variant="outline" className="text-xs">
                    {carcinogen.evidenceStrength}
                  </Badge>
                </div>

                {/* Cancer Sites */}
                {carcinogen.primaryCancerSites && carcinogen.primaryCancerSites.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">{t('results.sites', language)}:</p>
                    <div className="flex flex-wrap gap-2">
                      {carcinogen.primaryCancerSites.map((site, i) => {
                        const translationKey = `cancer.${site.toLowerCase().trim()}`
                        return (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {translations[language][translationKey] || site}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Exposure Routes */}
                {carcinogen.exposureRoutes && carcinogen.exposureRoutes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">{t('results.exposure', language)}:</p>
                    <div className="flex flex-wrap gap-2">
                      {carcinogen.exposureRoutes.map((route, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {route}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe Limit */}
                {carcinogen.safeLimit && (
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{t('results.limit', language)}:</p>
                    <p className="text-sm text-foreground">{carcinogen.safeLimit}</p>
                  </div>
                )}

                {/* Source */}
                <div className="text-xs text-muted-foreground border-t border-border pt-3">
                  <p className="font-medium mb-1">{t('results.source', language)}:</p>
                  <p className="font-mono">{carcinogen.source}</p>
                </div>

                {/* Notes */}
                {carcinogen.notes && (
                  <div className="text-xs text-muted-foreground border-t border-border pt-3">
                    <p className="font-medium mb-1">Additional Notes:</p>
                    <p>{carcinogen.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card className="p-6 border-2 border-primary/20 bg-primary/5">
          <h4 className="text-lg font-bold text-foreground mb-3">{t('results.recommendations', language)}</h4>
          <ul className="space-y-2">
            {results.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-primary font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30 border-border">
        <p className="text-xs text-muted-foreground">
          ⓘ <strong>{t('nav.title', language)}:</strong> {t('results.disclaimer', language)}
        </p>
      </Card>

      {/* New Analysis Button */}
      <div className="flex justify-center">
        <Button
          onClick={onNewAnalysis}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          size="lg"
        >
          {t('results.newAnalysis', language)}
        </Button>
      </div>
    </div>
  )
}
