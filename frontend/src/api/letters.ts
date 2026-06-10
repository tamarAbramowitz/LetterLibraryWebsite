import type { Letter, LetterListResponse } from '../types/letter';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const USE_STATIC_DATA = import.meta.env.VITE_USE_STATIC_DATA === 'true';

export interface FetchLettersParams {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

const GENERATED_STORAGE_KEY = 'letter-library-generated';

let staticLettersCache: Letter[] | null = null;

function loadGeneratedFromStorage(): Letter[] {
  try {
    const stored = localStorage.getItem(GENERATED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function mergeLetters(base: Letter[], generated: Letter[]): Letter[] {
  const generatedIds = new Set(generated.map((l) => l.id));
  const filtered = base.filter((l) => !generatedIds.has(l.id));
  return [...generated, ...filtered].sort((a, b) => b.id - a.id);
}

export function invalidateLettersCache(): void {
  staticLettersCache = null;
}

async function loadStaticLetters(): Promise<Letter[]> {
  if (staticLettersCache) {
    return mergeLetters(staticLettersCache, loadGeneratedFromStorage());
  }

  const response = await fetch(`${import.meta.env.BASE_URL}letters.json`);
  if (!response.ok) throw new Error('Failed to load letters');
  const data: Letter[] = await response.json();
  staticLettersCache = data;
  return mergeLetters(data, loadGeneratedFromStorage());
}

function filterLetters(
  letters: Letter[],
  params: FetchLettersParams
): LetterListResponse {
  let filtered = [...letters];

  if (params.category) {
    filtered = filtered.filter(
      (l) => l.category.toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.content.toLowerCase().includes(query) ||
        l.category.toLowerCase().includes(query)
    );
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 12;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const categories = [...new Set(letters.map((l) => l.category))].sort();

  return {
    letters: filtered.slice(start, start + pageSize),
    total,
    page,
    page_size: pageSize,
    categories,
  };
}

export async function fetchLetters(params: FetchLettersParams = {}): Promise<LetterListResponse> {
  const generated = loadGeneratedFromStorage();

  if (USE_STATIC_DATA) {
    const letters = await loadStaticLetters();
    return filterLetters(letters, params);
  }

  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  query.set('page_size', '50');

  const url = `${API_BASE}/letters${query.toString() ? `?${query}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch letters');

  const data: LetterListResponse = await response.json();
  const combined = mergeLetters(data.letters, generated);
  return filterLetters(combined, params);
}

export async function fetchLetter(id: number): Promise<Letter> {
  const stored = loadGeneratedFromStorage().find((l) => l.id === id);
  if (stored) return stored;

  if (USE_STATIC_DATA) {
    const letters = await loadStaticLetters();
    const letter = letters.find((l) => l.id === id);
    if (!letter) throw new Error('Letter not found');
    return letter;
  }

  const response = await fetch(`${API_BASE}/letters/${id}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Letter not found');
    throw new Error('Failed to fetch letter');
  }
  return response.json();
}

export async function fetchCategories(): Promise<string[]> {
  const generated = loadGeneratedFromStorage();

  if (USE_STATIC_DATA) {
    const letters = await loadStaticLetters();
    return [...new Set([...letters, ...generated].map((l) => l.category))].sort();
  }

  const response = await fetch(`${API_BASE}/letters/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  const apiCategories: string[] = await response.json();
  const all = [...new Set([...apiCategories, ...generated.map((l) => l.category)])];
  return all.sort();
}
