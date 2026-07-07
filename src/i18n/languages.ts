/**
 * Language metadata for all 97 supported languages.
 * `rtl` flags right-to-left languages for dir attribute switching.
 * `nativeName` is the name of the language in itself (for the language switcher).
 */
export interface LanguageMeta {
  code: string;
  englishName: string;
  nativeName: string;
  rtl: boolean;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", englishName: "English", nativeName: "English", rtl: false },
  { code: "zh-CN", englishName: "Mandarin Chinese", nativeName: "简体中文", rtl: false },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", rtl: false },
  { code: "es", englishName: "Spanish", nativeName: "Español", rtl: false },
  { code: "fr", englishName: "French", nativeName: "Français", rtl: false },
  { code: "ar", englishName: "Arabic", nativeName: "العربية", rtl: true },
  { code: "bn", englishName: "Bengali", nativeName: "বাংলা", rtl: false },
  { code: "pt", englishName: "Portuguese", nativeName: "Português", rtl: false },
  { code: "ru", englishName: "Russian", nativeName: "Русский", rtl: false },
  { code: "ur", englishName: "Urdu", nativeName: "اردو", rtl: true },
  { code: "id", englishName: "Indonesian", nativeName: "Bahasa Indonesia", rtl: false },
  { code: "de", englishName: "German", nativeName: "Deutsch", rtl: false },
  { code: "ja", englishName: "Japanese", nativeName: "日本語", rtl: false },
  { code: "mr", englishName: "Marathi", nativeName: "मराठी", rtl: false },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", rtl: false },
  { code: "tr", englishName: "Turkish", nativeName: "Türkçe", rtl: false },
  { code: "ta", englishName: "Tamil", nativeName: "தமிழ்", rtl: false },
  { code: "vi", englishName: "Vietnamese", nativeName: "Tiếng Việt", rtl: false },
  { code: "yue", englishName: "Cantonese (Yue)", nativeName: "粵語", rtl: false },
  { code: "pa-PK", englishName: "Western Punjabi", nativeName: "پنجابی", rtl: true },
  { code: "ko", englishName: "Korean", nativeName: "한국어", rtl: false },
  { code: "fa", englishName: "Persian (Farsi)", nativeName: "فارسی", rtl: true },
  { code: "it", englishName: "Italian", nativeName: "Italiano", rtl: false },
  { code: "th", englishName: "Thai", nativeName: "ไทย", rtl: false },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", rtl: false },
  { code: "kn", englishName: "Kannada", nativeName: "ಕನ್ನಡ", rtl: false },
  { code: "ml", englishName: "Malayalam", nativeName: "മലയാളം", rtl: false },
  { code: "or", englishName: "Odia", nativeName: "ଓଡ଼ିଆ", rtl: false },
  { code: "pl", englishName: "Polish", nativeName: "Polski", rtl: false },
  { code: "uk", englishName: "Ukrainian", nativeName: "Українська", rtl: false },
  { code: "nl", englishName: "Dutch", nativeName: "Nederlands", rtl: false },
  { code: "ro", englishName: "Romanian", nativeName: "Română", rtl: false },
  { code: "el", englishName: "Greek", nativeName: "Ελληνικά", rtl: false },
  { code: "cs", englishName: "Czech", nativeName: "Čeština", rtl: false },
  { code: "hu", englishName: "Hungarian", nativeName: "Magyar", rtl: false },
  { code: "sv", englishName: "Swedish", nativeName: "Svenska", rtl: false },
  { code: "fi", englishName: "Finnish", nativeName: "Suomi", rtl: false },
  { code: "no", englishName: "Norwegian", nativeName: "Norsk", rtl: false },
  { code: "da", englishName: "Danish", nativeName: "Dansk", rtl: false },
  { code: "he", englishName: "Hebrew", nativeName: "עברית", rtl: true },
  { code: "sw", englishName: "Swahili", nativeName: "Kiswahili", rtl: false },
  { code: "am", englishName: "Amharic", nativeName: "አማርኛ", rtl: false },
  { code: "so", englishName: "Somali", nativeName: "Soomaali", rtl: false },
  { code: "ha", englishName: "Hausa", nativeName: "Hausa", rtl: false },
  { code: "yo", englishName: "Yoruba", nativeName: "Yorùbá", rtl: false },
  { code: "ig", englishName: "Igbo", nativeName: "Igbo", rtl: false },
  { code: "zu", englishName: "Zulu", nativeName: "isiZulu", rtl: false },
  { code: "xh", englishName: "Xhosa", nativeName: "isiXhosa", rtl: false },
  { code: "af", englishName: "Afrikaans", nativeName: "Afrikaans", rtl: false },
  { code: "ms", englishName: "Malay", nativeName: "Bahasa Melayu", rtl: false },
  { code: "my", englishName: "Burmese", nativeName: "မြန်မာ", rtl: false },
  { code: "km", englishName: "Khmer", nativeName: "ខ្មែរ", rtl: false },
  { code: "lo", englishName: "Lao", nativeName: "ລາວ", rtl: false },
  { code: "ne", englishName: "Nepali", nativeName: "नेपाली", rtl: false },
  { code: "si", englishName: "Sinhala", nativeName: "සිංහල", rtl: false },
  { code: "ps", englishName: "Pashto", nativeName: "پښتو", rtl: true },
  { code: "kk", englishName: "Kazakh", nativeName: "Қазақша", rtl: false },
  { code: "uz", englishName: "Uzbek", nativeName: "Oʻzbekcha", rtl: false },
  { code: "az", englishName: "Azerbaijani", nativeName: "Azərbaycanca", rtl: false },
  { code: "ka", englishName: "Georgian", nativeName: "ქართული", rtl: false },
  { code: "hy", englishName: "Armenian", nativeName: "Հայերեն", rtl: false },
  { code: "mn", englishName: "Mongolian", nativeName: "Монгол", rtl: false },
  { code: "bo", englishName: "Tibetan", nativeName: "བོད་སྐད", rtl: false },
  { code: "ug", englishName: "Uyghur", nativeName: "ئۇيغۇرچە", rtl: true },
  { code: "tl", englishName: "Tagalog", nativeName: "Tagalog", rtl: false },
  { code: "ceb", englishName: "Cebuano", nativeName: "Cebuano", rtl: false },
  { code: "ilo", englishName: "Ilocano", nativeName: "Ilokano", rtl: false },
  { code: "jv", englishName: "Javanese", nativeName: "Basa Jawa", rtl: false },
  { code: "su", englishName: "Sundanese", nativeName: "Basa Sunda", rtl: false },
  { code: "mad", englishName: "Madurese", nativeName: "Madhura", rtl: false },
  { code: "hmn", englishName: "Hmong", nativeName: "Hmoob", rtl: false },
  { code: "ku", englishName: "Kurdish", nativeName: "Kurdî", rtl: false },
  { code: "bal", englishName: "Balochi", nativeName: "بلوچی", rtl: true },
  { code: "tg", englishName: "Tajik", nativeName: "Тоҷикӣ", rtl: false },
  { code: "tk", englishName: "Turkmen", nativeName: "Türkmen", rtl: false },
  { code: "sq", englishName: "Albanian", nativeName: "Shqip", rtl: false },
  { code: "sr", englishName: "Serbian", nativeName: "Српски", rtl: false },
  { code: "hr", englishName: "Croatian", nativeName: "Hrvatski", rtl: false },
  { code: "bs", englishName: "Bosnian", nativeName: "Bosanski", rtl: false },
  { code: "sk", englishName: "Slovak", nativeName: "Slovenčina", rtl: false },
  { code: "sl", englishName: "Slovenian", nativeName: "Slovenščina", rtl: false },
  { code: "lt", englishName: "Lithuanian", nativeName: "Lietuvių", rtl: false },
  { code: "lv", englishName: "Latvian", nativeName: "Latviešu", rtl: false },
  { code: "et", englishName: "Estonian", nativeName: "Eesti", rtl: false },
  { code: "be", englishName: "Belarusian", nativeName: "Беларуская", rtl: false },
  { code: "bg", englishName: "Bulgarian", nativeName: "Български", rtl: false },
  { code: "mk", englishName: "Macedonian", nativeName: "Македонски", rtl: false },
  { code: "ca", englishName: "Catalan", nativeName: "Català", rtl: false },
  { code: "eu", englishName: "Basque", nativeName: "Euskara", rtl: false },
  { code: "gl", englishName: "Galician", nativeName: "Galego", rtl: false },
  { code: "cy", englishName: "Welsh", nativeName: "Cymraeg", rtl: false },
  { code: "ga", englishName: "Irish", nativeName: "Gaeilge", rtl: false },
  { code: "gd", englishName: "Scottish Gaelic", nativeName: "Gàidhlig", rtl: false },
  { code: "br", englishName: "Breton", nativeName: "Brezhoneg", rtl: false },
  { code: "is", englishName: "Icelandic", nativeName: "Íslenska", rtl: false },
  { code: "lb", englishName: "Luxembourgish", nativeName: "Lëtzebuergesch", rtl: false },
  { code: "mt", englishName: "Maltese", nativeName: "Malti", rtl: false },
];

export const RTL_LANGUAGES = LANGUAGES.filter(l => l.rtl).map(l => l.code);
export const LANGUAGE_CODES = LANGUAGES.map(l => l.code);

export function isRTL(code: string): boolean {
  return RTL_LANGUAGES.includes(code);
}

export function getLanguageMeta(code: string): LanguageMeta | undefined {
  return LANGUAGES.find(l => l.code === code);
}
