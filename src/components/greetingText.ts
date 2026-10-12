// Type style for the intro's greetings: on phones it grows with the screen (the widest greeting stays well inside
// even a 320px one), and on phones turned sideways it's scaled down to leave room for the coffee order below
export const GREETING_TEXT =
    "whitespace-nowrap text-[clamp(2.5rem,min(13vw,7.5svh),4.5rem)] font-extrabold tracking-tight text-black sm:text-7xl lg:text-8xl short:text-[clamp(2.25rem,9svh,3.25rem)]";

// "Hello" in the languages around me, shared by the intro (which ends on English) and the Contact headline
export const GREETINGS = [
    { text: "你好", lang: "zh" },
    { text: "こんにちは", lang: "ja" },
    { text: "Hola", lang: "es" },
    { text: "Hallo", lang: "de" },
    { text: "നമസ്കാരം", lang: "ml" },
    { text: "Olá", lang: "pt" },
    { text: "Привет", lang: "ru" },
    { text: "नमस्ते", lang: "hi" },
    { text: "안녕하세요", lang: "ko" },
    { text: "Hello", lang: "en" },
];
