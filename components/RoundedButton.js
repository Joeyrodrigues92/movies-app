import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function RoundedButton(props){
    const { text, icon, textColor, backgroundColor, onPress } = props;
    const color = textColor || 'blue';

    return(
        <TouchableOpacity 
    //&& - shortcut circut operator. If onPress is not null,  invoke onPress() 
            onPress={() => onPress && onPress() }
            style={[styles.wrapper, {backgroundColor: backgroundColor || 'transparent'}
            ]}
        >
            <View style={styles.ButtonTextWrapper}>
                {icon}
                <Text style={[{ color }, styles.buttonText]}>{text}</Text>
            </View>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    wrapper:{
        padding: 15,
        display: 'flex',
        borderRadius: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'yellow',
        marginBottom: 15,
        alignItems: 'center'
    },
    buttonText:{
        fontSize: 15,
        width: '100%',
        textAlign: 'center'
    },
    ButtonTextWrapper:{
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})