
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import { showNotification } from './src/utils/pushnotification_helper';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    // console.log("setBackgroundMessageHandler:", remoteMessage);
    showNotification(remoteMessage.data.title, remoteMessage.data.body);
  });

  //  read more here https://rnfirebase.io/messaging/usage#background-application-state
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
  }

  return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);

// AppRegistry.registerComponent(appName, () => App);
