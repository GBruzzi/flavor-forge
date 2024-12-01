import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 

const CadastroScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const handleSubmit = async () => {
    setError(null); // Resetar erro
    setSuccess(null); // Resetar sucesso

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setSuccess("Usuário criado com sucesso!");
        setTimeout(() => router.push("/Login"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao criar usuário");
      }
    } catch (error) {
      setError("Erro de conexão com o servidor");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Flavor Forge</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Criar uma conta</Text>
        {success && <Text style={styles.successMessage}>{success}</Text>}
        {error && <Text style={styles.errorMessage}>{error}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button title="Cadastrar" onPress={handleSubmit} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Flavor Forge</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  header: {
    backgroundColor: "#333", 
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#fff", 
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "white", 
    borderRadius: 10,
    elevation: 3, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333", 
  },
  input: {
    height: 50,
    borderColor: "#ccc", 
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: "#fff", 
  },
  errorMessage: {
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
  },
  successMessage: {
    color: "#2ecc71", 
    textAlign: "center",
    marginBottom: 10,
  },
  footer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333", 
  },
  footerText: {
    color: "#fff", 
    fontSize: 14,
  },
});

export default CadastroScreen;
