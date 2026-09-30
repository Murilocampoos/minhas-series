import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SerieRepository from '../src/database/serieRepository';
import { CreateSerieInput, UpdateSerieInput } from '../src/types/serie';

export default function FormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const serieId = params.id ? Number(params.id) : null;
  const isEditing = Boolean(serieId && !isNaN(serieId));

  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('');
  const [nota, setNota] = useState<number | null>(null);
  const [concluida, setConcluida] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && serieId) {
      SerieRepository.getSerieById(serieId).then((serie) => {
        if (serie) {
          setTitulo(serie.titulo);
          setPlataforma(serie.plataforma);
          setTemporadas(String(serie.temporadas));
          setNota(serie.nota);
          setConcluida(serie.concluida);
        }
      });
    }
  }, [isEditing, serieId]);

  function handleSelectNota(starValue: number) {
    if (nota === starValue) {
      setNota(null);
    } else {
      setNota(starValue);
    }
  }

  async function handleSalvar() {
    if (titulo.trim() === '') {
      Alert.alert('Eita!', 'Coloque o nome da série.');
      return;
    }

    if (plataforma.trim() === '') {
      Alert.alert('Opa!', 'Preencha a plataforma onde assiste.');
      return;
    }

    const numTemporadas = Number(temporadas);
    if (isNaN(numTemporadas) || numTemporadas < 0 || temporadas.trim() === '') {
      Alert.alert('Ops!', 'Coloque um número válido de temporadas (>= 0).');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && serieId) {
        const updateInput: UpdateSerieInput = {
          titulo: titulo.trim(),
          plataforma: plataforma.trim(),
          temporadas: numTemporadas,
          nota,
          concluida,
        };
        await SerieRepository.updateSerie(serieId, updateInput);
      } else {
        const createInput: CreateSerieInput = {
          titulo: titulo.trim(),
          plataforma: plataforma.trim(),
          temporadas: numTemporadas,
          nota,
        };
        await SerieRepository.createSerie(createInput);
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro!', 'Não deu pra salvar a série agora.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      <Text style={{ fontFamily: 'Roboto' }} className="text-white text-2xl font-bold mb-6">
        {isEditing ? 'Editar Série' : 'Nova Série'}
      </Text>

      {/* Campo Título */}
      <View className="mb-4">
        <Text style={{ fontFamily: 'Roboto' }} className="text-gray-300 font-semibold mb-2">
          Título *
        </Text>
        <TextInput
          style={{ fontFamily: 'Roboto' }}
          className="bg-gray-800 text-white border border-gray-700 rounded-xl p-3.5 text-base"
          placeholder="Nome da série"
          placeholderTextColor="#9CA3AF"
          value={titulo}
          onChangeText={setTitulo}
        />
      </View>

      {/* Campo Plataforma */}
      <View className="mb-4">
        <Text style={{ fontFamily: 'Roboto' }} className="text-gray-300 font-semibold mb-2">
          Plataforma *
        </Text>
        <TextInput
          style={{ fontFamily: 'Roboto' }}
          className="bg-gray-800 text-white border border-gray-700 rounded-xl p-3.5 text-base"
          placeholder="Plataforma"
          placeholderTextColor="#9CA3AF"
          value={plataforma}
          onChangeText={setPlataforma}
        />
      </View>

      {/* Campo Temporadas */}
      <View className="mb-4">
        <Text style={{ fontFamily: 'Roboto' }} className="text-gray-300 font-semibold mb-2">
          Temporadas *
        </Text>
        <TextInput
          style={{ fontFamily: 'Roboto' }}
          className="bg-gray-800 text-white border border-gray-700 rounded-xl p-3.5 text-base"
          placeholder="Nº de temporadas"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={temporadas}
          onChangeText={setTemporadas}
        />
      </View>

      {/* Seleção de Nota (5 Estrelas) */}
      <View className="mb-6">
        <Text style={{ fontFamily: 'Roboto' }} className="text-gray-300 font-semibold mb-2">
          Nota {nota !== null ? `(${nota} estrelas)` : '(Sem nota)'}
        </Text>
        <View className="flex-row justify-between bg-gray-800 border border-gray-700 p-3 rounded-xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              className={`p-2.5 rounded-lg border items-center justify-center flex-1 mx-1 ${
                nota !== null && star <= nota
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-gray-900 border-gray-700'
              }`}
              onPress={() => handleSelectNota(star)}
            >
              <Text className="text-lg">⭐</Text>
              <Text
                style={{ fontFamily: 'Roboto' }}
                className={`text-xs font-bold mt-1 ${
                  nota !== null && star <= nota ? 'text-amber-400' : 'text-gray-500'
                }`}
              >
                {star}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontFamily: 'Roboto' }} className="text-gray-500 text-xs mt-1">
          Toque na estrela selecionada para tirar a nota.
        </Text>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity
        className={`p-4 rounded-xl items-center justify-center mb-8 shadow-lg ${
          loading ? 'bg-indigo-900' : 'bg-indigo-600 active:bg-indigo-700'
        }`}
        onPress={handleSalvar}
        disabled={loading}
      >
        <Text style={{ fontFamily: 'Roboto' }} className="text-white font-bold text-lg">
          {loading ? 'Salvando...' : isEditing ? 'Atualizar Série' : 'Cadastrar Série'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
