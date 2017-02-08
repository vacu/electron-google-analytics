### Google Analytics - [Measurement Protocol API](https://developers.google.com/analytics/devguides/collection/protocol/v1/)

![travis-ci](https://travis-ci.org/vacu/electron-google-analytics.svg?branch=master)


The main purpose of this was to be used with [Electron](http://electron.atom.io/) built apps.

#### Features
* Pageview
* Event
* Screenview
* Custom function for the rest (send)

#### Getting started
Installation
```
npm i electron-google-analytics
```

* Init

    `Analytics(trackingID, { userAgent, debug, version })`
    ```javascript
    import Analytics from 'electron-google-analytics';
    const analytics = new Analytics('UA-XXXXXXXX-X');
    ```

* Pageview

  `Analytics#pageview(hostname, url, title, clientID)`
  ```javascript
  return analytics.pageview('http://example.com', '/home', 'Example')
    .then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```
  If you want to keep the session you need to specify the `clientID`.

* Event

  `Analytics#event(evCategory, evAction, { evLabel, evValue, clientID })`
  ```javascript
  return analytics.event('Video', 'play', { evLabel: 'holiday', evValue: 300})
    .then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Screenview

  `Analytics#screen(appName, appVer, appID, appInstallerID, screenName, clientID)`
  ```javascript
  return analytics.screen('test', '1.0.0', 'com.app.test', 'com.app.installer', 'Test')
    .then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Send (for everything else for now)

  `Analytics#send(hitType, params, clientID)`
  ```javascript
  return analytics.send('social', { sa: 'social', sn: 'facebook', st: 'home' })
    .then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

#### Tests
```
cross-env TRACKING_ID='UA-XXXXXXXX-X' npm test
```

# MIT
