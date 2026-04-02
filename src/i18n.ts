import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  uz: {
    translation: {
      greeting: {
        welcome: "CancerFind faol. Dunyodagi 1,123+ kanserogenni tahlil qilaman (IARC 2026). Nima tahlil qilamiz?"
      },
      nav: {
        back: "Ortga",
        title: "CancerFind",
        subtitle: "AI Kanserogen Tahlilchisi"
      },
      home: {
        hero: {
          title: "Sizning Saraton Xavfini Bilib Oling",
          description: "CancerFind 1,123+ modda, mahsulot va fizik omillarni IARC Monographs (Volumes 1–140) va WHO 2026 bazalari asosida tahlil qiladi.",
          button: "Tahlilni Boshlang"
        },
        stats: {
          carcinogens: "Kanserogenlar",
          updated: "Yangilangan"
        }
      },
      analyzer: {
        title: "Kanserogen Tahlili",
        subtitle: "Mahsulot, ingredient, kimyoviy modda yoki hududni kiriting.",
        button: "Tahlilni Boshlash",
        hybrid: {
          scan: "Shtrix-kodni skanerlash",
          photo: "Foto tahlil (AI Vision)",
          text: "Matnli tahlil"
        },
        placeholder: "Masalan: \"processed red meat\", \"PFAS in water\", \"air quality in London\", \"E171\"...",
        error: {
          empty: "Iltimos, tahlil uchun ma'lumot kiriting",
          imageFallback: "Rasm tahlili hozirda muammo bo'lyapti, ingredientlar ro'yxatini matn bilan yozing!"
        },
        risk: {
          safe: "Xavfsiz",
          caution: "Ehtiyot bo'ling",
          high: "Yuqori xavf"
        }
      },
      results: {
        assessment: "Umumiy Baholash",
        carcinogenFound: "Aniqlangan kanserogenlar",
        year: "Baholash yili",
        sites: "Asosiy saraton turlari",
        exposure: "Maruzlik yo'llari",
        strength: "Dalil kuchi",
        source: "Manba",
        limit: "Xavfsiz chegara",
        recommendations: "Tavsiyalar",
        newAnalysis: "Yangi Tahlil",
        disclaimer: "Bu hisobot IARC Monographs 1–140 jildlari bilan solishtirilgan klinik darajadagi AI yordamida yaratilgan. Bu faqat ta'lim va xavfni baholash uchun mo'ljallangan."
      },
      map: {
        title: "Mintaqaviy Xavf Xaritasi",
        description: "Hududingizdagi suv, havo va tuproqdagi kanserogenlarni tahlil qilish.",
        detect: "Joylashuvni aniqlash"
      },
      features: {
        input: {
          title: "Ma'lumot Kiritish",
          desc: "Mahsulot nomini, ingredientlar ro'yxatini, kimyoviy moddani yoki joylashuvni (suv/havo) kiriting."
        },
        detection: {
          title: "AI Aniqlash",
          desc: "Bizning AI 1,123+ ma'lum va gumonli kanserogenlarni eng so'nggi IARC 2026 klassifikatsiyasi bilan aniqlaydi."
        }
      }
    }
  },
  ru: {
    translation: {
      greeting: {
        welcome: "CancerFind активен. Анализирую более 1,123 канцерогенов мира (IARC 2026). Что сканируем?"
      },
      nav: {
        back: "Назад",
        title: "CancerFind",
        subtitle: "Анализатор канцерогенов с ИИ"
      },
      home: {
        hero: {
          title: "Узнайте ваш риск рака",
          description: "CancerFind анализирует более 1,123 веществ и факторов на основе IARC Monographs (Volumes 1–140) и баз ВОЗ 2026.",
          button: "Начать анализ"
        },
        stats: {
          carcinogens: "Канцерогенов",
          updated: "Обновлено"
        }
      },
      analyzer: {
        title: "Анализ канцерогенов",
        subtitle: "Введите продукт, ингредиент, химикат или локацию.",
        button: "Начать анализ",
        hybrid: {
          scan: "Сканировать штрих-код",
          photo: "Фото анализ (AI Vision)",
          text: "Текстовый анализ"
        },
        placeholder: "Например: \"обработанное красное мясо\", \"PFAS в воде\", \"качество воздуха в Москве\", \"E171\"...",
        error: {
          empty: "Пожалуйста, введите данные для анализа",
          imageFallback: "Проблема с анализом изображения, введите список ингредиентов текстом!"
        }
      },
      results: {
        assessment: "Общая оценка",
        carcinogenFound: "Выявленные канцерогены",
        year: "Год оценки",
        sites: "Основные типы рака",
        exposure: "Пути воздействия",
        strength: "Сила доказательств",
        source: "Источник",
        limit: "Безопасный предел",
        recommendations: "Рекомендации",
        newAnalysis: "Новый анализ",
        disclaimer: "Этот отчет создан с использованием ИИ клинического уровня, сопоставленного с томами IARC 1–140. Он предназначен только для образовательных целей и оценки рисков."
      },
      map: {
        title: "Карта региональных угроз",
        description: "Анализ канцерогенов в воде, воздухе и почве в вашем регионе.",
        detect: "Определить местоположение"
      },
      features: {
        input: {
          title: "Ввод данных",
          desc: "Введите название продукта, состав, химическое вещество или локацию (вода/воздух)."
        },
        detection: {
          title: "Обнаружение ИИ",
          desc: "Наш ИИ выявляет 1,123+ известных и вероятных канцерогенов по актуальной классификации IARC 2026."
        }
      },
      iarc: {
        group1: "Группа 1: Канцерогенно для человека",
        group2a: "Группа 2A: Вероятно канцерогенно",
        group2b: "Группа 2B: Возможно канцерогенно",
        group3: "Группа 3: Не классифицируется"
      }
    }
  },
  en: {
    translation: {
      greeting: {
        welcome: "CancerFind active. Analyzing over 1,123 carcinogens worldwide (IARC 2026). What to analyze?"
      },
      nav: {
        back: "Back",
        title: "CancerFind",
        subtitle: "AI Carcinogen Analyzer"
      },
      home: {
        hero: {
          title: "Know Your Cancer Risk",
          description: "CancerFind analyzes 1,123+ agents, products, and physical factors based on IARC Monographs (Volumes 1–140) and WHO 2026 databases.",
          button: "Start Analysis"
        },
        stats: {
          carcinogens: "Carcinogens",
          updated: "Updated"
        }
      },
      analyzer: {
        title: "Carcinogen Analysis",
        subtitle: "Enter product, ingredient, chemical, or location.",
        button: "Start Analysis",
        hybrid: {
          scan: "Scan Barcode",
          photo: "Photo Analysis (AI Vision)",
          text: "Text Analysis"
        },
        placeholder: "e.g., \"processed red meat\", \"PFAS in water\", \"air quality in London\", \"E171\"...",
        error: {
          empty: "Please enter data for analysis",
          imageFallback: "Image analysis issue, please type the ingredients list as text!"
        }
      },
      results: {
        assessment: "Overall Assessment",
        carcinogenFound: "Identified Carcinogens",
        year: "Evaluation Year",
        sites: "Primary cancer sites",
        exposure: "Exposure routes",
        strength: "Evidence strength",
        source: "Source",
        limit: "Safe limit",
        recommendations: "Recommendations",
        newAnalysis: "New Analysis",
        disclaimer: "This report is generated using clinical-grade AI cross-referenced with IARC Volumes 1–140. It is for educational purposes and risk assessment only."
      },
      map: {
        title: "Regional Hazard Map",
        description: "Analysis of carcinogens in water, air, and soil in your region.",
        detect: "Detect location"
      },
      features: {
        input: {
          title: "Data Input",
          desc: "Enter product names, ingredients, chemicals, or locations (water/air)."
        },
        detection: {
          title: "AI Detection",
          desc: "Our AI identifies 1,123+ known and suspected carcinogens with latest IARC 2026 classifications."
        }
      },
      iarc: {
        group1: "Group 1: Carcinogenic to humans",
        group2a: "Group 2A: Probably carcinogenic",
        group2b: "Group 2B: Possibly carcinogenic",
        group3: "Group 3: Not classifiable"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;