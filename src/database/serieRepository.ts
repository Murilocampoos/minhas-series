import { getDatabase } from './database';
import { Serie, CreateSerieInput, UpdateSerieInput, SerieFilter } from '../types/serie';

export async function getSeries(filtro: SerieFilter = 'todas'): Promise<Serie[]> {
  const db = await getDatabase();
  
  if (filtro === 'assistindo') {
    return await db.getAllAsync<Serie>(
      'SELECT * FROM series WHERE concluida = 0 ORDER BY id DESC'
    );
  }
  
  if (filtro === 'concluidas') {
    return await db.getAllAsync<Serie>(
      'SELECT * FROM series WHERE concluida = 1 ORDER BY id DESC'
    );
  }
  
  return await db.getAllAsync<Serie>(
    'SELECT * FROM series ORDER BY id DESC'
  );
}

export async function getSerieById(id: number): Promise<Serie | null> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Serie>(
    'SELECT * FROM series WHERE id = ?',
    [id]
  );
  return result ?? null;
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
    'INSERT INTO series (titulo, plataforma, temporadas, nota, concluida, createdAt) VALUES (?, ?, ?, ?, 0, ?)',
    [input.titulo, input.plataforma, input.temporadas, input.nota, createdAt]
  );

  return {
    id: result.lastInsertRowId,
    titulo: input.titulo,
    plataforma: input.plataforma,
    temporadas: input.temporadas,
    nota: input.nota,
    concluida: 0,
    createdAt,
  };
}

export async function updateSerie(id: number, input: UpdateSerieInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, nota = ?, concluida = ? WHERE id = ?',
    [input.titulo, input.plataforma, input.temporadas, input.nota, input.concluida, id]
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET concluida = CASE WHEN concluida = 1 THEN 0 ELSE 1 END WHERE id = ?',
    [id]
  );
}

export async function deleteSerie(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM series WHERE id = ?', [id]);
}
