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
   * @param {string} [clientID] Unique UUIDv4 for this client
   * @param {string} [userAgent] User Agent
   * @param {string} [appName] App name
   * @param {string} [appVersion] App version
   * @param {string} [appID] App Id
   * @param {string} [appInstallerID] App Installer Id
   * @param {boolean} [debug] Should use debug URL
   * @param {number} [version] Protocol Version
   */
  constructor ({ trackingID, clientID, userAgent = '', appName, appVersion, appID, appInstallerID, debug = false, version = 1 } = {}) {
    // Debug
    this.debug = debug

    // User-agent & app-related stuff
    this.userAgent = userAgent
    this.appName = appName
    this.appVersion = appVersion
    this.appID = appID
    this.appInstallerID = appInstallerID

    // Links
    this.baseURL = 'https://www.google-analytics.com'
    this.debugURL = '/debug'
    this.collectURL = '/collect'

    // Google generated ID & client ID
    this.trackingID = trackingID
    this.clientID = clientID || uuidV4()
    // Google API version
    this.version = version
  }

  /**
   * Send a "pageview" request
   *
   * @param {string} url Url of the page
   * @param {string} title Title of the page
   * @param {string} hostname Document hostname
   *
   * @return {Promise}
   */
  pageview (hostname, url, title) {
    const params = { dh: hostname, dp: url, dt: title }
    return this.send('pageview', params)
  }

  /**
   * Send a "event" request
   *
   * @param {string} evCategory Event category
   * @param {string} evAction Event action
   * @param {string} evLabel Event label
   * @param {string} evValue Event description
   *
   * @return {Promise}
   */
  event (evCategory, evAction, { evLabel, evValue } = {}) {
    let params = { ec: evCategory, ea: evAction }

    if (evLabel) params.el = evLabel
    if (evValue) params.ev = evValue

    return this.send('event', params)
  }

  /**
   * Send a "screenview" request
   *
   * @param {string} screenName Screen name / Content description
   *
   * @return {Promise}
   */
  screen (screenName) {
    const params = { cd: screenName }

    return this.send('screenview', params)
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
   *
   * @return {Promise}
   */
  transaction (trnID, { trnAffil, trnRev, trnShip, trnTax, currCode } = {}) {
    let params = { ti: trnID }

    if (trnAffil) params[ 'ta' ] = trnAffil
    if (trnRev) params[ 'tr' ] = trnRev
    if (trnShip) params[ 'ts' ] = trnShip
    if (trnTax) params[ 'tt' ] = trnTax
    if (currCode) params[ 'cu' ] = currCode

    return this.send('transaction', params)
  }

  /**
   * Send a "social" request
   *
   * @param {string} socialAction Social Action
   * @param {string} socialNetwork Social Network
   * @param {string} socialTarget Social Target
   *
   * @return {Promise}
   */
  social (socialAction, socialNetwork, socialTarget) {
    const params = {
      sa: socialAction,
      sn: socialNetwork,
      st: socialTarget
    }

    return this.send('social', params)
  }

  /**
   * Send a "exception" request
   *
   * @param {string} exDesc Exception description
   * @param {number} exFatal Exception is fatal?
   *
   * @return {Promise}
   */
  exception (exDesc, exFatal) {
    const params = { exd: exDesc, exf: exFatal }

    return this.send('exception', params)
  }

  /**
   * Send a "refund" request
   *
   * @param {string} transactionID Transaction ID
   * @param {string} evCategory Event category
   * @param {string} evAction Event action
   * @param {number} nonInteraction Non-interaction parameter
   *
   * @returns {Promise}
   */
  refund (transactionID, evCategory = 'Ecommerce', evAction = 'Refund', nonInteraction = 1) {
    const params = {
      ec: evCategory,
      ea: evAction,
      ni: nonInteraction,
      ti: transactionID,
      pa: 'refund'
    }

    return this.send('event', params)
  }

  /**
   * Send a request to google-analytics
   *
   * @param {string} hitType Hit type
   * @param {Object} params Options
   *
   * @return {Promise}
   */
  send (hitType, params) {
    let formObj = {
      v: this.version,
      tid: this.trackingID,
      cid: this.clientID,
      t: hitType
    }
    if (this.appName) formObj.an = this.appName
    if (this.appVersion) formObj.av = this.appVersion
    if (this.appID) formObj.aid = this.appID
    if (this.appInstallerID) formObj.aiid = this.appInstallerID
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
