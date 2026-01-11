
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export enum Category {
  CULTURES = 'Cultures',
  ELEVAGE = 'Élevage',
  VENTE = 'Vente',
  STOCKAGE = 'Stockage',
  EAU = 'Gestion de l\'eau'
}
