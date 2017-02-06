const request = require('request');
const uuidV4 = require('uuid/v4');
const _ = require('lodash');

class Analytics {
  constructor(trackingID, version = 1) {
    this.baseURL = 'https://www.google-analytics.com';
    this.debugURL = '/debug';
    this.collectURL = '/collect';
    this.batchURL = '/batch';
    this.trackingID = trackingID;
    this.version = version;
  }

  pageview(url, title, hostname, clientID) {
    return this._send('pageview', clientID, {
      dh: hostname,
      dp: url,
      dt: title
    });
  }

  event(evCategory, evAction, clientID, evLabel, evValue) {
    let params = { ec: evCategory, ea: evAction };

    if (evLabel) params['el'] = evLabel;
    if (evValue) params['ev'] = evValue;

    return this._send('event', clientID, params);
  }

  screen(appName, appVer, appID, appInstallerID, screenName, clientID) {
    let params = {
      an: appName,
      av: appVer,
      aid: appID,
      aiid: appInstallerID,
      cd: screenName
    };

    return this._send('screenview', clientID, params);
  },

  _send(hitType, clientID, params) {
    return new Promise((resolve, reject) => {
      let formObj = {
        v: this.version,
        tid: this.trackingID,
        cid: clientID || uuidV4(),
        t: hitType
      };

      if (params) _.extend(formObj, params);

      return request.post({
        url: `${this.baseURL}${this.collectURL}`,
        form: formObj
      }, (err, httpResponse, body) => {
        if (err) return reject(err);

        if (httpResponse === 200) {
          return resolve({ clientID });
        }

        return reject({ httpResponse, body });
      })
    });
  }
}

export default Analytics;
