import {View, Text, StyleSheet} from 'react-native';

export default function SignupScreen(props:any) {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Signup Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});