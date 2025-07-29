import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputProps extends TextInputProps {
  id: string;
  value: string;
  onInputChanged: (id: string, text: string) => void;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const Input: React.FC<InputProps> = ({
  id,
  value,
  onInputChanged,
  rightIcon,
  onRightIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused && { borderColor: '#007bff' },
      ]}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onInputChanged(id, text)}
        onFocus={handleFocus}
       // onBlur={handleBlur}
        blurOnSubmit={false}
        {...props}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
          <MaterialCommunityIcons name={rightIcon} size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000',
  },
  iconContainer: {
    marginLeft: 8,
  },
});

export default Input;
