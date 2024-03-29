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

export function showNotification(getTitle, getMessage) {

    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
            console.log("TOKEN:", token);
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);
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
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
    });


    PushNotification.createChannel({
        channelId: "firstAppChannel1", // (required)
        channelName: "Biente Shop", // (required)
        soundName: "default",
        playSound: true,
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`)
    );

    PushNotification.getChannels(function (channel_ids) {
        console.log(channel_ids);
      });

    PushNotification.localNotification({
        channelId: "firstAppChannel1",
        title: getTitle,
        message: getMessage,        
        soundName: 'default',
        largeIconUrl: "https://www.barbieldesignbyecem.com/image/catalog/logo/barbiel.png", // bildirim sağ tarafındaki küçük resim
        bigPictureUrl: "https://www.barbieldesignbyecem.com/image/catalog/logo/barbiel.png", // bildirim açılınca büyük resim
        number: 10
    });
};

// export const createFCMChannel = async () => {


export const NotificationLister = () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().subscribeToTopic('all');
        // .then(() => console.log(''));

    messaging().onNotificationOpenedApp(async remoteMessage => {
        showNotification(remoteMessage.data.title, remoteMessage.data.body);
        // console.log("onNotificationOpenedApp:", remoteMessage.data.title);
    });

    messaging().getInitialNotification(async remoteMessage => {
        showNotification(remoteMessage.data.title, remoteMessage.data.body);
        // console.log("getInitialNotification:", remoteMessage.data.title);
    });

    messaging().onMessage(async remoteMessage => {
        showNotification(remoteMessage.data.title, remoteMessage.data.body);
        // console.log("onMessage:", remoteMessage.data.title);
    });

}