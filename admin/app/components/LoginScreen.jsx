import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Composant de login pour l'admin
 */
export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      const msg = "Email et mot de passe requis";
      setError(msg);
      Alert.alert("Erreur", msg);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Laravel returns validation errors under `errors` for 422
        let message = data.message || "Erreur lors de la connexion";
        if (response.status === 422 && data.errors) {
          message = Object.values(data.errors).flat().join('\n');
        }
        setError(message);
        Alert.alert("Erreur", message);
        return;
      }

      if (!data.token) {
        const msg = "Pas de token reçu";
        setError(msg);
        Alert.alert("Erreur", msg);
        return;
      }

      // Sauvegarder le token
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
      }

      onLoginSuccess({
        token: data.token,
        user: data.user,
      });
    } catch (err) {
      const msg = err?.message || "Erreur réseau";
      setError(msg);
      Alert.alert("Erreur", msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <MaterialIcons name="admin-panel-settings" size={64} color="#19b3e6" />
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>Gestion des produits et commandes</Text>
        </View>

        {/* Afficher erreur (mobile-friendly) */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={18} color="#637f88" />
              <TextInput
                style={styles.input}
                placeholder="admin@example.com"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={18} color="#637f88" />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={18}
                  color="#637f88"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialIcons name="login" size={18} color="#fff" />
                <Text style={styles.loginBtnText}>Se connexter</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Message */}
          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={16} color="#0ea5e9" />
            <Text style={styles.infoText}>
              Utilisez vos identifiants d'administrateur pour accéder au portail
            </Text>
          </View>

          {/* Demo Credentials */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>🧪 Identifiants de test:</Text>
            <Text style={styles.demoText}>Email: admin@example.com</Text>
            <Text style={styles.demoText}>Password: password</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f8",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111618",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#637f88",
    marginTop: 4,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111618",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#dce3e5",
    borderRadius: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111618",
    outlineStyle: "none",
  },
  loginBtn: {
    backgroundColor: "#19b3e6",
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  infoBox: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#e0f2fe",
    borderRadius: 6,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#0369a1",
  },
  demoBox: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400e",
    marginBottom: 4,
  },
  demoText: {
    fontSize: 11,
    color: "#b45309",
    fontFamily: "monospace",
  },
  errorBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fee2e2",
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#991b1b",
    fontSize: 13,
    fontWeight: "600",
  },
});
