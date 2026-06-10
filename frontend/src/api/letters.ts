import type { Letter, LetterListResponse } from '../types/letter';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface FetchLettersParams {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchLetters(params: FetchLettersParams = {}): Promise<LetterListResponse> {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('page_size', String(params.pageSize));

  const url = `${API_BASE}/letters${query.toString() ? `?${query}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch letters');
  }

  return response.json();
}

export async function fetchLetter(id: number): Promise<Letter> {
  const response = await fetch(`${API_BASE}/letters/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Letter not found');
    }
    throw new Error('Failed to fetch letter');
  }

  return response.json();
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/letters/categories`);

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}
