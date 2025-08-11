
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This global ai object is not used for requests that have a model and apiKey,
// but can be used for other Genkit functionality.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
