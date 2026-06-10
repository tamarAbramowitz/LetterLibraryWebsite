import { useCallback, useEffect, useState } from 'react';
import type { Letter } from '../types/letter';
import { categoryToImage } from '../utils/letterGenerator';

const STORAGE_KEY = 'letter-library-generated';
const ID_OFFSET = 10000;

function loadGenerated(): Letter[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useGeneratedLetters() {
  const [generated, setGenerated] = useState<Letter[]>(loadGenerated);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generated));
  }, [generated]);

  const saveLetter = useCallback((letter: Omit<Letter, 'id'> & { id?: number }) => {
    const newLetter: Letter = {
      ...letter,
      id: letter.id && letter.id > 0 ? letter.id : ID_OFFSET + Date.now(),
      image: letter.image || categoryToImage(letter.category),
    };
    setGenerated((prev) => [newLetter, ...prev.filter((l) => l.id !== newLetter.id)]);
    return newLetter;
  }, []);

  const getById = useCallback(
    (id: number) => generated.find((l) => l.id === id),
    [generated]
  );

  const getNextId = useCallback(() => {
    const stored = loadGenerated();
    const maxStored = stored.reduce((max, l) => Math.max(max, l.id), ID_OFFSET);
    return maxStored + 1;
  }, []);

  return { generated, saveLetter, getById, getNextId };
}
