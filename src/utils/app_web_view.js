import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


let getUserInformation;
let getAppToken;
let url = 'https://ecommerce.biente.shop/yarkin';

const postApi = async () => {
    fetch(url + '/index.php?route=api/mobileapp', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            appToken: getAppToken,
            userInformation: getUserInformation
        })
    })
        .then((response) => response.json())
        .then((responseData) => {
            // console.log(responseData)
        })
        .catch((error) => {
            console.error(error);
        })
}

export default class AppWebView extends Component {

    async onMessage(event) {
        getAppToken = await AsyncStorage.getItem("fcmtoken");
        getUserInformation = event.nativeEvent.data;
        let storageUserInformation = await AsyncStorage.getItem("userInformation");

        if (getUserInformation != storageUserInformation) {
            await AsyncStorage.setItem('userInformation', getUserInformation);
            postApi();
        }

    }

    render() {
        return <View style={styles.webView}>
            <WebView
                source={{ uri: url }}
                onMessage={this.onMessage}
                originWhitelist={['*']}
                javaScriptEnabled={true} />
        </View>
    }
}

const styles = StyleSheet.create({
    webView: {
        flex: 1
    },
});