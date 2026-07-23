// Language detection and i18n utilities
export type Language = 'uz' | 'ru' | 'en'

// Detect language from user input text
export function detectLanguage(text: string): Language {
  if (!text) return 'en'

  // Uzbek Cyrillic detection
  const uzbekCyrillic = /[\u0400-\u04FF]/g.test(text)
  
  // Russian Cyrillic detection
  const russianPatterns = /[\u0400-\u04FF]|ё|Ё/g.test(text)
  
  // Uzbek Latin detection
  const uzbekLatin = /[oʻ'ʼ]/g.test(text)
  const uzbekChars = /[шчғқўҳ]/gi.test(text)

  // Simple heuristic: check first alphabetic character or dominant script
  const cyrillic = text.match(/[\u0400-\u04FF]/g) || []
  const latin = text.match(/[a-zA-Z]/g) || []

  // Russian if has Cyrillic and >= 50% Cyrillic
  if (cyrillic.length > 0 && cyrillic.length >= latin.length * 0.5) {
    return 'ru'
  }

  // Uzbek if has Uzbek-specific characters
  if (uzbekChars) {
    return 'uz'
  }

  // Default to English
  return 'en'
}

// Translations for all UI strings
export const translations: Record<Language, Record<string, string>> = {
  uz: {
    // Greetings
    'greeting.welcome': 'CancerFind faol. Dunyodagi 1,123+ kanserogenni tahlil qilaman (IARC 2026). Nima tahlil qilamiz?',
    
    // Cancer Types
    'cancer.lung': 'Oʻpka saratoni',
    'cancer.leukemia': 'Leykemiya (qon saratoni)',
    'cancer.breast': 'Koʻkrak bezi saratoni',
    'cancer.liver': 'Jigar saratoni',
    'cancer.bladder': 'Siydik pufagi saratoni',
    'cancer.skin': 'Teri saratoni',
    'cancer.colorectal': 'Yoʻgʻon ichak saratoni',
    'cancer.stomach': 'Oshqozon saratoni',
    'cancer.pancreas': 'Oshqozon osti bezi saratoni',
    'cancer.prostate': 'Prostata saratoni',
    'cancer.mesothelioma': 'Mezotelioma',
    'cancer.ovarian': 'Tuxumdon saratoni',
    'cancer.laryngeal': 'Hiqildoq saratoni',
    'cancer.nasopharyngeal': 'Burun-halqum saratoni',
    'cancer.bone marrow': 'Suyak iligi saratoni',
    'cancer.non-Hodgkin lymphoma': 'Noxodjkin limfomasi',
    'cancer.thyroid': 'Qalqonsimon bez saratoni',
    'cancer.kidney': 'Buyrak saratoni',
    'cancer.esophagus': 'Qiziloʻngach saratoni',
    'cancer.pharynx': 'Halqum saratoni',
    'cancer.oral cavity': 'Ogʻiz boʻshligʻi saratoni',
    'cancer.multiple': 'Turli aʼzolar',
    
    // IARC Groups
    'iarc.group1': 'Guruh 1: Insonlar uchun kanserogen (aniq dalil)',
    'iarc.group2a': 'Guruh 2A: Insonlar uchun ehtimoliy kanserogen (kuchli dalil)',
    'iarc.group2b': 'Guruh 2B: Insonlar uchun boʻlishi mumkin boʻlgan kanserogen (cheklangan dalil)',
    'iarc.group3': 'Guruh 3: Kanserogen deb tasniflanmagan (yetarli boʻlmagan dalil)',
    'iarc.group4': 'Guruh 4: Ehtimol insonlar uchun kanserogen emas',
    
    // Risk Levels
    'risk.safe': 'Xavfsiz',
    'risk.caution': 'Ehtiyot boʻling',
    'risk.high': 'Yuqori xavf',
    
    // Scientific Risk Report
    'report.title': 'Ilmiy Xavf Hisoboti',
    'report.substances': 'Aniqlangan moddalar',
    'report.disease_link': 'Onkologik kasallik bogʻliqligi',
    'report.pathways': 'Maruzlik yoʻllari',
    'report.recommendations': 'Tavsiyalar',
    'report.citations': 'Ilmiy manbalar',
    
    // Regional Hazard Map
    'map.title': 'Mintaqaviy Xavf Xaritasi',
    'map.description': 'Hududingizdagi suv, havo va tuproqdagi kanserogenlarni tahlil qilish.',
    'map.location.detect': 'Joylashuvni aniqlash',
    'map.location.placeholder': 'Shahar yoki tuman nomini kiriting...',
    'map.pollutants': 'Mintaqaviy ifloslantiruvchilar',
    'map.water': 'Suv sifati',
    'map.air': 'Havo sifati',
    'map.soil': 'Tuproq holati',
    
    // Hybrid System
    'analyzer.hybrid.scan': 'Shtrix-kodni skanerlash',
    'analyzer.hybrid.photo': 'Foto tahlil (AI Vision)',
    'analyzer.hybrid.text': 'Matnli tahlil',
    'analyzer.placeholder': 'Masalan: "processed red meat", "PFAS in water", "Toshkent havo sifati", "E171"...',
    'analyzer.image.error.fallback': 'Rasm tahlili hozirda muammo boʻlyapti, ingredientlar roʻyxatini matn bilan yozing!',
    
    // Navigation
    'nav.back': 'Ortga',
    'nav.title': 'CancerFind',
    'nav.subtitle': 'AI Kanserogen Tahlilchisi',
    'nav.language': 'Til',
    
    // HomePage
    'home.hero.title': 'Sizning Saraton Xavfini Bilib Oling',
    'home.hero.description': 'CancerFind 1,123+ modda, mahsulot va fizik omillarni IARC Monographs (Volumes 1–140) va WHO 2026 bazalari asosida tahlil qiladi. Toʻliq va cheklovsiz tahlil.',
    'home.hero.button': 'Tahlilni Boshlang',
    'home.recent_products': 'Yaqinda tahlil qilingan mahsulotlar',
    
    'home.stats.carcinogens': 'Kanserogenlar',
    'home.stats.updated': 'Yangilangan',
    
    'home.features.title': 'Qanday Ishlaydi',
    'home.features.input': 'Maʼlumot Kiritish',
    'home.features.input.desc': 'Mahsulot nomini, ingredientlar roʻyxatini, kimyoviy moddani yoki joylashuvni (suv/havo) kiriting. Qadoq fotosini yuklang.',
    'home.features.detection': 'AI Aniqlash',
    'home.features.detection.desc': 'Bizning AI 1,123+ maʼlum va gumonli kanserogenlarni eng soʻnggi IARC 2026 klassifikatsiyasi bilan aniqlaydi.',
    'home.features.results': 'Ilmiy Natijalar',
    'home.features.results.desc': 'Ilmiy manbalar, maruzlik yoʻllari va WHO xavfsiz chegaralarini oling. Shaxsiy prognozsiz.',
    
    'home.powered': 'Rasmiy Ilm Tomonidan Tasdiqlangan',
    'home.sources.1': '✓ IARC Monographs Volumes 1–140 (2026)',
    'home.sources.2': '✓ WHO air/water/soil guidelines & standards',
    'home.sources.3': '✓ OpenAQ, IQAir, NASA Earthdata monitoring',
    'home.sources.4': '✓ PFAS/POPs: Forever Pollution Project, IPEN',
    'home.sources.5': '✓ EFSA, EPA, NTP contaminant databases',
    'home.sources.6': '✓ Global monitoring avg data (2026)',
    
    'home.footer': 'CancerFind faqat taʼlim maqsadida maʼlumot beradi. Tibbiy qarorlar uchun doim sogʻliqni saqlash mutaxassislariga murojaat qiling.',
    
    // AnalyzerPage
    'analyzer.title': 'Kanserogen Tahlili',
    'analyzer.subtitle': 'Mahsulot, ingredient, kimyoviy modda yoki hududni kiriting. IARC Monographs 1–140 boʻyicha tahlil.',
    'analyzer.label': 'Mahsulot, Ingredient yoki Kimyoviy Modda Nomi',
    'analyzer.image.label': 'Yoki Mahsulot Tasviri Yuklang',
    'analyzer.image.placeholder': 'Qadoq tasviri yuklash uchun bosing',
    'analyzer.image.uploaded': 'Tasvir yuklandi ✓',
    'analyzer.button': 'Tahlilni Boshlash',
    'analyzer.error.empty': 'Iltimos, tahlil uchun maʼlumot kiriting',
    'analyzer.success': 'Tahlil tugallandi',
    'analyzer.error': 'Tahlilda xato. Iltimos, qayta urinib koʻring.',
    'analyzer.image.success': 'Tasvir ishlandi. Tahlilga tayyor.',
    'analyzer.image.error': 'Tasvirni qayta ishlashda xato',
    
    // ResultsDisplay
    'results.title': 'Tahlil Natijalari',
    'results.noCarcinogens': 'Kanserogenlar topilmadi',
    'results.carcinogenFound': 'Aniqlangan kanserogenlar:',
    'results.iarc': 'IARC Guruhi',
    'results.year': 'Baholash yili',
    'results.sites': 'Asosiy saraton turlari',
    'results.exposure': 'Maruzlik yoʻllari',
    'results.strength': 'Dalil kuchi',
    'results.source': 'Manba',
    'results.limit': 'Xavfsiz chegara',
    'results.assessment': 'Umumiy Baholash',
    'results.recommendations': 'Tavsiyalar',
    'results.newAnalysis': 'Yangi Tahlil',
    'results.disclaimer': 'CancerFind faqat taʼlim maqsadida IARC/WHO klassifikatsiyalariga asoslangan maʼlumotlarni taqdim etadi. Ushbu tahlil tibbiy maslahat emas. Tibbiy qarorlar va xavotirlar uchun har doim sogʻliqni saqlash mutaxassislariga murojaat qiling.',
  },
  
  ru: {
    // Greetings
    'greeting.welcome': 'CancerFind активен. Анализирую более 1,123 канцерогенов мира (IARC 2026). Что сканируем?',
    
    // Cancer Types
    'cancer.lung': 'Рак лёгких',
    'cancer.leukemia': 'Лейкемия (рак крови)',
    'cancer.breast': 'Рак молочной железы',
    'cancer.liver': 'Рак печени',
    'cancer.bladder': 'Рак мочевого пузыря',
    'cancer.skin': 'Рак кожи',
    'cancer.colorectal': 'Колоректальный рак',
    'cancer.stomach': 'Рак желудка',
    'cancer.pancreas': 'Рак поджелудочной железы',
    'cancer.prostate': 'Рак простаты',
    'cancer.mesothelioma': 'Мезотелиома',
    'cancer.ovarian': 'Рак яичников',
    'cancer.laryngeal': 'Рак гортани',
    'cancer.nasopharyngeal': 'Рак носоглотки',
    'cancer.bone marrow': 'Рак костного мозга',
    'cancer.non-Hodgkin lymphoma': 'Неходжкинская лимфома',
    'cancer.thyroid': 'Рак щитовидной железы',
    'cancer.kidney': 'Рак почек',
    'cancer.esophagus': 'Рак пищевода',
    'cancer.pharynx': 'Рак глотки',
    'cancer.oral cavity': 'Рак полости рта',
    'cancer.multiple': 'Множественные органы',
    
    // IARC Groups
    'iarc.group1': 'Группа 1: Канцерогенно для человека (явные доказательства)',
    'iarc.group2a': 'Группа 2А: Вероятно канцерогенно для человека (сильные доказательства)',
    'iarc.group2b': 'Группа 2В: Возможно канцерогенно для человека (ограниченные доказательства)',
    'iarc.group3': 'Группа 3: Не классифицируется как канцероген (недостаточные доказательства)',
    'iarc.group4': 'Группа 4: Вероятно не канцерогенно для человека',
    
    // Risk Levels
    'risk.safe': 'Безопасно',
    'risk.caution': 'Осторожно',
    'risk.high': 'Высокий риск',
    
    // Scientific Risk Report
    'report.title': 'Научный отчет о рисках',
    'report.substances': 'Выявленные вещества',
    'report.disease_link': 'Связь с онкологическими заболеваниями',
    'report.pathways': 'Пути воздействия',
    'report.recommendations': 'Рекомендации',
    'report.citations': 'Научные источники',
    
    // Regional Hazard Map
    'map.title': 'Карта региональных угроз',
    'map.description': 'Анализ канцерогенов в воде, воздухе и почве в вашем регионе.',
    'map.location.detect': 'Определить местоположение',
    'map.location.placeholder': 'Введите город или район...',
    'map.pollutants': 'Региональные загрязнения',
    'map.water': 'Качество воды',
    'map.air': 'Качество воздуха',
    'map.soil': 'Состояние почвы',
    
    // Hybrid System
    'analyzer.hybrid.scan': 'Сканировать штрих-код',
    'analyzer.hybrid.photo': 'Фото анализ (AI Vision)',
    'analyzer.hybrid.text': 'Текстовый анализ',
    'analyzer.placeholder': 'Например: "processed red meat", "PFAS in water", "качество воздуха в Москве", "E171"...',
    'analyzer.image.error.fallback': 'Проблема с анализом изображения, введите список ингредиентов текстом!',
    
    // Navigation
    'nav.back': 'Назад',
    'nav.title': 'CancerFind',
    'nav.subtitle': 'Анализатор канцерогенов с ИИ',
    'nav.language': 'Язык',
    
    // HomePage
    'home.hero.title': 'Узнайте ваш риск рака',
    'home.hero.description': 'CancerFind анализирует более 1,123 веществ и факторов на основе IARC Monographs (Volumes 1–140) и баз ВОЗ 2026. Полный и безлимитный анализ.',
    'home.hero.button': 'Начать анализ',
    'home.recent_products': 'Недавно проанализированные продукты',
    
    'home.stats.carcinogens': 'Канцерогенов',
    'home.stats.updated': 'Обновлено',
    
    'home.features.title': 'Как это работает',
    'home.features.input': 'Ввод данных',
    'home.features.input.desc': 'Введите название продукта, состав, химическое вещество или локацию (вода/воздух). Загрузите фото упаковки.',
    'home.features.detection': 'Обнаружение ИИ',
    'home.features.detection.desc': 'Наш ИИ выявляет 1,123+ известных и вероятных канцерогенов по актуальной классификации IARC 2026.',
    'home.features.results': 'Научные результаты',
    'home.features.results.desc': 'Получите научные источники, пути воздействия и безопасные пределы ВОЗ. Без персональных прогнозов.',
    
    'home.powered': 'На основе официальной науки',
    'home.sources.1': '✓ IARC Monographs Volumes 1–140 (2026)',
    'home.sources.2': '✓ WHO air/water/soil guidelines & standards',
    'home.sources.3': '✓ Мониторинг OpenAQ, IQAir, NASA Earthdata',
    'home.sources.4': '✓ PFAS/POPs: Forever Pollution Project, IPEN',
    'home.sources.5': '✓ Базы данных EFSA, EPA, NTP',
    'home.sources.6': '✓ Global monitoring avg data (2026)',
    
    'home.footer': 'CancerFind предоставляет информацию только в образовательных целях. По медицинским вопросам всегда консультируйтесь со специалистами.',
    
    // AnalyzerPage
    'analyzer.title': 'Анализ канцерогенов',
    'analyzer.subtitle': 'Введите продукт, ингредиент, химикат или локацию. Анализ по IARC Monographs 1–140.',
    'analyzer.label': 'Название продукта, ингредиента или вещества',
    'analyzer.image.label': 'Или загрузите фото продукта',
    'analyzer.image.placeholder': 'Нажмите, чтобы загрузить фото упаковки',
    'analyzer.image.uploaded': 'Изображение загружено ✓',
    'analyzer.button': 'Начать анализ',
    'analyzer.error.empty': 'Пожалуйста, введите данные для анализа',
    'analyzer.success': 'Анализ завершен',
    'analyzer.error': 'Ошибка анализа. Пожалуйста, попробуйте снова.',
    'analyzer.image.success': 'Изображение обработано. Готово к анализу.',
    'analyzer.image.error': 'Ошибка при обработке изображения',
    
    // ResultsDisplay
    'results.title': 'Результаты анализа',
    'results.noCarcinogens': 'Канцерогены не обнаружены',
    'results.carcinogenFound': 'Выявленные канцерогены:',
    'results.iarc': 'Группа МАИР (IARC)',
    'results.year': 'Год оценки',
    'results.sites': 'Основные типы рака',
    'results.exposure': 'Пути воздействия',
    'results.strength': 'Сила доказательств',
    'results.source': 'Источник',
    'results.limit': 'Безопасный предел',
    'results.assessment': 'Общая оценка',
    'results.recommendations': 'Рекомендации',
    'results.newAnalysis': 'Новый анализ',
    'results.disclaimer': 'CancerFind предоставляет информацию на основе классификаций МАИР/ВОЗ только в образовательных целях. Данный анализ не является медицинской консультацией. Всегда консультируйтесь с медицинскими специалистами по поводу медицинских решений и проблем.',
  },
  
  en: {
    // Greetings
    'greeting.welcome': 'CancerFind active. Analyzing over 1,123 carcinogens worldwide (IARC 2026). What to analyze?',
    
    // Cancer Types
    'cancer.lung': 'Lung cancer',
    'cancer.leukemia': 'Leukemia',
    'cancer.breast': 'Breast cancer',
    'cancer.liver': 'Liver cancer',
    'cancer.bladder': 'Bladder cancer',
    'cancer.skin': 'Skin cancer',
    'cancer.colorectal': 'Colorectal cancer',
    'cancer.stomach': 'Stomach cancer',
    'cancer.pancreas': 'Pancreatic cancer',
    'cancer.prostate': 'Prostate cancer',
    'cancer.mesothelioma': 'Mesothelioma',
    'cancer.ovarian': 'Ovarian cancer',
    'cancer.laryngeal': 'Laryngeal cancer',
    'cancer.nasopharyngeal': 'Nasopharyngeal cancer',
    'cancer.bone marrow': 'Bone marrow cancer',
    'cancer.non-Hodgkin lymphoma': 'Non-Hodgkin lymphoma',
    'cancer.thyroid': 'Thyroid cancer',
    'cancer.kidney': 'Kidney cancer',
    'cancer.esophagus': 'Esophageal cancer',
    'cancer.pharynx': 'Pharyngeal cancer',
    'cancer.oral cavity': 'Oral cavity cancer',
    'cancer.multiple': 'Multiple sites',
    
    // IARC Groups
    'iarc.group1': 'Group 1: Carcinogenic to humans (definite evidence)',
    'iarc.group2a': 'Group 2A: Probably carcinogenic to humans (strong evidence)',
    'iarc.group2b': 'Group 2B: Possibly carcinogenic to humans (limited evidence)',
    'iarc.group3': 'Group 3: Not classifiable as carcinogenic (insufficient evidence)',
    'iarc.group4': 'Group 4: Probably not carcinogenic to humans',
    
    // Risk Levels
    'risk.safe': 'Safe',
    'risk.caution': 'Caution',
    'risk.high': 'High Risk',
    
    // Scientific Risk Report
    'report.title': 'Scientific Risk Report',
    'report.substances': 'Identified substances',
    'report.disease_link': 'Oncological disease linkage',
    'report.pathways': 'Exposure pathways',
    'report.recommendations': 'Recommendations',
    'report.citations': 'Scientific citations',
    
    // Regional Hazard Map
    'map.title': 'Regional Hazard Map',
    'map.description': 'Analysis of carcinogens in water, air, and soil in your region.',
    'map.location.detect': 'Detect location',
    'map.location.placeholder': 'Enter city or district...',
    'map.pollutants': 'Regional Pollutants',
    'map.water': 'Water Quality',
    'map.air': 'Air Quality',
    'map.soil': 'Soil Condition',
    
    // Hybrid System
    'analyzer.hybrid.scan': 'Scan Barcode',
    'analyzer.hybrid.photo': 'Photo Analysis (AI Vision)',
    'analyzer.hybrid.text': 'Text Analysis',
    'analyzer.placeholder': 'e.g., "processed red meat", "PFAS in water", "air quality in London", "E171"...',
    'analyzer.image.error.fallback': 'Image analysis issue, please type the ingredients list as text!',
    
    // Navigation
    'nav.back': 'Back',
    'nav.title': 'CancerFind',
    'nav.subtitle': 'AI Carcinogen Analyzer',
    'nav.language': 'Language',
    
    // HomePage
    'home.hero.title': 'Know Your Cancer Risk',
    'home.hero.description': 'CancerFind analyzes 1,123+ agents, products, and physical factors based on IARC Monographs (Volumes 1–140) and WHO 2026 databases. Comprehensive and unrestricted.',
    'home.hero.button': 'Start Analysis',
    'home.recent_products': 'Recently Analyzed Products',
    
    'home.stats.carcinogens': 'Carcinogens',
    'home.stats.updated': 'Updated',
    
    'home.features.title': 'How It Works',
    'home.features.input': 'Data Input',
    'home.features.input.desc': 'Enter product names, ingredients, chemicals, or locations (water/air). Upload photos of packaging.',
    'home.features.detection': 'AI Detection',
    'home.features.detection.desc': 'Our AI identifies 1,123+ known and suspected carcinogens with latest IARC 2026 classifications.',
    'home.features.results': 'Scientific Results',
    'home.features.results.desc': 'Get scientific citations, exposure routes, and WHO safe limits. No personal prognosis.',
    
    'home.powered': 'Powered by Official Science',
    'home.sources.1': '✓ IARC Monographs Volumes 1–140 (2026)',
    'home.sources.2': '✓ WHO air/water/soil guidelines & standards',
    'home.sources.3': '✓ OpenAQ, IQAir, NASA Earthdata monitoring',
    'home.sources.4': '✓ PFAS/POPs: Forever Pollution Project, IPEN',
    'home.sources.5': '✓ EFSA, EPA, NTP contaminant databases',
    'home.sources.6': '✓ Global monitoring avg data (2026)',
    
    'home.footer': 'CancerFind provides information for educational purposes only. Always consult healthcare professionals for medical decisions.',
    
    // AnalyzerPage
    'analyzer.title': 'Carcinogen Analysis',
    'analyzer.subtitle': 'Enter product, ingredient, chemical, or location. Analysis per IARC Monographs 1–140.',
    'analyzer.label': 'Product, Ingredient, or Chemical Name',
    'analyzer.image.label': 'Or Upload Product Image',
    'analyzer.image.placeholder': 'Click to upload label image',
    'analyzer.image.uploaded': 'Image uploaded ✓',
    'analyzer.button': 'Start Analysis',
    'analyzer.error.empty': 'Please enter data for analysis',
    'analyzer.success': 'Analysis complete',
    'analyzer.error': 'Analysis failed. Please try again.',
    'analyzer.image.success': 'Image processed. Ready to analyze.',
    'analyzer.image.error': 'Failed to process image',
    
    // ResultsDisplay
    'results.title': 'Analysis Results',
    'results.noCarcinogens': 'No carcinogens found',
    'results.carcinogenFound': 'Identified Carcinogens:',
    'results.iarc': 'IARC Group',
    'results.year': 'Evaluation Year',
    'results.sites': 'Primary cancer sites',
    'results.exposure': 'Exposure routes',
    'results.strength': 'Evidence strength',
    'results.source': 'Source',
    'results.limit': 'Safe limit',
    'results.assessment': 'Overall Assessment',
    'results.recommendations': 'Recommendations',
    'results.newAnalysis': 'New Analysis',
    'results.disclaimer': 'CancerFind provides information based on IARC/WHO classifications for educational purposes only. This analysis is not medical advice. Always consult healthcare professionals for medical decisions and concerns.',
  }
}

// Get translation string
export function t(key: string, language: string): string {
  // Normalize: try exact match first, then base language, then fallback to 'en'
  const lang = language as Language;
  const base = (language?.split('-')[0] || 'en') as Language;
  return translations[lang]?.[key] || translations[base]?.[key] || translations['en']?.[key] || key
}