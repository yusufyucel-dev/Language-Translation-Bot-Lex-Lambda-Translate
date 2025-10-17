const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

// AWS SDK v3 client'ları
const translateClient = new TranslateClient({});

// TargetLanguage Slot Tipindeki değerleri Amazon Translate kodlarına eşleştirir
const langCodeMap = {
    'english': 'en', 'ingilizce': 'en',
    'turkish': 'tr', 'türkçe': 'tr',
    'spanish': 'es', 'ispanyolca': 'es',
    'german': 'de', 'almanca': 'de'
};

exports.handler = async (event) => {
    const intent = event.sessionState.intent;
    const slots = intent.slots;
    
    // HATA AYIKLAMA LOGU (Artık çalışması gerekir)
    console.log("Lex Gelen Slotlar:", JSON.stringify(slots)); 
    
    const textToTranslate = slots.text ? slots.text.value.originalValue : null;
    const targetLanguageName = slots.language && slots.language.value.resolvedValues 
                                ? slots.language.value.resolvedValues[0] : null;

    const targetKey = targetLanguageName ? targetLanguageName.toLowerCase() : null;
    const targetLanguageCode = langCodeMap[targetKey];

    if (!textToTranslate || !targetLanguageCode) {
        // Eksik bilgi varsa (bu kısım daha önceki hataları çözmek için kritikti)
        return {
            sessionState: {
                dialogAction: { type: 'Close' },
                intent: { name: intent.name, state: 'Fulfilled' },
            },
            messages: [{ contentType: 'PlainText', content: `Sorry, I couldn't find a valid language code for "${targetLanguageName}".` }],
        };
    }

    try {
        // Amazon Translate'i (SDK v3) kullanarak çeviri yap
        const translateParams = {
            Text: textToTranslate,
            SourceLanguageCode: 'auto',
            TargetLanguageCode: targetLanguageCode,
        };

        const command = new TranslateTextCommand(translateParams);
        const response = await translateClient.send(command);

        // Lex'e başarılı yanıt gönder
        return {
            sessionState: {
                dialogAction: { type: 'Close' },
                intent: { name: intent.name, state: 'Fulfilled' },
            },
            messages: [{
                contentType: 'PlainText',
                content: `The translation of "${textToTranslate}" into ${targetLanguageName} is: "${response.TranslatedText}"`
            }],
        };

    } catch (error) {
        console.error("Translation Service Error (V3):", error);
        return {
            sessionState: {
                dialogAction: { type: 'Close' },
                intent: { name: intent.name, state: 'Fulfilled' },
            },
            messages: [{ contentType: 'PlainText', content: `Translation service error: ${error.message}` }],
        };
    }
};
