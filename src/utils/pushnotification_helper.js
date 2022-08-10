import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        GetFCMToke();
    }
}

async function GetFCMToke() {

    let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    // console.log(fcmtoken, "old token");

    if (!fcmtoken) {
        try {
            const fcmtoken = await messaging().getToken();
            if (fcmtoken) {
                // console.log(fcmtoken, 'new token');
                await AsyncStorage.setItem('fcmtoken', fcmtoken);
            }
        } catch (error) {
            console.log(error, 'error in fcmtoken');
        }
    }
}

// const showNotification = () => {
export function showNotification(getTitle, getMessage) {

    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
            // console.log("TOKEN:", token);
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
            // console.log("NOTIFICATION:", notification);
        },

        // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
        //senderID: "YOUR GCM (OR FCM) SENDER ID",

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         */
        requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel({
        channelId: 'biente.webview.with.token',
        channelName: 'Biente Channel',
        soundName: 'default',
        vibrate: true,
    });

    PushNotification.localNotification({
        channelId: "biente.webview.with.token",
        title: getTitle,
        message: getMessage,
    });
};

// export const createFCMChannel = async () => {


export const NotificationLister = () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging()
        .subscribeToTopic('all')
        .then(() => console.log('Subscribed to all topic!'));

    messaging().onNotificationOpenedApp(async remoteMessage => {
        showNotification(remoteMessage.data.title, remoteMessage.data.body);
    });

    messaging().getInitialNotification(async remoteMessage => {
        showNotification(remoteMessage.data.title, remoteMessage.data.body);
    });

    messaging().onMessage(async remoteMessage => {
        showNotification(remoteMessage.data.title, remoteMessage.data.body);
    });

}