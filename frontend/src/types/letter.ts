export interface Letter {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  content: string;
}

export interface LetterListResponse {
  letters: Letter[];
  total: number;
  page: number;
  page_size: number;
  categories: string[];
}
