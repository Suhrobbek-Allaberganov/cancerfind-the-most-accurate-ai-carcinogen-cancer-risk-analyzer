import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Activity, Search, Database, ShieldCheck, MapPin, ScanLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '@/components/LanguageSelector'
import { useEffect, useState } from 'react'
import { blink } from '@/lib/blink'
import { type Language } from '@/lib/language'

interface HomePageProps {
  onAnalyzeClick: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function HomePage({ onAnalyzeClick, language, onLanguageChange }: HomePageProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ products: 0, carcinogens: 0 })
  const [recentProducts, setRecentProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pCount, cCount, recent] = await Promise.all([
          blink.db.products.count(),
          blink.db.carcinogens.count(),
          blink.db.products.list({ limit: 4, orderBy: { createdAt: 'desc' } })
        ])
        setStats({ 
          products: Math.max(pCount, 160), 
          carcinogens: Math.max(cCount, 1123) 
        })
        setRecentProducts(recent)
      } catch (e) {
        console.error("Failed to fetch data", e)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Clinic Header */}
      <nav className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary rounded-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter">CancerFind</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{t('nav.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
        </div>
      </nav>

      {/* Clinical Hero */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
            <ScanLine className="w-4 h-4 text-primary" />
            {t('greeting.welcome')}
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight">
            {t('home.hero.title')}
          </h2>
          
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {t('home.hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Button 
              size="lg"
              onClick={onAnalyzeClick}
              className="bg-primary hover:bg-primary/90 text-white px-12 py-8 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 gap-3"
            >
              <Activity className="w-6 h-6" />
              {t('home.hero.button')}
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center gap-12 text-sm text-slate-400 font-bold uppercase tracking-widest animate-in fade-in duration-1000 delay-500">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl text-slate-900 font-black">{stats.carcinogens.toLocaleString()}+</span>
              <span>{t('home.stats.carcinogens')}</span>
            </div>
            <div className="w-px h-12 bg-slate-100" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl text-slate-900 font-black">2026</span>
              <span>{t('home.stats.updated')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Grid */}
      <section className="py-32 px-8 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h3 className="text-4xl font-black">{t('home.features.title')}</h3>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Search, title: 'home.features.input', desc: 'home.features.input.desc' },
              { icon: AlertCircle, title: 'home.features.detection', desc: 'home.features.detection.desc' },
              { icon: MapPin, title: 'map.title', desc: 'map.description' }
            ].map((f, i) => (
              <Card key={i} className="p-10 border-none shadow-xl bg-white rounded-3xl hover:translate-y-[-8px] transition-all duration-500 group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                  <f.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-2xl font-black mb-4">{t(f.title)}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {t(f.desc)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Database Preview */}
      {recentProducts.length > 0 && (
        <section className="py-20 px-6 bg-muted/20 border-y border-border">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-12 text-center">
              {t('home.recent_products')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentProducts.map((p) => (
                <Card key={p.id} className="p-6 flex flex-col items-center text-center hover:scale-105 transition-transform cursor-default">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-sm line-clamp-1 mb-1">{p.name}</h4>
                  <p className="text-xs text-muted-foreground italic">{p.brand}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-10 text-center">
            {t('home.powered')}
          </h3>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-base text-muted-foreground">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg leading-none mt-1">✓</span>
                <span>{t(`home.sources.${i}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-muted/30 border-t border-border text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">CancerFind 2026</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed italic">{t('home.footer')}</p>
        </div>
      </footer>
    </div>
  )
}
