import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';
import { Serie, SerieFilter } from '../src/types/serie';

export default function Home() {
  const router = useRouter();
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  const carregarSeries = useCallback(async () => {
    const dados = await SerieRepository.getSeries(filtro);
    setSeries(dados);
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      carregarSeries();
    }, [carregarSeries])
  );

  function renderStars(nota: number | null): string {
    if (nota === null || nota <= 0) return 'Sem nota';
    return '⭐'.repeat(nota);
  }

  return (
    <View className="flex-1 bg-gray-900 p-4">
      {/* Botões de Filtro */}
      <View className="flex-row mb-4 gap-2">
        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-xl border border-indigo-500/30 items-center justify-center ${
            filtro === 'todas' ? 'bg-indigo-600' : 'bg-gray-800'
          }`}
          onPress={() => setFiltro('todas')}
        >
          <Text
            style={{ fontFamily: 'Roboto' }}
            className={`font-semibold text-sm ${
              filtro === 'todas' ? 'text-white font-bold' : 'text-gray-300'
            }`}
          >
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-xl border border-indigo-500/30 items-center justify-center ${
            filtro === 'assistindo' ? 'bg-indigo-600' : 'bg-gray-800'
          }`}
          onPress={() => setFiltro('assistindo')}
        >
          <Text
            style={{ fontFamily: 'Roboto' }}
            className={`font-semibold text-sm ${
              filtro === 'assistindo' ? 'text-white font-bold' : 'text-gray-300'
            }`}
          >
            Assistindo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-2.5 rounded-xl border border-indigo-500/30 items-center justify-center ${
            filtro === 'concluidas' ? 'bg-indigo-600' : 'bg-gray-800'
          }`}
          onPress={() => setFiltro('concluidas')}
        >
          <Text
            style={{ fontFamily: 'Roboto' }}
            className={`font-semibold text-sm ${
              filtro === 'concluidas' ? 'text-white font-bold' : 'text-gray-300'
            }`}
          >
            Concluídas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão + Nova Série */}
      <TouchableOpacity
        className="bg-indigo-600 p-3.5 rounded-xl mb-4 items-center justify-center shadow-md active:bg-indigo-700"
        onPress={() => router.push('/form')}
      >
        <Text style={{ fontFamily: 'Roboto' }} className="text-white font-bold text-base">
          + Nova série
        </Text>
      </TouchableOpacity>

      {/* Lista de Séries */}
      <FlatList
        data={series}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-gray-800 border border-gray-700 p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-lg"
            onPress={() => router.push({ pathname: '/detalhe', params: { id: String(item.id) } })}
          >
            <View className="flex-1 pr-3">
              <Text style={{ fontFamily: 'Roboto' }} className="text-white font-bold text-lg mb-1">
                {item.titulo}
              </Text>
              <Text style={{ fontFamily: 'Roboto' }} className="text-gray-400 text-xs mb-2">
                {item.plataforma} • {item.temporadas} temp{item.temporadas > 1 ? 's' : ''}
              </Text>
              <Text style={{ fontFamily: 'Roboto' }} className="text-amber-400 text-xs font-semibold">
                {renderStars(item.nota)}
              </Text>
            </View>

            <View className="items-end">
              <View
                className={`px-3 py-1.5 rounded-full ${
                  item.concluida === 1 ? 'bg-emerald-900/60 border border-emerald-500/40' : 'bg-amber-900/60 border border-amber-500/40'
                }`}
              >
                <Text
                  style={{ fontFamily: 'Roboto' }}
                  className={`text-xs font-bold ${
                    item.concluida === 1 ? 'text-emerald-400' : 'text-amber-300'
                  }`}
                >
                  {item.concluida === 1 ? 'Concluída' : 'Assistindo'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="py-12 items-center justify-center">
            <Text style={{ fontFamily: 'Roboto' }} className="text-gray-400 text-base text-center font-medium">
              Sua lista tá vazia. Adicione a primeira!
            </Text>
          </View>
        }
      />
    </View>
  );
}
