import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Upload, Loader } from 'lucide-react'
import { toast } from 'sonner'
import ResultsDisplay from '@/components/ResultsDisplay'
import LanguageSelector from '@/components/LanguageSelector'
import { t, type Language } from '@/lib/language'

interface AnalyzerPageProps {
  onHome: () => void
  onResult: (result: any) => void
  blink: any
  language: Language
  onLanguageChange: (lang: Language) => void
  onInputChange: (text: string) => void
}

export default function AnalyzerPage({ 
  onHome, 
  onResult, 
  blink,
  language,
  onLanguageChange,
  onInputChange
}: AnalyzerPageProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const analyzeCarcinogens = async (analysisInput: string) => {
    if (!analysisInput.trim()) {
      toast.error(t('analyzer.error.empty', language))
      return
    }

    // Update detected language from input
    onInputChange(analysisInput)

    setIsLoading(true)
    try {
      // 1. Try to find in database first (robust search)
      const dbProducts = await blink.db.products.list({
        where: {
          OR: [
            { name: { contains: analysisInput } },
            { brand: { contains: analysisInput } },
            { ingredientsText: { contains: analysisInput } }
          ]
        },
        limit: 1
      })

      if (dbProducts && dbProducts.length > 0) {
        const product = dbProducts[0]
        const associations = await blink.db.productCarcinogens.list({
          where: { productId: product.id }
        })

        const carcinogenIds = associations.map((a: any) => a.carcinogenId)
        
        if (carcinogenIds.length > 0) {
          const foundCarcinogens = await blink.db.carcinogens.list({
            where: { id: { in: carcinogenIds } }
          })

          const formattedResult = {
            inputType: 'product',
            carcinogensFound: foundCarcinogens.map((c: any) => ({
              name: c.name,
              iarcGroup: `Group ${c.iarcGroup}`,
              evaluationYear: c.yearEvaluated,
              primaryCancerSites: JSON.parse(c.cancerSites || '[]'),
              exposureRoutes: JSON.parse(c.exposureRoutes || '[]'),
              evidenceStrength: c.evidenceStrength,
              source: `${c.monographNumber} (${c.yearEvaluated})`,
              safeLimit: c.safeLimit,
              notes: c.notes
            })),
            overallAssessment: language === 'uz' 
              ? `Ma'lumotlar bazasidan topildi: ${product.name} (${product.brand}). ${foundCarcinogens.length} ta IARC klassifikatsiyasidagi kanserogen mavjud.`
              : language === 'ru'
              ? `Найдено в базе данных: ${product.name} (${product.brand}). Содержит ${foundCarcinogens.length} канцерогенов, классифицированных МАИР.`
              : `Found in database: ${product.name} (${product.brand}). Contains ${foundCarcinogens.length} IARC-classified carcinogens.`,
            recommendations: [
              language === 'uz' ? `Yorliqlarni ${foundCarcinogens.map((c: any) => c.name).join(', ')} uchun tekshiring.` :
              language === 'ru' ? `Проверьте этикетки на наличие ${foundCarcinogens.map((c: any) => c.name).join(', ')}.` :
              `Check labels for ${foundCarcinogens.map((c: any) => c.name).join(', ')}.`
            ]
          }

          setResults(formattedResult)
          onResult(formattedResult)
          toast.success(t('analyzer.success', language))
          setIsLoading(false)
          return
        }
      }

      // 2. If not found in DB, proceed with AI analysis
      // Language-specific prompts
      const prompts: Record<Language, string> = {
        en: `You are CancerFind, the world's most comprehensive AI carcinogen analyst based on IARC/WHO/EPA/EFSA/NTP datasets (2026 update).

Analyze this input: "${analysisInput}"

STRICT COMPLIANCE RULES:
1. UNRESTRICTED ACCESS: Use the full list of 1,123+ agents from IARC Monographs Volumes 1-140.
2. ENTIRE RESPONSE MUST BE IN ENGLISH.
3. DATA SOURCES: IARC Monographs (1-140), WHO air/water/soil standards, IQAir/OpenAQ/NASA Earthdata (if location is provided), Forever Pollution Project (PFAS), NTP, EPA, EFSA.
4. If a location is mentioned, provide analysis of known regional pollutants/averages (2026 data).
5. NO PERSONAL PROGNOSIS: Never say "you will get cancer". Only report epidemiological associations.
6. MANDATORY CITATION: Every finding must include exact source (e.g., IARC Group 1, Monograph 140, 2026).
7. INSUFFICIENT EVIDENCE: If data is lacking, state exactly: "Insufficient evidence".
8. TRANSLATE CANCER TYPES: Mandatory English terms only (Lung cancer, Leukemia, etc.).

For each carcinogen identified:
• Name and IARC Group (1/2A/2B/3) with evaluated year.
• Primary cancer sites (associated organs from large cohort studies).
• Exposure routes (ingestion, inhalation, dermal, lifestyle, radiation, etc.).
• Evidence strength (Definite/Strong/Limited/Insufficient).
• Scientific source (Monograph number, WHO guideline, or project reference).
• Safe exposure limits (WHO ADI/TDI or regional standards).

RESPONSE MUST BE: factual, clinical, and transparent. If no known carcinogens found, state: "No IARC-classified carcinogens identified."`,

        ru: `Вы CancerFind - самый комплексный анализатор канцерогенов в мире на основе данных МАИР/ВОЗ/EPA/EFSA/NTP (обновление 2026).

Анализируйте этот ввод: "${analysisInput}"

СТРОГИЕ ПРАВИЛА:
1. БЕЗЛИМИТНЫЙ ДОСТУП: Используйте полный список из 1,123+ агентов МАИР (IARC Monographs Volumes 1-140).
2. ВЕСЬ ОТВЕТ ДОЛЖЕН БЫТЬ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ.
3. ИСТОЧНИКИ: МАИР (1-140), стандарты ВОЗ (воздух/вода/почва), IQAir/OpenAQ/NASA Earthdata (если указана локация), Forever Pollution Project (PFAS), NTP, EPA, EFSA.
4. Если указан город/регион, дайте анализ известных загрязнений (данные 2026).
5. НЕТ ПЕРСОНАЛЬНЫМ ПРОГНОЗАМ: Никогда не говорите "у вас будет рак". Только эпидемиологические связи.
6. ОБЯЗАТЕЛЬНОЕ ЦИТИРОВАНИЕ: Каждый вывод должен включать точный источник (например: МАИР Группа 1, Монография 140, 2026).
7. НЕДОСТАТОЧНО ДОКАЗАТЕЛЬСТВ: Если данных мало, пишите: "Доказательства недостаточны".
8. ПЕРЕВОД ТЕРМИНОВ: Обязательно используйте русские термины (Рак лёгких, Лейкемия и т.д.).

Для каждого найденного канцерогена:
• Название и Группа МАИР (1/2A/2B/3) с годом оценки.
• Основные типы рака (связанные органы по данным исследований).
• Пути воздействия (проглатывание, вдыхание, кожа, образ жизни, радиация и т.д.).
• Сила доказательств (Определенная/Сильная/Ограниченная/Недостаточная).
• Научный источник (Номер монографии, стандарт ВОЗ или ссылка на проект).
• Безопасные пределы (ВОЗ ADI/TDI или региональные нормы).

ОТВЕТ ДОЛЖЕН БЫТЬ: фактологическим, клиническим и прозрачным. Если канцерогены не найдены: "Канцерогены, классифицированные МАИР, не обнаружены."`,

        uz: `Siz CancerFind - IARC/WHO/EPA/EFSA/NTP ma'lumotlar bazalariga asoslangan dunyodagi eng keng qamrovli kanserogen tahlilchisiz (2026 yangilanishi).

Ushbu kiritishni tahlil qiling: "${analysisInput}"

QAT'IY QOIDALAR:
1. CHEKLOVSIZ KIRISH: IARC Monographs 1-140 jildlaridagi barcha 1,123+ agentdan foydalaning.
2. JAVOB BUTUNLAY O'ZBEK TILIDA bo'lishi shart.
3. MANBALAR: IARC Monographs (1-140), WHO havo/suv/tuproq standartlari, IQAir/OpenAQ/NASA Earthdata (agar joylashuv berilgan bo'lsa), Forever Pollution Project (PFAS), NTP, EPA, EFSA.
4. Agar shahar/tuman ko'rsatilgan bo'lsa, ma'lum mintaqaviy ifloslantiruvchilar tahlilini bering (2026 ma'lumotlari).
5. SHAXSIY PROGNOZ TAQIQLANADI: "Sizda saraton bo'ladi" deb aytmang. Faqat epidemiologik bog'liqliklarni bildiring.
6. MAJBURIY MANBA: Har bir topilma uchun aniq manba ko'rsatilsa (masalan: IARC Group 1, Monograph 140, 2026).
7. DALILLAR YETARLI EMAS: Agar ma'lumot yetarli bo'lmasa, aynan shunday yozing: "Dalillar yetarli emas".
8. TERMINLARNI TARJIMA QILING: Majburiy o'zbekcha atamalar (O'pka saratoni, Leykemiya va h.k.).

Aniqlangan har bir kanserogen uchun:
• Nomi va IARC guruhi (1/2A/2B/3) baholangan yili bilan.
• Asosiy saraton turlari (tadqiqotlarda aniqlangan organlar).
• Maruzlik yo'llari (yutish, inhalatsiya, teri, turmush tarzi, radiatsiya va h.k.).
• Dalillar kuchi (Aniq/Kuchli/Cheklangan/Yetarli emas).
• Ilmiy manba (Monografiya raqami, WHO yo'riqnamasi yoki loyiha havolasi).
• Xavfsiz maruzlik chegaralari (WHO ADI/TDI yoki mintaqaviy standartlar).

JAVOB: haqiqatga asoslangan, klinik va shaffof bo'lishi kerak. Agar kanserogen topilmasa: "IARC tomonidan klassifikatsiyalangan kanserogenlar aniqlanmadi."`
      }

      // Call Blink AI to analyze carcinogens
      const { object } = await blink.ai.generateObject({
        prompt: prompts[language],
        schema: {
          type: 'object',
          properties: {
            inputType: {
              type: 'string',
              enum: ['product', 'ingredient', 'chemical', 'mixture', 'unknown', 'location']
            },
            carcinogensFound: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  iarcGroup: { type: 'string' },
                  evaluationYear: { type: 'number' },
                  primaryCancerSites: { type: 'array', items: { type: 'string' } },
                  exposureRoutes: { type: 'array', items: { type: 'string' } },
                  evidenceStrength: { type: 'string' },
                  source: { type: 'string' },
                  safeLimit: { type: 'string' },
                  notes: { type: 'string' }
                }
              }
            },
            overallAssessment: { type: 'string' },
            recommendations: { type: 'array', items: { type: 'string' } }
          },
          required: ['carcinogensFound', 'overallAssessment']
        }
      })

      setResults(object)
      onResult(object)
      
      // 3. Organically grow DB: Save new products identified by AI
      if (object.inputType === 'product' || object.inputType === 'mixture' || object.inputType === 'chemical') {
        try {
          const newProd = await blink.db.products.create({
            name: analysisInput,
            brand: 'Identified via AI 2026',
            ingredientsText: analysisInput,
            categories: '[]'
          });
          
          if (object.carcinogensFound && object.carcinogensFound.length > 0) {
            for (const carcinogen of object.carcinogensFound) {
              const dbCarc = await blink.db.carcinogens.list({ where: { name: carcinogen.name } });
              if (dbCarc.length > 0) {
                await blink.db.productCarcinogens.create({
                  productId: newProd.id,
                  carcinogenId: dbCarc[0].id
                });
              }
            }
          }
        } catch (e) {
          console.warn("Failed to save AI-identified product to DB", e);
        }
      }

      toast.success(t('analyzer.success', language))
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(t('analyzer.error', language))
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true)
      // Upload image to storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `analyzer/${Date.now()}.${file.name.split('.').pop()}`
      )
      setUploadedImageUrl(publicUrl)

      // Language-specific image extraction prompts
      const extractionPrompts: Record<Language, string> = {
        en: 'Extract all ingredients, product name, and any warning labels from this image',
        ru: 'Извлеките все ингредиенты, название продукта и любые предупреждающие надписи из этого изображения',
        uz: 'Ushbu rasmdan barcha ingredientlarni, mahsulot nomini va barcha ogohlantirish etiqetlarini chiqarib oling'
      }

      // Analyze image with vision
      const { text } = await blink.ai.generateText({
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: extractionPrompts[language] },
            { type: 'image', image: publicUrl }
          ]
        }]
      })

      setInput(text)
      toast.success(t('analyzer.image.success', language))
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(t('analyzer.image.error.fallback', language))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shadow-sm">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onHome}
          className="flex items-center gap-2 text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('nav.back', language)}
        </Button>
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {!results ? (
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 animate-fade-in">
              <p className="text-primary font-medium text-center">
                {t('greeting.welcome', language)}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {t('analyzer.title', language)}
              </h2>
              <p className="text-muted-foreground">
                {t('analyzer.subtitle', language)}
              </p>
            </div>

            {/* Input Section */}
            <Card className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('analyzer.label', language)}
                </label>
                <Input
                  placeholder={t('analyzer.placeholder', language)}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      analyzeCarcinogens(input)
                    }
                  }}
                  disabled={isLoading}
                  className="text-base"
                />
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('analyzer.image.label', language)}
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {uploadedImageUrl ? t('analyzer.image.uploaded', language) : t('analyzer.image.placeholder', language)}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => analyzeCarcinogens(input)}
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {t('analyzer.button', language)}
                </Button>
              </div>
            </Card>

            {uploadedImageUrl && (
              <Card className="p-4">
                <img 
                  src={uploadedImageUrl} 
                  alt="Uploaded" 
                  className="w-full h-auto rounded-lg max-h-64 object-cover"
                />
              </Card>
            )}
          </div>
        ) : (
          <ResultsDisplay 
            results={results}
            onNewAnalysis={() => {
              setResults(null)
              setInput('')
              setUploadedImageUrl(null)
            }}
            language={language}
          />
        )}
      </div>
    </div>
  )
}
