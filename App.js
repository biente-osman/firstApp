import React, {useEffect, useState} from 'react';
import { requestUserPermission, NotificationLister } from "./src/utils/pushnotification_helper"
import AppWebView from "./src/utils/app_web_view"


function App() {

  useEffect(() => {
    requestUserPermission();
    NotificationLister();
  });

  return (
    <AppWebView />
  );
};

export default App;
