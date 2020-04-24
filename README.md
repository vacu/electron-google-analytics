### Google Analytics - [Measurement Protocol API](https://developers.google.com/analytics/devguides/collection/protocol/v1/)

[![travis-ci](https://travis-ci.org/vacu/electron-google-analytics.svg?branch=master)](https://travis-ci.org/vacu/electron-google-analytics)
[![dependencies Status](https://david-dm.org/vacu/electron-google-analytics/status.svg)](https://david-dm.org/vacu/electron-google-analytics)
![](https://img.shields.io/badge/code%20style-airbnb-green.svg)


The main purpose of this was to be used with [Electron](http://electron.atom.io/) built apps.

#### Features
* Pageview
* Event
* Screenview
* Transaction
* Social
* Exception
* Refund
* Purchase
* Checkout Steps
* Checkout Options
* Item
* User Timing Tracking
* Custom function for the rest (send)

#### [Github Page - Docs](https://vacu.github.io/electron-google-analytics/)
https://vacu.github.io/electron-google-analytics/

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
* Set (custom params)

    `Analytics#set(key, value)`
    ```javascript
    analytics.set('uid', 123);
    ```
* Remove parameter:

    ```javascript
    analytics.set('uid', null);
    ```

* Pageview

  `Analytics#pageview(hostname, url, title, clientID, sessionDuration)`
  ```javascript
  return analytics.pageview('http://example.com', '/home', 'Example')
    .then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```
  If you want to keep the session you need to specify the `clientID`. The `clientID` can be found in the promise `response` above.

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

* Transaction

  `Analytics#transaction(trnID, { trnAffil, trnRev, trnShip, trnTax, currCode } = {}, clientID)`
  ```javascript
  return analytics.transaction(123).then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Social

  `Analytics#social(socialAction, socialNetwork, socialTarget, clientID)`
  ```javascript
  return analytics.social('like', 'facebook', 'home').then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Exception

  `Analytics#exception(exDesc, exFatal, clientID)`
  ```javascript
  return analytics.exception('IOException', 1).then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Refund

  `Analytics#refund(trnID, evCategory = 'Ecommerce', evAction = 'Refund', nonInteraction = 1, { prdID, prdQty } = {}, clientID)`
  ```javascript
  return analytics.refund('T123').then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Purchase

  `Analytics#purchase(hostname, url, title, transactionID, {
    trnAffil, trnRev, trnTax, trnShip, trnCoupon,
    prdID, prdName, prdCtg, prdBrand, prdVar, prdPos
  } = {}, clientID)`
  ```javascript
  return analytics.purchase('http://example.com', '/test', 'Test', 'T123', { prdID: 'P123' }).then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Checkout Steps

  `Analytics#checkout(hostname, url, title, checkoutStep, checkoutOpt, {
    prdID, prdName, prdCtg, prdBrand, prdVar, prdPrice, prdQty
  } = {}, clientID)`
  ```javascript
  return analytics.checkout('http://example.com', '/test', 'Test', '1', 'Visa').then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Checkout Options

  `Analytics#checkoutOpt(evCategory, evAction, checkoutStep, checkoutOpt, clientID)`
  ```javascript
  return analytics.checkoutOpt('Checkout', 'Option', '2', 'FedEx').then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* Item

  `Analytics#item(trnID, itemName, { itemPrice, itemQty, itemSku, itemVariation, currCode } = {}, clientID)`
  ```javascript
  return analytics.item(123, 'Test item').then((response) => {
      return response;
    }).catch((err) => {
      return err;
    });
  ```

* User Timing Tracking

  `Analytics#timingTrk(timingCtg, timingVar, timingTime, { timingLbl, dns, pageDownTime, redirTime, tcpConnTime, serverResTime } = {}, clientID)`
  ```javascript
  return analytics.timingTrk('Category', 'jsonLoader').then((response) => {
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
#### es5 usage
If you are not using tools like babel to use es6 with your application, you'll have to modify your code slightly. Below is an example of a test screen view that you can use out of the box with node.js

```javascript
const Analytics  = require('electron-google-analytics');
const analytics = new Analytics.default('UA-XXXXXXXX-X');

function test(){
    return analytics.screen('test', '1.0.0', 'com.app.test', 'com.app.installer', 'Test')
  .then((response) => {
    return response;
  }).catch((err) => {
    return err;
  });
}
test();
```

#### Tests
```
cross-env TRACKING_ID='UA-XXXXXXXX-X' npm test
```

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VXUG7T2PHHMV4)

# MIT
