'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Analytics = function () {
  /**
   * Class constructor
   */
  function Analytics(trackingID) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$userAgent = _ref.userAgent,
        userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? 1 : _ref$version;

    _classCallCheck(this, Analytics);

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

  _createClass(Analytics, [{
    key: 'pageview',


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
    value: function pageview(hostname, url, title, clientID) {
      var params = { dh: hostname, dp: url, dt: title };
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

  }, {
    key: 'event',
    value: function event(evCategory, evAction) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          evLabel = _ref2.evLabel,
          evValue = _ref2.evValue,
          clientID = _ref2.clientID;

      var params = { ec: evCategory, ea: evAction };

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

  }, {
    key: 'screen',
    value: function screen(appName, appVer, appID, appInstallerID, screenName, clientID) {
      var params = {
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

  }, {
    key: 'transaction',
    value: function transaction(trnID) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          trnAffil = _ref3.trnAffil,
          trnRev = _ref3.trnRev,
          trnShip = _ref3.trnShip,
          trnTax = _ref3.trnTax,
          currCode = _ref3.currCode;

      var clientID = arguments[2];

      var params = { ti: trnID };

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

  }, {
    key: 'social',
    value: function social(socialAction, socialNetwork, socialTarget, clientID) {
      var params = {
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

  }, {
    key: 'exception',
    value: function exception(exDesc, exFatal, clientID) {
      var params = { exd: exDesc, exf: exFatal };

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

  }, {
    key: 'refund',
    value: function refund(trnID) {
      var evCategory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Ecommerce';
      var evAction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Refund';
      var nonInteraction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var clientID = arguments[4];

      var params = {
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

  }, {
    key: 'item',
    value: function item(trnID, itemName) {
      var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          itemPrice = _ref4.itemPrice,
          itemQty = _ref4.itemQty,
          itemSku = _ref4.itemSku,
          itemVariation = _ref4.itemVariation,
          currCode = _ref4.currCode;

      var clientID = arguments[3];

      var params = {
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

      var clientID = arguments[4];

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

  }, {
    key: 'send',
    value: function send(hitType, params, clientID) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var formObj = {
          v: _this._version,
          tid: _this._trackingID,
          cid: clientID || (0, _v2.default)(),
          t: hitType
        };
        if (params) Object.assign(formObj, params);

        var url = '' + _this._baseURL + _this._collectURL;
        if (_this._debug) {
          url = '' + _this._baseURL + _this._debugURL + _this._collectURL;
        }

        var reqObj = { url: url, form: formObj };
        if (_this._userAgent !== '') {
          reqObj['headers'] = { 'User-Agent': _this._userAgent };
        }

        return _request2.default.post(reqObj, function (err, httpResponse, body) {
          if (err) return reject(err);

          var bodyJson = {};
          if (body && httpResponse.headers['content-type'] !== 'image/gif') {
            bodyJson = JSON.parse(body);
          }

          if (httpResponse.statusCode === 200) {
            if (_this._debug) {
              if (bodyJson.hitParsingResult[0].valid) {
                return resolve({ clientID: formObj.cid });
              }

              return reject(bodyJson);
            }

            return resolve({ clientID: formObj.cid });
          }

          if (httpResponse.headers['content-type'] !== 'image/gif') return reject(bodyJson);

          return reject(body);
        });
      });
    }
  }, {
    key: 'debug',
    get: function get() {
      return this._debug;
    },
    set: function set(value) {
      this._debug = value;
    }
  }, {
    key: 'userAgent',
    get: function get() {
      return this._userAgent;
    },
    set: function set(value) {
      this._userAgent = value;
    }
  }, {
    key: 'baseURL',
    get: function get() {
      return this._baseURL;
    },
    set: function set(value) {
      this._baseURL = value;
    }
  }, {
    key: 'debugURL',
    get: function get() {
      return this._debugURL;
    },
    set: function set(value) {
      this._debugURL = value;
    }
  }, {
    key: 'collectURL',
    get: function get() {
      return this._collectURL;
    },
    set: function set(value) {
      this._collectURL = value;
    }
  }, {
    key: 'batchURL',
    get: function get() {
      return this._batchURL;
    },
    set: function set(value) {
      this._batchURL = value;
    }
  }, {
    key: 'trackingID',
    get: function get() {
      return this._trackingID;
    },
    set: function set(value) {
      this._trackingID = value;
    }
  }, {
    key: 'version',
    get: function get() {
      return this._version;
    },
    set: function set(value) {
      this._version = value;
    }
  }]);

  return Analytics;
}();

exports.default = Analytics;