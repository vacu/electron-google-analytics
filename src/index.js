const request = require('request');
const uuidV4 = require('uuid/v4');
const _ = require('lodash');

class Analytics {
  /**
   * Class constructor
   */
  constructor(trackingID, { userAgent = '', debug = false, version = 1 }) {
    // Debug
    this.debug = debug;

    // User-agent
    this.userAgent = userAgent;

    // Links
    this.baseURL = 'https://www.google-analytics.com';
    this.debugURL = '/debug';
    this.collectURL = '/collect';
    this.batchURL = '/batch';

    // Google generated ID
    this.trackingID = trackingID;
    // Google API version
    this.version = version;
  }

  /**
   * Send a "pageview" request
   *
   * @param  {string} url      Url of the page
   * @param  {string} title    Title of the page
   * @param  {string} hostname Document hostname
   * @param  {string} clientID uuidV4
   *
   * @return {Promise}
   */
  pageview(hostname, url, title, clientID) {
    const params = { dh: hostname, dp: url, dt: title };
    return this.send('pageview', params, clientID);
  }

  /**
   * Send a "event" request
   *
   * @param  {string} evCategory Event category
   * @param  {string} evAction   Event action
   * @param  {string} clientID   uuidV4
   * @param  {string} evLabel    Event label
   * @param  {string} evValue    Event description
   *
   * @return {Promise}
   */
  event(evCategory, evAction, { evLabel, evValue, clientID } = {}) {
    let params = { ec: evCategory, ea: evAction };

    if (evLabel) params['el'] = evLabel;
    if (evValue) params['ev'] = evValue;

    return this.send('event', params, clientID);
  }

  /**
   * Send a "screenview" request
   *
   * @param  {string} appName        App name
   * @param  {string} appVer         App version
   * @param  {string} appID          App Id
   * @param  {string} appInstallerID App Installer Id
   * @param  {string} screenName     Screen name / Content description
   * @param  {string} clientID       uuidV4
   *
   * @return {Promise}
   */
  screen(appName, appVer, appID, appInstallerID, screenName, clientID) {
    let params = {
      an: appName,
      av: appVer,
      aid: appID,
      aiid: appInstallerID,
      cd: screenName
    };

    return this.send('screenview', params, clientID);
  }

  /**
   * Send a request to google-analytics
   *
   * @param  {string} hitType  Hit type
   * @param  {string} clientID Unique identifier (uuidV4)
   * @param  {Object} params   Options
   *
   * @return {Promise}
   */
  send(hitType, params, clientID) {
    return new Promise((resolve, reject) => {
      let formObj = {
        v: this.version,
        tid: this.trackingID,
        cid: clientID || uuidV4(),
        t: hitType
      };
      if (params) _.extend(formObj, params);

      let url = `${this.baseURL}${this.collectURL}`;
      if (this.debug) {
        url = `${this.baseURL}${this.debugURL}${this.collectURL}`;
      }

      let reqObj = { url: url, form: formObj };
      if (this.userAgent !== '') {
        reqObj['headers'] = { 'User-Agent': this.userAgent };
      }

      return request.post(reqObj, (err, httpResponse, body) => {
        if (err) return reject(err);

        if (httpResponse.statusCode === 200) {
          if (this.debug) {
            const bodyJson = JSON.parse(body);

            if (bodyJson.hitParsingResult[0].valid) {
              return resolve({ clientID: formObj.cid });
            }

            return reject(bodyJson);
          }

          return resolve({ clientID: formObj.cid });
        }

        return reject(bodyJson);
      })
    });
  }
}

export default Analytics;
