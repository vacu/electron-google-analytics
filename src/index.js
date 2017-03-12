import uuidV4 from 'uuid/v4'
import fetch from 'electron-fetch'

export class AnalyticsError extends Error {
  constructor (text, data) {
    super(text)
    this.data = data
  }
}

export default class Analytics {
  /**
   * Class constructor
   *
   * @param {string} trackingID Google-provided tracking ID
   * @param {string} userAgent
   * @param {string} appName
   * @param {string} appID
   * @param {string} appVersion
   * @param {boolean} debug
   * @param {number} version
   */
  constructor (trackingID, { userAgent = '', appName, appID, appVersion, debug = false, version = 1 } = {}) {
    // Debug
    this.debug = debug

    // User-agent & app-related stuff
    this.userAgent = userAgent
    this.appName = appName
    this.appID = appID
    this.appVersion = appVersion

    // Links
    this.baseURL = 'https://www.google-analytics.com'
    this.debugURL = '/debug'
    this.collectURL = '/collect'

    // Google generated ID
    this.trackingID = trackingID
    // Google API version
    this.version = version
  }

  /**
   * Send a "pageview" request
   *
   * @param {string} url Url of the page
   * @param {string} title Title of the page
   * @param {string} hostname Document hostname
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  pageview (hostname, url, title, clientID) {
    const params = { dh: hostname, dp: url, dt: title }
    return this.send('pageview', params, clientID)
  }

  /**
   * Send a "event" request
   *
   * @param {string} evCategory Event category
   * @param {string} evAction Event action
   * @param {string} [clientID]   uuidV4
   * @param {string} evLabel Event label
   * @param {string} evValue Event description
   *
   * @return {Promise}
   */
  event (evCategory, evAction, { evLabel, evValue, clientID } = {}) {
    let params = { ec: evCategory, ea: evAction }

    if (evLabel) params[ 'el' ] = evLabel
    if (evValue) params[ 'ev' ] = evValue

    return this.send('event', params, clientID)
  }

  /**
   * Send a "screenview" request
   *
   * @param {string} appName App name
   * @param {string} appVer App version
   * @param {string} appID App Id
   * @param {string} appInstallerID App Installer Id
   * @param {string} screenName Screen name / Content description
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  screen (appName, appVer, appID, appInstallerID, screenName, clientID) {
    const params = {
      an: appName,
      av: appVer,
      aid: appID,
      aiid: appInstallerID,
      cd: screenName
    }

    return this.send('screenview', params, clientID)
  }

  /**
   * Send a "transaction" request
   *
   * @param {string|number} trnID Transaction ID
   * @param {string} trnAffil Transaction affiliation
   * @param {string} trnRev Transaction Revenue
   * @param {number} trnShip Transaction shipping
   * @param {number} trnTax Transaction tax
   * @param {string} currCode Currency code
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  transaction (trnID, { trnAffil, trnRev, trnShip, trnTax, currCode } = {}, clientID) {
    let params = { ti: trnID }

    if (trnAffil) params[ 'ta' ] = trnAffil
    if (trnRev) params[ 'tr' ] = trnRev
    if (trnShip) params[ 'ts' ] = trnShip
    if (trnTax) params[ 'tt' ] = trnTax
    if (currCode) params[ 'cu' ] = currCode

    return this.send('transaction', params, clientID)
  }

  /**
   * Send a "social" request
   *
   * @param {string} socialAction Social Action
   * @param {string} socialNetwork Social Network
   * @param {string} socialTarget Social Target
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  social (socialAction, socialNetwork, socialTarget, clientID) {
    const params = {
      sa: socialAction,
      sn: socialNetwork,
      st: socialTarget
    }

    return this.send('social', params, clientID)
  }

  /**
   * Send a "exception" request
   *
   * @param {string} exDesc Exception description
   * @param {number} exFatal Exception is fatal?
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  exception (exDesc, exFatal, clientID) {
    const params = { exd: exDesc, exf: exFatal }

    return this.send('exception', params, clientID)
  }

  /**
   * Send a "refund" request
   *
   * @param {string} transactionID Transaction ID
   * @param {string} evCategory Event category
   * @param {string} evAction Event action
   * @param {number} nonInteraction Non-interaction parameter
   * @param {string} [clientID] uuidV4
   *
   * @returns {Promise}
   */
  refund (transactionID, evCategory = 'Ecommerce', evAction = 'Refund', nonInteraction = 1, clientID) {
    const params = {
      ec: evCategory,
      ea: evAction,
      ni: nonInteraction,
      ti: transactionID,
      pa: 'refund'
    }

    return this.send('event', params, clientID)
  }

  /**
   * Send a request to google-analytics
   *
   * @param {string} hitType Hit type
   * @param {Object} params Options
   * @param {string} [clientID] uuidV4
   *
   * @return {Promise}
   */
  send (hitType, params, clientID) {
    let formObj = {
      v: this.version,
      tid: this.trackingID,
      cid: clientID || uuidV4(),
      t: hitType
    }
    if (this.appName) formObj.an = this.appName
    if (this.appID) formObj.aid = this.appID
    if (this.appVersion) formObj.av = this.appVersion
    if (params) Object.assign(formObj, params)

    let url = `${this.baseURL}${this.collectURL}`
    if (this.debug) {
      url = `${this.baseURL}${this.debugURL}${this.collectURL}`
    }

    let reqObj = {
      url: url,
      method: 'POST',
      body: Object.keys(formObj)
        .map(key => `${encodeURI(key)}=${encodeURI(formObj[ key ])}`)
        .join('&')
    }
    if (this.userAgent !== '') {
      reqObj.headers = { 'User-Agent': this.userAgent }
    }

    return fetch(url, reqObj)
      .then(res => {
        if (res.headers.get('content-type') !== 'image/gif') {
          return res.json()
            .catch(() => res.text()
              .then(text => { throw new AnalyticsError('Analytics server responded with an error: ' + text) })
            )
            .then(bodyJson => {
              if (res.ok) {
                if (this.debug) {
                  if (bodyJson.hitParsingResult[ 0 ].valid) {
                    return { clientID: formObj.cid }
                  }
                  // Debug mode is true, so print out the error
                  console.log(JSON.stringify(bodyJson, null, 2))
                  throw new AnalyticsError('Analytics server responded with an error', bodyJson)
                }
                return { clientID: formObj.cid }
              } else {
                throw new AnalyticsError('Analytics server responded with an error', bodyJson)
              }
            })
        } else {
          return res.text()
            .then(text => { throw new AnalyticsError('Analytics server responded with an error: ' + text) })
        }
      })
  }
}
