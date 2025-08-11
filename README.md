# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Configuration

### Gemini API Key

To use the generative AI features of this application, you need a Gemini API key.

1.  **Get a Gemini API key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create your free API key.
2.  **Set the API key**: You have two options to use your key:
    *   **Environment Variable (Recommended)**: Add your API key to the `.env` file in the root of the project:
        ```
        GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```
    *   **On-page Input**: Alternatively, you can paste your API key directly into the "Google AI API Key" input field on the application's main page each time you run an analysis. Your key is not stored when using this method.
