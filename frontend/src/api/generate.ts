import type { GenerateLetterRequest, GenerateLetterResponse } from '../types/generate';
import type { Letter } from '../types/letter';
import { categoryToImage, generateLetterContent } from '../utils/letterGenerator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const USE_STATIC_DATA = import.meta.env.VITE_USE_STATIC_DATA === 'true';

async function generateLocally(request: GenerateLetterRequest): Promise<GenerateLetterResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const content = generateLetterContent(request);
  const letter: Letter = {
    id: 0,
    title: request.title,
    category: request.category,
    description: request.description,
    image: categoryToImage(request.category),
    content,
  };
  return { letter, saved: false };
}

export async function generateLetter(
  request: GenerateLetterRequest
): Promise<GenerateLetterResponse> {
  if (USE_STATIC_DATA) {
    return generateLocally(request);
  }

  try {
    const response = await fetch(`${API_BASE}/generate-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status === 404) {
      console.warn('Generate API not found — using local generation. Restart the backend with .\\start.ps1');
      return generateLocally(request);
    }

    const error = await response.json().catch(() => ({}));
    throw new Error(
      typeof error.detail === 'string' ? error.detail : 'Failed to generate letter'
    );
  } catch (err) {
    if (err instanceof TypeError) {
      console.warn('Backend unreachable — using local generation');
      return generateLocally(request);
    }
    throw err;
  }
}
