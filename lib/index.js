'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnalyticsError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _electronFetch = require('electron-fetch');

var _electronFetch2 = _interopRequireDefault(_electronFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var AnalyticsError = exports.AnalyticsError = function (_extendableBuiltin2) {
  _inherits(AnalyticsError, _extendableBuiltin2);

  function AnalyticsError(text, data) {
    _classCallCheck(this, AnalyticsError);

    var _this = _possibleConstructorReturn(this, (AnalyticsError.__proto__ || Object.getPrototypeOf(AnalyticsError)).call(this, text));

    _this.data = data;
    return _this;
  }

  return AnalyticsError;
}(_extendableBuiltin(Error));

var Analytics = function () {
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
  function Analytics(trackingID) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        clientID = _ref.clientID,
        _ref$userAgent = _ref.userAgent,
        userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent,
        appName = _ref.appName,
        appVersion = _ref.appVersion,
        appID = _ref.appID,
        appInstallerID = _ref.appInstallerID,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? 1 : _ref$version;

    _classCallCheck(this, Analytics);

    // Debug
    this.debug = debug;

    // User-agent & app-related stuff
    this.userAgent = userAgent;
    this.appName = appName;
    this.appVersion = appVersion;
    this.appID = appID;
    this.appInstallerID = appInstallerID;

    // Links
    this.baseURL = 'https://www.google-analytics.com';
    this.debugURL = '/debug';
    this.collectURL = '/collect';

    // Google generated ID & client ID
    this.trackingID = trackingID;
    this.clientID = clientID || (0, _v2.default)();
    // Google API version
    this.version = version;
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


  _createClass(Analytics, [{
    key: 'pageview',
    value: function pageview(hostname, url, title) {
      var params = { dh: hostname, dp: url, dt: title };
      return this.send('pageview', params);
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

  }, {
    key: 'event',
    value: function event(evCategory, evAction) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          evLabel = _ref2.evLabel,
          evValue = _ref2.evValue;

      var params = { ec: evCategory, ea: evAction };

      if (evLabel) params.el = evLabel;
      if (evValue) params.ev = evValue;

      return this.send('event', params);
    }

    /**
     * Send a "screenview" request
     *
     * @param {string} screenName Screen name / Content description
     *
     * @return {Promise}
     */

  }, {
    key: 'screen',
    value: function screen(screenName) {
      var params = { cd: screenName };

      return this.send('screenview', params);
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

  }, {
    key: 'transaction',
    value: function transaction(trnID) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          trnAffil = _ref3.trnAffil,
          trnRev = _ref3.trnRev,
          trnShip = _ref3.trnShip,
          trnTax = _ref3.trnTax,
          currCode = _ref3.currCode;

      var params = { ti: trnID };

      if (trnAffil) params['ta'] = trnAffil;
      if (trnRev) params['tr'] = trnRev;
      if (trnShip) params['ts'] = trnShip;
      if (trnTax) params['tt'] = trnTax;
      if (currCode) params['cu'] = currCode;

      return this.send('transaction', params);
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

  }, {
    key: 'social',
    value: function social(socialAction, socialNetwork, socialTarget) {
      var params = {
        sa: socialAction,
        sn: socialNetwork,
        st: socialTarget
      };

      return this.send('social', params);
    }

    /**
     * Send a "exception" request
     *
     * @param {string} exDesc Exception description
     * @param {number} exFatal Exception is fatal?
     *
     * @return {Promise}
     */

  }, {
    key: 'exception',
    value: function exception(exDesc, exFatal) {
      var params = { exd: exDesc, exf: exFatal };

      return this.send('exception', params);
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

  }, {
    key: 'refund',
    value: function refund(transactionID) {
      var evCategory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Ecommerce';
      var evAction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Refund';
      var nonInteraction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      var params = {
        ec: evCategory,
        ea: evAction,
        ni: nonInteraction,
        ti: transactionID,
        pa: 'refund'
      };

      return this.send('event', params);
    }

    /**
     * Send a "item" request
     * @param {string} transactionID Transaction ID
     * @param {string} itemName Item name
     * @param {number} itemPrice Item price
     * @param {string} itemQty Item quantity
     * @param {string} itemSku Item SKU
     * @param {string} itemVariation Item variation / category
     * @param {string} currCode Currency code
     * @return {Promise}
     */

  }, {
    key: 'item',
    value: function item(transactionID, itemName) {
      var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          itemPrice = _ref4.itemPrice,
          itemQty = _ref4.itemQty,
          itemSku = _ref4.itemSku,
          itemVariation = _ref4.itemVariation,
          currCode = _ref4.currCode;

      var params = {
        ti: transactionID,
        in: itemName
      };

      if (itemPrice) params['ip'] = itemPrice;
      if (itemQty) params['iq'] = itemQty;
      if (itemSku) params['ic'] = itemSku;
      if (itemVariation) params['iv'] = itemVariation;
      if (currCode) params['cu'] = currCode;

      return this.send('item', params);
    }

    /**
     * Send a "timing tracking" request
     * @param {string} timingCtg Timing category
     * @param {string} timingVar Timing variable
     * @param {number} timingTime Timing time
     * @param {string} [timingLbl] Timing label
     * @param {number} [dns] DNS load time
     * @param {number} [pageDownTime] Page download time
     * @param {number} [redirTime] Redirect time
     * @param {number} [tcpConnTime] TCP connect time
     * @param {number} [serverResTime] Server response time
     * @return {Promise}
     */

  }, {
    key: 'timingTrk',
    value: function timingTrk(timingCtg, timingVar, timingTime) {
      var _ref5 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          timingLbl = _ref5.timingLbl,
          dns = _ref5.dns,
          pageDownTime = _ref5.pageDownTime,
          redirTime = _ref5.redirTime,
          tcpConnTime = _ref5.tcpConnTime,
          serverResTime = _ref5.serverResTime;

      var params = {
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

      return this.send('timing', params);
    }

    /**
     * Send a request to google-analytics
     *
     * @param {string} hitType Hit type
     * @param {Object} params Options
     *
     * @return {Promise}
     */

  }, {
    key: 'send',
    value: function send(hitType, params) {
      var _this2 = this;

      var formObj = {
        v: this.version,
        tid: this.trackingID,
        cid: this.clientID,
        t: hitType
      };
      if (this.appName) formObj.an = this.appName;
      if (this.appVersion) formObj.av = this.appVersion;
      if (this.appID) formObj.aid = this.appID;
      if (this.appInstallerID) formObj.aiid = this.appInstallerID;
      if (params) Object.assign(formObj, params);

      var url = '' + this.baseURL + this.collectURL;
      if (this.debug) {
        url = '' + this.baseURL + this.debugURL + this.collectURL;
      }

      var reqObj = {
        url: url,
        method: 'POST',
        body: Object.keys(formObj).map(function (key) {
          return encodeURI(key) + '=' + encodeURI(formObj[key]);
        }).join('&')
      };
      if (this.userAgent !== '') {
        reqObj.headers = { 'User-Agent': this.userAgent };
      }

      return (0, _electronFetch2.default)(url, reqObj).then(function (res) {
        if (res.headers.get('content-type') !== 'image/gif') {
          return res.json().catch(function () {
            return res.text().then(function (text) {
              throw new AnalyticsError('Analytics server responded with an error: ' + text);
            });
          }).then(function (bodyJson) {
            if (res.ok) {
              if (_this2.debug) {
                if (bodyJson.hitParsingResult[0].valid) {
                  return { clientID: formObj.cid };
                }
                // Debug mode is true, so print out the error
                console.log(JSON.stringify(bodyJson, null, 2));
                throw new AnalyticsError('Analytics server responded with an error', bodyJson);
              }
              return { clientID: formObj.cid };
            } else {
              throw new AnalyticsError('Analytics server responded with an error', bodyJson);
            }
          });
        } else {
          return res.text().then(function (text) {
            throw new AnalyticsError('Analytics server responded with an error: ' + text);
          });
        }
      });
    }
  }]);

  return Analytics;
}();

exports.default = Analytics;