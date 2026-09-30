export interface Serie {
  id: number;
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
  concluida: number; // 0 ou 1 - SQLite não possui tipo booleano
  createdAt: string;
}

export interface CreateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
}

export interface UpdateSerieInput {
  titulo: string;
  plataforma: string;
  temporadas: number;
  nota: number | null;
  concluida: number;
}

export type SerieFilter = 'todas' | 'assistindo' | 'concluidas';
