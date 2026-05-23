export interface Pet {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  createdAt: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest';
