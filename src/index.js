import request from 'request';
import uuidV4 from 'uuid/v4';

class Analytics {
  /**
   * Class constructor
   */
  constructor(trackingID, { userAgent = '', debug = false, version = 1 } = {}) {
    // Debug
    this._debug = debug;

    // User-agent
    this._userAgent = userAgent;

    // Links
    this._baseURL = 'https://www.google-analytics.com';
    this._debugURL = '/debug';
    this._collectURL = '/collect';
    this._batchURL = '/batch';

    // Google generated ID
    this._trackingID = trackingID;
    // Google API version
    this._version = version;
  }

  get debug() {
    return this._debug;
  }

  set debug(value) {
    this._debug = value;
  }

  get userAgent() {
    return this._userAgent;
  }

  set userAgent(value) {
    this._userAgent = value;
  }

  get baseURL() {
    return this._baseURL;
  }

  set baseURL(value) {
    this._baseURL = value;
  }

  get debugURL() {
    return this._debugURL;
  }

  set debugURL(value) {
    this._debugURL = value;
  }

  get collectURL() {
    return this._collectURL;
  }

  set collectURL(value) {
    this._collectURL = value;
  }

  get batchURL() {
    return this._batchURL;
  }

  set batchURL(value) {
    this._batchURL = value;
  }

  get trackingID() {
    return this._trackingID;
  }

  set trackingID(value) {
    this._trackingID = value;
  }

  get version() {
    return this._version;
  }

  set version(value) {
    this._version = value;
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
    const params = {
      an: appName,
      av: appVer,
      aid: appID,
      aiid: appInstallerID,
      cd: screenName
    };

    return this.send('screenview', params, clientID);
  }

  /**
   * Send a "transaction" request
   *
   * @param  {string} trnID    Transaction ID
   * @param  {string} trnAffil Transaction affiliation
   * @param  {string} trnRev   Transaction Revenue
   * @param  {Number} trnShip  Transaction shipping
   * @param  {Number} trnTax   Transaction tax
   * @param  {string} currCode Currency code
   * @param  {string} clientID uuidV4
   *
   * @return {Promise}
   */
  transaction(trnID, { trnAffil, trnRev, trnShip, trnTax, currCode } = {}, clientID) {
    let params = { ti: trnID };

    if (trnAffil) params['ta'] = trnAffil;
    if (trnRev) params['tr'] = trnRev;
    if (trnShip) params['ts'] = trnShip;
    if (trnTax) params['tt'] = trnTax;
    if (currCode) params['cu'] = currCode;

    return this.send('transaction', params, clientID);
  }

  /**
   * Send a "social" request
   *
   * @param  {string} socialAction  Social Action
   * @param  {string} socialNetwork Social Network
   * @param  {string} socialTarget  Social Target
   * @param  {string} clientID      uuidV4
   *
   * @return {Promise}
   */
  social(socialAction, socialNetwork, socialTarget, clientID) {
    const params = {
      sa: socialAction,
      sn: socialNetwork,
      st: socialTarget
    };

    return this.send('social', params, clientID);
  }

  /**
   * Send a "exception" request
   *
   * @param  {string} exDesc   Exception description
   * @param  {Number} exFatal  Exception is fatal?
   * @param  {string} clientID uuidV4
   *
   * @return {Promise}
   */
  exception(exDesc, exFatal, clientID) {
    const params = { exd: exDesc, exf: exFatal };

    return this.send('exception', params, clientID);
  }

  /**
   * Send a "refund" request
   *
   * @param {string} trnID          Transaction ID
   * @param {string} evCategory     Event category
   * @param {string} evAction       Event action
   * @param {Number} nonInteraction Non-interaction parameter
   * @param {string} clientID       uuidV4
   *
   * @returns {Promise}
   */
  refund(trnID, evCategory = 'Ecommerce', evAction = 'Refund', nonInteraction = 1, clientID) {
    const params = {
      ec: evCategory,
      ea: evAction,
      ni: nonInteraction,
      ti: trnID,
      pa: 'refund'
    };

    return this.send('event', params, clientID);
  }

  /**
   * Send a "item" request
   * @param  {string} trnID         Transaction ID
   * @param  {string} itemName      Item name
   * @param  {Number} itemPrice     Item price
   * @param  {string} itemQty       Item quantity
   * @param  {string} itemSku       Item SKU
   * @param  {string} itemVariation Item variation / category
   * @param  {string} currCode      Currency code
   * @param  {string} clientID      uuidV4
   * @return {Promise}
   */
  item(trnID, itemName, { itemPrice, itemQty, itemSku, itemVariation, currCode } = {}, clientID) {
    let params = {
      ti: trnID,
      in: itemName
    };

    if (itemPrice) params['ip'] = itemPrice;
    if (itemQty) params['iq'] = itemQty;
    if (itemSku) params['ic'] = itemSku;
    if (itemVariation) params['iv'] = itemVariation;
    if (currCode) params['cu'] = currCode;

    return this.send('item', params, clientID);
  }

  /**
   * Send a "timing tracking" request
   * @param  {string} timingCtg     Timing category
   * @param  {string} timingVar     Timing variable
   * @param  {Number} timingTime    Timing time
   * @param  {string} timingLbl     Timing label
   * @param  {Number} dns           DNS load time
   * @param  {Number} pageDownTime  Page download time
   * @param  {Number} redirTime     Redirect time
   * @param  {Number} tcpConnTime   TCP connect time
   * @param  {Number} serverResTime Server response time
   * @param  {string} clientID      uuidV4
   * @return {Promise}
   */
  timingTrk(timingCtg, timingVar, timingTime, {
    timingLbl, dns, pageDownTime, redirTime, tcpConnTime, serverResTime
  } = {}, clientID) {
    let params = {
      utc: timingCtg,
      utv: timingVar,
      utt: timingTime
    };

    if (timingLbl) params['url'] = timingLbl;
    if (dns) params['dns'] = dns;
    if (pageDownTime) params['pdt'] = pageDownTime;
    if (redirTime) params['rrt'] = redirTime;
    if (tcpConnTime) params['tcp'] = tcpConnTime;
    if (serverResTime) params['srt'] = serverResTime;

    return this.send('timing', params, clientID);
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
        v: this._version,
        tid: this._trackingID,
        cid: clientID || uuidV4(),
        t: hitType
      };
      if (params) Object.assign(formObj, params);

      let url = `${this._baseURL}${this._collectURL}`;
      if (this._debug) {
        url = `${this._baseURL}${this._debugURL}${this._collectURL}`;
      }

      let reqObj = { url: url, form: formObj };
      if (this._userAgent !== '') {
        reqObj['headers'] = { 'User-Agent': this._userAgent };
      }

      return request.post(reqObj, (err, httpResponse, body) => {
        if (err) return reject(err);


        let bodyJson = {};
        if (body && (httpResponse.headers['content-type'] !== 'image/gif')) {
          bodyJson = JSON.parse(body);
        }

        if (httpResponse.statusCode === 200) {
          if (this._debug) {
            if (bodyJson.hitParsingResult[0].valid) {
              return resolve({ clientID: formObj.cid });
            }

            return reject(bodyJson);
          }

          return resolve({ clientID: formObj.cid });
        }

        if (httpResponse.headers['content-type'] !== 'image/gif')
          return reject(bodyJson);

        return reject(body);
      });
    });
  }
}

export default Analytics;
