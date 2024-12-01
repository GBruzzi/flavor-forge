import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const decodeToken = (token: string): any => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

const DashboardScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [decoded, setDecoded] = useState<any | null>(null);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTime: 0,
    difficulty: 'Fácil',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserIdAndRecipes = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
  
        if (token) {
          const decoded = decodeToken(token);
          console.log('ID do usuário:', decoded.sub);
  
          setDecoded(decoded);
  
          await fetchRecipes(decoded.sub, token);
        } else {
          router.replace('/Login');
        }
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
        setError('Erro ao autenticar. Faça login novamente.');
        setTimeout(() => router.replace('/Login'), 3000);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserIdAndRecipes();
  }, []);

  const fetchRecipes = async (userId: number, token: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/myRecipes/${userId}?page=1&limit=5&filter=`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Receitas:', data);
        setRecipes(data.recipes);
      } else if (response.status === 401) {
        setError('Não autorizado. Faça login novamente.');
        await AsyncStorage.clear();
        setTimeout(() => router.replace('/Login'), 3000);
      } else {
        setError(`Erro ao buscar receitas: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Erro ao buscar receitas:', err);
      setError('Erro ao carregar receitas.');
    }
  };

  const handleCreateRecipe = async (userId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setTimeout(() => setError(undefined), 5000);
        return;
      }
  
      const recipeToCreate = { ...newRecipe };
  
      console.log('Dados da receita a ser criada:', recipeToCreate);
  
      const response = await fetch(`http://localhost:3000/myRecipes/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeToCreate),
      });
  
      if (response.ok) {
        const newCreatedRecipe = await response.json();
        setRecipes((prevRecipes) => [newCreatedRecipe, ...prevRecipes]);
        setIsCreateModalOpen(false);
        setSuccessMessage('Receita criada com sucesso!');
        setTimeout(() => setSuccessMessage(undefined), 3000);
  
        setNewRecipe({
          name: '',
          ingredients: '',
          instructions: '',
          prepTime: 0,
          difficulty: 'Fácil',
        });
      } else {
        const errorData = await response.json();
        console.error('Erro ao criar receita:', errorData);
        setError(
          `Erro ao criar receita. Verifique os dados. Detalhes: ${
            errorData.message || response.statusText
          }`
        );
        setTimeout(() => setError(undefined), 5000);
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      setError('Erro ao conectar com o servidor.');
    }
  };
  
  const handleDelete = async (recipeId: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        console.error('Token não encontrado. Faça login novamente.');
        return;
      }
      const decoded = decodeToken(token);
      const userId = decoded.sub;

      const response = await fetch(`http://localhost:3000/myRecipes/${userId}/recipe/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Receita excluída com sucesso!');
        setSuccessMessage('Receita excluída com sucesso!');
        setErrorMessage(undefined);
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId));
      } else {
        console.error('Erro ao excluir receita. Verifique sua permissão.');
        setErrorMessage('Erro ao excluir receita. Verifique sua permissão.');
        setSuccessMessage(undefined);
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor.', error);
      setErrorMessage('Erro ao conectar com o servidor.');
      setSuccessMessage(undefined);
    }
  };

  const renderRecipe = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.ingredients || 'Não informado'}</Text>
      <Text style={styles.cell}>{item.prepTime ? `${item.prepTime} min` : 'Não informado'}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButton}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Receitas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerCell}>Nome</Text>
              <Text style={styles.headerCell}>Ingredientes</Text>
              <Text style={styles.headerCell}>Preparo</Text>
              <Text style={styles.headerCell}>Ações</Text>
            </View>
          }
        />
      )}

      {successMessage && <Text style={styles.success}>{successMessage}</Text>}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Button title="Criar Receita" onPress={() => setIsCreateModalOpen(true)} />
      <Button
        title="Logout"
        onPress={() => AsyncStorage.removeItem('authToken').then(() => router.replace('/Login'))}
      />

      <Modal
        visible={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Criar Receita</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={newRecipe.name}
            onChangeText={(text) => setNewRecipe({ ...newRecipe, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Ingredientes"
            value={newRecipe.ingredients}
            onChangeText={(text) => setNewRecipe({ ...newRecipe, ingredients: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Instruções"
            value={newRecipe.instructions}
            onChangeText={(text) => setNewRecipe({ ...newRecipe, instructions: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Tempo de preparo"
            keyboardType="numeric"
            value={newRecipe.prepTime.toString()}
            onChangeText={(text) =>
              setNewRecipe({ ...newRecipe, prepTime: parseInt(text || '0', 10) })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Dificuldade"
            value={newRecipe.difficulty}
            onChangeText={(text) => setNewRecipe({ ...newRecipe, difficulty: text })}
          />

          <Button
            title="Salvar"
            onPress={() => handleCreateRecipe(decoded.sub)} 
          />
          <Button title="Cancelar" onPress={() => setIsCreateModalOpen(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    color: 'red',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default DashboardScreen;
