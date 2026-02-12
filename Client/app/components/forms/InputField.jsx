import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function InputField({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = 'default',
  icon = null,
  onIconPress = null,
  multiline = false,
  numberOfLines = 1,
  error = null,
  ...props 
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {icon && (
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.inputMultiline
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor="#637f88"
          {...props}
        />
        {onIconPress && (
          <TouchableOpacity onPress={onIconPress} style={styles.iconButton}>
            <Text style={styles.icon}>👁️</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111618',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dce3e5',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  iconContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#637f88',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111618',
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  iconButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
});
