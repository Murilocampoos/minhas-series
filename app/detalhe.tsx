import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';
import { Serie } from '../src/types/serie';

export default function DetalheScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const serieId = params.id ? Number(params.id) : null;

  const [serie, setSerie] = useState<Serie | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarSerie = useCallback(async () => {
    if (!serieId || isNaN(serieId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const dados = await SerieRepository.getSerieById(serieId);
    setSerie(dados);
    setLoading(false);
  }, [serieId]);

  useFocusEffect(
    useCallback(() => {
      carregarSerie();
    }, [carregarSerie])
  );

  async function handleToggleConcluida() {
    if (!serie) return;
    await SerieRepository.toggleSerieConcluida(serie.id);
    await carregarSerie();
  }

  function handleEditar() {
    if (!serie) return;
    router.push({ pathname: '/form', params: { id: String(serie.id) } });
  }

  function handleExcluir() {
    if (!serie) return;

    Alert.alert('Apagar série?', 'Essa ação não tem volta.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await SerieRepository.deleteSerie(serie.id);
          router.back();
        },
      },
    ]);
  }

  function renderStars(nota: number | null): string {
    if (nota === null || nota <= 0) return 'Sem avaliação';
    return '⭐'.repeat(nota);
  }

  function formatData(isoString: string): string {
    try {
      const data = new Date(isoString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Text style={{ fontFamily: 'Roboto' }} className="text-white text-base">
          Buscando detalhes...
        </Text>
      </View>
    );
  }

  if (!serie) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center p-4">
        <Text style={{ fontFamily: 'Roboto' }} className="text-gray-300 text-lg mb-4 text-center">
          Série não encontrada.
        </Text>
        <TouchableOpacity
          className="bg-indigo-600 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text style={{ fontFamily: 'Roboto' }} className="text-white font-bold">
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      {/* Card de Detalhes */}
      <View className="bg-gray-800 border border-gray-700 p-6 rounded-2xl mb-6 shadow-xl">
        <View className="flex-row justify-between items-start mb-4">
          <Text style={{ fontFamily: 'Roboto' }} className="text-white text-2xl font-bold flex-1 pr-2">
            {serie.titulo}
          </Text>
          <View
            className={`px-3 py-1.5 rounded-full ${
              serie.concluida === 1
                ? 'bg-emerald-900/60 border border-emerald-500/40'
                : 'bg-amber-900/60 border border-amber-500/40'
            }`}
          >
            <Text
              style={{ fontFamily: 'Roboto' }}
              className={`text-xs font-bold ${
                serie.concluida === 1 ? 'text-emerald-400' : 'text-amber-300'
              }`}
            >
              {serie.concluida === 1 ? 'Concluída' : 'Assistindo'}
            </Text>
          </View>
        </View>

        <View className="space-y-3 border-t border-gray-700/60 pt-4">
          <View className="flex-row justify-between py-1">
            <Text style={{ fontFamily: 'Roboto' }} className="text-gray-400 font-semibold">
              Plataforma:
            </Text>
            <Text style={{ fontFamily: 'Roboto' }} className="text-white font-medium">
              {serie.plataforma}
            </Text>
          </View>

          <View className="flex-row justify-between py-1">
            <Text style={{ fontFamily: 'Roboto' }} className="text-gray-400 font-semibold">
              Temporadas:
            </Text>
            <Text style={{ fontFamily: 'Roboto' }} className="text-white font-medium">
              {serie.temporadas}
            </Text>
          </View>

          <View className="flex-row justify-between py-1">
            <Text style={{ fontFamily: 'Roboto' }} className="text-gray-400 font-semibold">
              Nota:
            </Text>
            <Text style={{ fontFamily: 'Roboto' }} className="text-amber-400 font-medium">
              {renderStars(serie.nota)}
            </Text>
          </View>

          <View className="flex-row justify-between py-1">
            <Text style={{ fontFamily: 'Roboto' }} className="text-gray-400 font-semibold">
              Cadastrada em:
            </Text>
            <Text style={{ fontFamily: 'Roboto' }} className="text-gray-300 font-medium">
              {formatData(serie.createdAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      <View className="gap-3 mb-8">
        <TouchableOpacity
          className={`p-4 rounded-xl items-center justify-center border ${
            serie.concluida === 1
              ? 'bg-amber-900/40 border-amber-500/50'
              : 'bg-emerald-900/40 border-emerald-500/50'
          }`}
          onPress={handleToggleConcluida}
        >
          <Text
            style={{ fontFamily: 'Roboto' }}
            className={`font-bold text-base ${
              serie.concluida === 1 ? 'text-amber-300' : 'text-emerald-400'
            }`}
          >
            {serie.concluida === 1 ? 'Marcar como Assistindo' : 'Marcar como Concluída'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-indigo-600 border border-indigo-500/50 p-4 rounded-xl items-center justify-center active:bg-indigo-700"
          onPress={handleEditar}
        >
          <Text style={{ fontFamily: 'Roboto' }} className="text-white font-bold text-base">
            Editar Série
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-rose-900/40 border border-rose-500/50 p-4 rounded-xl items-center justify-center active:bg-rose-900/60"
          onPress={handleExcluir}
        >
          <Text style={{ fontFamily: 'Roboto' }} className="text-rose-400 font-bold text-base">
            Excluir Série
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
