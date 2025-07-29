import React, { FC, useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface InputProps extends TextInputProps {
    id: string;
    icon?: string;
    errorText?: string[];
    onInputChanged: (id: string, text: string) => void;
    errorTextColor?: string;
}

const Input: FC<InputProps> = (props) => {
    const [isFocused, setIsFocused] = useState(false);
    const { dark } = useTheme();

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const onChangeText = (text: string) => {
        props.onInputChanged(props.id, text);
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: isFocused ? COLORS.white : dark ? COLORS.dark2 : COLORS.greyscale500,
                        //backgroundColor: COLORS.white
                        backgroundColor: isFocused ? COLORS.white : dark ? COLORS.dark2 : COLORS.greyscale500,
                    },
                ]}
            >
                {props.icon && (
                    <Image
                        source={props.icon as ImageSourcePropType}
                        style={[
                            styles.icon,
                            {
                                //tintColor: isFocused ? COLORS.primary : '#BCBCBC',
                            },
                        ]}
                    />
                )}
                <TextInput
                    {...props}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}

                    //onBlur={handleBlur}
                    style={[styles.input, { color: dark ? COLORS.white : COLORS.black }]}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholderTextColor}
                    autoCapitalize="none"
                    autoComplete='off'
                />
            </View>
            {props.errorText && (
                <View style={styles.errorContainer}>
                    <Text style={[
                        styles.errorText,
                        { color: props.errorTextColor || 'red' }  // default to red if not provided
                    ]}>{props.errorText}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding2,
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 5,
        flexDirection: 'row',
        height: 52,
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
        height: 20,
        width: 20,
        tintColor: '#BCBCBC',
    },
    input: {
        color: COLORS.black,
        flex: 1,
        fontFamily: 'regular',
        fontSize: 16,
        paddingVertical: 5,
        outlineStyle: 'solid',
        outlineWidth: 0,
    },

    errorContainer: {
        marginVertical: 4,
    },
    errorText: {
        fontSize: 12,
    },
});

export default Input;