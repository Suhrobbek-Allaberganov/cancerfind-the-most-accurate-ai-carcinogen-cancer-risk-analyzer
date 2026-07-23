import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, AlertTriangle, Info, MapPin, Droplets, Wind, Mountain } from 'lucide-react'
import { t, type Language, translations } from '@/lib/language'
import { ScientificRiskReport } from '@/services/analyzer'

interface ResultsDisplayProps {
  results: ScientificRiskReport;
  onNewAnalysis: () => void;
  language?: string;
}

const getRiskColor = (risk: string) => {
  if (risk === 'High Risk') return 'border-destructive/50 bg-destructive/5 text-destructive'
  if (risk === 'Caution') return 'border-amber-500/50 bg-amber-50 text-amber-700'
  return 'border-emerald-500/50 bg-emerald-50 text-emerald-700'
}

const getGroupBadgeColor = (group: string) => {
  if (group.includes('1')) return 'bg-destructive text-destructive-foreground'
  if (group.includes('2A')) return 'bg-orange-600 text-white'
  if (group.includes('2B')) return 'bg-amber-500 text-white'
  return 'bg-slate-500 text-white'
}

export default function ResultsDisplay({ results, onNewAnalysis, language = 'en' }: ResultsDisplayProps) {
  const hasCarcinogens = results.carcinogens && results.carcinogens.length > 0

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Risk Level Header */}
      <Card className={`p-8 border-2 shadow-2xl ${getRiskColor(results.overallRisk)}`}>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 shadow-inner">
            {results.overallRisk === 'High Risk' ? (
              <AlertTriangle className="w-12 h-12 text-destructive" />
            ) : results.overallRisk === 'Caution' ? (
              <AlertCircle className="w-12 h-12 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h3 className="text-3xl font-black uppercase tracking-tighter">
                {results.overallRisk === 'High Risk' ? t('risk.high', language) : 
                 results.overallRisk === 'Caution' ? t('risk.caution', language) : 
                 t('risk.safe', language)}
              </h3>
              <Badge variant="outline" className="font-mono text-[10px] uppercase border-current">{results.inputType}</Badge>
            </div>
            <p className="text-lg font-medium leading-relaxed opacity-90">
              {results.assessment}
            </p>
          </div>
        </div>
      </Card>

      {/* Regional Environmental Data */}
      {results.regionalData && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-black tracking-tight">{t('map.title', language)}: {results.regionalData.location}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20"><Droplets className="w-5 h-5 text-blue-600" /></div>
                <h4 className="font-bold">{t('map.water', language)}</h4>
              </div>
              <ul className="space-y-2">
                {results.regionalData.waterQuality.map((item, i) => (
                  <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20"><Wind className="w-5 h-5 text-emerald-600" /></div>
                <h4 className="font-bold">{t('map.air', language)}</h4>
              </div>
              <ul className="space-y-2">
                {results.regionalData.airQuality.map((item, i) => (
                  <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20"><Mountain className="w-5 h-5 text-orange-600" /></div>
                <h4 className="font-bold">{t('map.soil', language)}</h4>
              </div>
              <ul className="space-y-2">
                {results.regionalData.soilQuality.map((item, i) => (
                  <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Identified Substances */}
      {hasCarcinogens && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Info className="w-6 h-6 text-primary" />
              {t('report.substances', language)}
            </h3>
            <Badge variant="secondary" className="font-bold">{results.carcinogens.length}</Badge>
          </div>
          
          <div className="grid gap-6">
            {results.carcinogens.map((carc, idx) => (
              <Card key={idx} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-xl group hover:border-primary/30 transition-all">
                <div className="flex">
                  <div className={`w-2 ${getGroupBadgeColor(carc.iarcGroup)}`} />
                  <div className="p-8 flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {carc.name}
                        </h4>
                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Evaluated {carc.evaluationYear}
                        </p>
                      </div>
                      <Badge className={`${getGroupBadgeColor(carc.iarcGroup)} px-4 py-1 text-xs font-black rounded-full`}>
                        IARC {carc.iarcGroup}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" /> {t('report.disease_link', language)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {carc.linkedOncology.map((disease, i) => (
                            <Badge key={i} variant="secondary" className="bg-destructive/5 text-destructive border-destructive/10 font-bold">
                              {disease}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Droplets className="w-3 h-3" /> {t('report.pathways', language)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {carc.exposureRoutes.map((path, i) => (
                            <Badge key={i} variant="outline" className="font-bold border-slate-200 text-slate-600">
                              {path}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('report.citations', language)}</p>
                        <p className="text-sm font-mono font-medium text-slate-600 dark:text-slate-400">{carc.monographRef}</p>
                      </div>
                      {carc.safeLimits && (
                        <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('results.limit', language)}</p>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{carc.safeLimits}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <Card className="p-10 border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-xl">
          <h4 className="text-xl font-black text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-3">
            <Info className="w-6 h-6" />
            {t('report.recommendations', language)}
          </h4>
          <ul className="grid md:grid-cols-2 gap-4">
            {results.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-4 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-500/10 text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-emerald-500 font-black">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="p-6 bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
        <p className="text-[11px] text-slate-500 leading-relaxed text-center">
          <strong>{t('nav.title', language)} Medical Policy:</strong> {t('results.disclaimer', language)}
        </p>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={onNewAnalysis}
          size="lg"
          className="rounded-full px-12 h-16 text-lg font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
        >
          {t('results.newAnalysis', language)}
        </Button>
      </div>
    </div>
  )
}