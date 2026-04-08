import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ArrowLeft, Camera, Barcode, Type, Loader2, AlertCircle, ShieldCheck, ScanBarcode, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { analyzeProduct, ScientificRiskReport } from '@/services/analyzer'
import ResultsDisplay from '@/components/ResultsDisplay'
import RegionalHazardMap from '@/components/RegionalHazardMap'
import LanguageSelector from '@/components/LanguageSelector'
import { Capacitor } from '@capacitor/core'
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning'
import { Geolocation } from '@capacitor/geolocation'

interface AnalyzerPageProps {
  onHome: () => void
}

export default function AnalyzerPage({ onHome }: AnalyzerPageProps) {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<ScientificRiskReport | null>(null)
  const [imageData, setImageData] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'text' | 'photo' | 'barcode' | 'map'>('text')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAnalysis = async (type: 'text' | 'barcode' | 'image', value: string = input) => {
    const textToAnalyze = type === 'image' ? "Image analysis requested" : value;
    
    if (!textToAnalyze.trim()) {
      toast.error(t('analyzer.error.empty'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeProduct(textToAnalyze, type, i18n.language, imageData || undefined);
      setReport(result);
      toast.success(t('analyzer.success'));
    } catch (error: any) {
      console.error(error);
      if (error.message === "GOOGLE_AI_API_KEY_MISSING") {
        toast.error("Google AI API Key is missing. Please add GOOGLE_AI_API_KEY to Project Secrets.");
      } else {
        toast.error(t('analyzer.error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageData(base64String);
        handleAnalysis('image', "Image analysis requested");
      };
      reader.readAsDataURL(file);
    }
  };

  const startBarcodeScan = async () => {
    if (!Capacitor.isNativePlatform()) {
      toast.info("Barcode scanning simulation (Browser Mode)");
      setTimeout(() => handleAnalysis('barcode', "4000517004247"), 1500);
      return;
    }

    try {
      const granted = await BarcodeScanner.requestPermissions();
      if (granted.camera !== 'granted') {
        toast.error('Camera permission denied');
        return;
      }

      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.Ean13, BarcodeFormat.Ean8, BarcodeFormat.UpcA, BarcodeFormat.Upce],
      });

      if (barcodes.length > 0) {
        const code = barcodes[0].rawValue;
        handleAnalysis('barcode', code);
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to start scanner');
    }
  };

  const handleGeolocationAnalysis = async () => {
    setIsLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      const locationStr = `Location: ${position.coords.latitude}, ${position.coords.longitude}`;
      handleAnalysis('text', locationStr);
    } catch (error) {
      console.error('Geolocation error:', error);
      toast.error('Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onHome} className="hover:bg-primary/10 text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="font-bold text-xl tracking-tight text-slate-900">CancerFind <span className="text-primary text-xs font-medium uppercase px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20 ml-2">Clinical v2.0</span></h1>
          </div>
        </div>
        <LanguageSelector language={i18n.language as any} onLanguageChange={(l) => i18n.changeLanguage(l)} />
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8 pb-24">
        {!report ? (
          <div className="grid md:grid-cols-[1fr_350px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-slate-900">{t('analyzer.title')}</h2>
                <p className="text-slate-500 text-lg">{t('analyzer.subtitle')}</p>
              </div>

              <Card className="border-2 border-slate-200 shadow-xl overflow-hidden bg-white">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                  <TabsList className="w-full grid grid-cols-4 h-14 bg-slate-100/50 p-1 rounded-none border-b">
                    <TabsTrigger value="text" className="gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Type className="w-4 h-4" /> {t('analyzer.hybrid.text')}
                    </TabsTrigger>
                    <TabsTrigger value="photo" className="gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Camera className="w-4 h-4" /> Photo
                    </TabsTrigger>
                    <TabsTrigger value="barcode" className="gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Barcode className="w-4 h-4" /> Scan
                    </TabsTrigger>
                    <TabsTrigger value="map" className="gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <MapPin className="w-4 h-4" /> Map
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-8">
                    <TabsContent value="text" className="mt-0 space-y-6">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ingredient List or Product Name</label>
                        <Input
                          placeholder={t('analyzer.placeholder')}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          className="h-14 text-lg border-2 border-slate-200 focus:border-primary/50 focus:ring-primary/20 transition-all bg-slate-50/30"
                          onKeyDown={(e) => e.key === 'Enter' && handleAnalysis('text')}
                        />
                      </div>
                      <Button 
                        onClick={() => handleAnalysis('text')} 
                        disabled={isLoading}
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 rounded-xl"
                      >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                        {t('analyzer.button')}
                      </Button>
                    </TabsContent>

                    <TabsContent value="photo" className="mt-0 text-center space-y-6 py-8">
                      <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-primary/30">
                        <Camera className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-slate-900">AI Vision Analysis</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">Upload a clear photo of the ingredients label.</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full h-14 border-2 border-primary/30 text-primary rounded-xl"
                      >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Camera className="w-5 h-5 mr-2" />}
                        Choose Photo
                      </Button>
                    </TabsContent>

                    <TabsContent value="barcode" className="mt-0 text-center space-y-6 py-8">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <ScanBarcode className="w-10 h-10 text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-slate-900">EAN/UPC Database</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">Scan product barcode to cross-reference.</p>
                      </div>
                      <Button 
                        onClick={startBarcodeScan}
                        disabled={isLoading}
                        className="w-full h-14 font-bold rounded-xl"
                      >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <ScanBarcode className="w-5 h-5 mr-2" />}
                        Start Scan
                      </Button>
                    </TabsContent>

                    <TabsContent value="map" className="mt-0 text-center space-y-6 py-8">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-emerald-200">
                        <MapPin className="w-10 h-10 text-emerald-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-slate-900">Regional Hazard Detection</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">Analyze local water, air, and soil pollutants.</p>
                      </div>
                      <Button 
                        onClick={handleGeolocationAnalysis}
                        disabled={isLoading}
                        className="w-full h-14 font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <MapPin className="w-5 h-5 mr-2" />}
                        Analyze Current Region
                      </Button>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>

              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm leading-relaxed shadow-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <p><strong>Note:</strong> All analyses are based on IARC Monographs Volumes 1–140 and WHO 2026 updates.</p>
              </div>
            </div>

            <div className="space-y-6">
              <RegionalHazardMap />
              <Card className="p-6 bg-slate-900 text-white border-none shadow-xl rounded-2xl">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                  Clinical Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                    <span className="text-white/60 uppercase">IARC Volumes</span>
                    <span className="font-mono">1–140</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                    <span className="text-white/60 uppercase">Scientific Dataset</span>
                    <span className="font-mono">2026</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <ResultsDisplay 
              results={report} 
              onNewAnalysis={() => {
                setReport(null)
                setImageData(null)
                setInput('')
              }} 
              language={i18n.language as any} 
            />
          </div>
        )}
      </main>
    </div>
  );
}
