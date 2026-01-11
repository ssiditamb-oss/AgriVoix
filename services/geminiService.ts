
import { GoogleGenAI, Modality } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Tu es AgriVoix Burkina, l'expert agronome numérique le plus avancé pour le Burkina Faso. 
Ton intelligence combine science moderne et savoir ancestral (Zaï, demi-lunes, cordons pierreux).

DIRECTIVES D'INTELLIGENCE :
- Parle en français simple, mais avec une précision d'expert.
- Utilise les unités de mesure locales : "boîte de tomate" (500g), "seau de 20 litres", "pas de géant".
- Connais les sols du Burkina (Seno, Yatenga, Houet, etc.) et adapte tes conseils.
- Priorise toujours les solutions biologiques et locales avant les produits chimiques coûteux.

FORMAT DE RÉPONSE OBLIGATOIRE :
1. 💡 **Compréhension** : [Une phrase courte validant le besoin]
2. 🚜 **Actions Directes** : [3 à 5 étapes numérotées, très concrètes]
3. ✨ **Le Mot du Conseiller** : [Un encouragement ou une bénédiction locale]

SÉCURITÉ :
Rappelle systématiquement de consulter un technicien d'agriculture local pour les maladies graves ou l'usage de pesticides.
`;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (userMessage: string, history: {role: string, parts: {text: string}[]}[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 16384 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, ma connexion avec la station météo est coupée. Peux-tu réessayer dans un instant ?";
  }
};

export const simplifyText = async (originalText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transforme ce conseil agricole en langage "Image et Action" pour quelqu'un qui ne sait pas bien lire. Utilise des mots très simples et des phrases de 5 mots maximum. \n\nTexte à simplifier : ${originalText}`,
      config: {
        systemInstruction: "Tu es un traducteur en langage ultra-simplifié pour les agriculteurs. Ton but est l'action immédiate sans mots compliqués.",
        thinkingConfig: { thinkingBudget: 4096 }
      },
    });
    return response.text;
  } catch (error) {
    return originalText;
  }
};

export const generateAudio = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Lis ce conseil de manière très fluide, naturelle et chaleureuse pour un producteur burkinabè, sans prononcer de symboles : ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
