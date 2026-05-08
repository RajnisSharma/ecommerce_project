import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { COLORS } from '../utils/constants';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      // Login successful - navigate back to close auth modal
      navigation.goBack();
    } else {
      const errorMsg = result.payload?.detail ||
        result.payload?.non_field_errors?.[0] ||
        'Invalid credentials';
      Alert.alert('Error', errorMsg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotLink}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  form: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: COLORS.gray, marginBottom: 30 },
  input: { borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10, padding: 15, marginBottom: 15 },
  button: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  forgotLink: { textAlign: 'center', marginTop: 15, color: COLORS.gray, fontSize: 14 },
  link: { textAlign: 'center', marginTop: 20, color: COLORS.primary },
});
