# Agent Instructions - User Scripts and Chrome Extensions

## Git Workflow

- Always commit your changes when you have completed a task or reached a logical stopping point
- Use clear, descriptive commit messages that explain what was done and why
- After committing, always pull with rebase (`git pull --rebase`) and push to the remote
- Ensure the working directory is clean (all changes committed and pushed) before ending your session

## Project Structure

- **Userscripts**: All userscripts must be placed in the `userscripts/` directory
- **Extensions**: All Chrome extensions must be placed in the `extensions/` directory

## Userscripts

When creating userscripts (also known as monkeyscripts, Greasemonkey scripts, Tampermonkey scripts, etc.):

### Metadata Block

- **Namespace**: Always use `https://elite-ai-assisted-coding.dev/`
- **Version**: Always start with `0.0.1`
  - Increment the revision (third number) with every change to the file
  - Only increment minor (second number) or major (first number) if the user explicitly requests it

### Code Style

- Always include explanatory comments throughout the JavaScript code
- Comments should explain what each part of the code does
- The script should be easily readable at a glance so the user can quickly understand how it works

### Permissions

- Request the minimum set of `@grant` permissions required for the script to function
- Never omit a permission that is actually required
- If no special permissions are needed, use `@grant none`

## Chrome Extensions

When creating Chrome extensions:

### Setup

- Create a new directory inside `extensions/` for the extension
- Ensure the extension is ready for unpacked installation (developer mode)

### Assets

- **Icons**: Always use PNG format for icons. SVG format is not supported for extension icons in the manifest.
- Provide appropriate icon sizes (e.g., 16, 48, 128)

## Chrome Built-in AI APIs

Some userscripts may use Chrome's built-in AI APIs powered by Gemini Nano. These run client-side without server calls.

### Available APIs

#### Prompt API
General-purpose prompting with Gemini Nano. Supports text, audio, and image inputs.

```javascript
// Check availability
const availability = await LanguageModel.availability();

// Create a session
const session = await LanguageModel.create({
  initialPrompts: [
    { role: 'system', content: 'You are a helpful assistant.' }
  ]
});

// Send a prompt
const result = await session.prompt('Explain this code briefly.');

// Streaming response
const stream = session.promptStreaming('Write a poem.');
for await (const chunk of stream) {
  console.log(chunk);
}
```

- **Docs**: https://developer.chrome.com/docs/ai/prompt-api

#### Summarizer API
Condenses long text into summaries.

```javascript
const summarizer = await Summarizer.create({
  type: 'key-points',    // 'tldr', 'teaser', 'headline', 'key-points'
  format: 'markdown',    // 'markdown', 'plain-text'
  length: 'medium'       // 'short', 'medium', 'long'
});

const summary = await summarizer.summarize(longArticleText);
```

- **Docs**: https://developer.chrome.com/docs/ai/summarizer-api

#### Writer API
Creates new content from prompts.

```javascript
const writer = await Writer.create({
  tone: 'formal',       // 'formal', 'neutral', 'casual'
  format: 'plain-text',
  length: 'medium'
});

const draft = await writer.write('Write an introduction for a portfolio site.');
```

- **Docs**: https://developer.chrome.com/docs/ai/writer-api

#### Rewriter API
Revises existing text (change tone, length, or format).

```javascript
const rewriter = await Rewriter.create({
  tone: 'more-formal',  // 'as-is', 'more-formal', 'more-casual'
  length: 'shorter'     // 'as-is', 'shorter', 'longer'
});

const revised = await rewriter.rewrite(originalText);
```

- **Docs**: https://developer.chrome.com/docs/ai/rewriter-api

#### Translator API
Translates text between languages client-side.

```javascript
const translator = await Translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'es'
});

const translated = await translator.translate('Hello, how are you?');
// "Hola, ¿cómo estás?"
```

- **Docs**: https://developer.chrome.com/docs/ai/translator-api

#### Language Detector API
Identifies the language of input text.

```javascript
const detector = await LanguageDetector.create();
const results = await detector.detect('Bonjour le monde');

// results[0].detectedLanguage = 'fr'
// results[0].confidence = 0.95
```

- **Docs**: https://developer.chrome.com/docs/ai/language-detection

#### Proofreader API
Fixes grammar, spelling, and punctuation with explanations.

```javascript
const proofreader = await Proofreader.create({
  expectedInputLanguages: ['en']
});

const result = await proofreader.proofread('I seen him yesterday.');
// result.correctedInput = 'I saw him yesterday.'
// result.corrections = [{ ... error details ... }]
```

- **Docs**: https://developer.chrome.com/docs/ai/proofreader-api

### Localhost Testing

Enable these Chrome flags for local development:
- `chrome://flags/#optimization-guide-on-device-model`
- `chrome://flags/#prompt-api-for-gemini-nano`
- `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input`

### Documentation Links

- **Overview**: https://developer.chrome.com/docs/ai
- **Getting Started**: https://developer.chrome.com/docs/ai/get-started
- **Built-in APIs**: https://developer.chrome.com/docs/ai/built-in-apis
- **Extensions Integration**: https://developer.chrome.com/docs/extensions/ai
- **Session Management**: https://developer.chrome.com/docs/ai/session-management
- **Streaming Responses**: https://developer.chrome.com/docs/ai/streaming
- **Debugging**: https://developer.chrome.com/docs/ai/debug-gemini-nano
- **TypeScript Types**: `npm install @types/dom-chromium-ai`
