"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _electronFetch = _interopRequireDefault(require("electron-fetch"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Analytics = /*#__PURE__*/function () {
  /**
   * Constructor
   *
   * @param {string} trackingID
   * @param {Object} param1
   */
  function Analytics(trackingID) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$userAgent = _ref.userAgent,
        userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent,
        _ref$debug = _ref.debug,
        debug = _ref$debug === void 0 ? false : _ref$debug,
        _ref$version = _ref.version,
        version = _ref$version === void 0 ? 1 : _ref$version;

    _classCallCheck(this, Analytics);

    // Debug
    this.globalDebug = debug; // User-agent

    this.globalUserAgent = userAgent; // Links

    this.globalBaseURL = 'https://www.google-analytics.com';
    this.globalDebugURL = '/debug';
    this.globalCollectURL = '/collect';
    this.globalBatchURL = '/batch'; // Google generated ID

    this.globalTrackingID = trackingID; // Google API version

    this.globalVersion = version; // Custom parameters

    this.customParams = {};
  }
  /**
   * Adds custom parameters to requests
   * if value is null, then parameter will be removed
   *
   * @param  {string} key     Parameter name
   * @param  {string} value   Parameter value
   */


  _createClass(Analytics, [{
    key: "set",
    value: function set(key, value) {
      if (value !== null) {
        this.customParams[key] = value;
      } else {
        delete this.customParams[key];
      }
    }
    /**
     * Send a "pageview" request
     *
     * @param  {string} url      Url of the page
     * @param  {string} title    Title of the page
     * @param  {string} hostname Document hostname
     * @param  {string} clientID uuidV4
     * @param  {string} sessDuration A string to force start or end a session
     *
     * @return {Promise}
     */

  }, {
    key: "pageview",
    value: function pageview(hostname, url, title, clientID, sessDuration) {
      var params = {
        dh: hostname,
        dp: url,
        dt: title
      };

      if (typeof sessDuration !== 'undefined') {
        params.sc = sessDuration;
      }

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
    key: "event",
    value: function event(evCategory, evAction) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          evLabel = _ref2.evLabel,
          evValue = _ref2.evValue,
          clientID = _ref2.clientID;

      var params = {
        ec: evCategory,
        ea: evAction
      };
      if (evLabel) params.el = evLabel;
      if (evValue) params.ev = evValue;
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
    key: "screen",
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
    key: "transaction",
    value: function transaction(trnID) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          trnAffil = _ref3.trnAffil,
          trnRev = _ref3.trnRev,
          trnShip = _ref3.trnShip,
          trnTax = _ref3.trnTax,
          currCode = _ref3.currCode;

      var clientID = arguments.length > 2 ? arguments[2] : undefined;
      var params = {
        ti: trnID
      };
      if (trnAffil) params.ta = trnAffil;
      if (trnRev) params.tr = trnRev;
      if (trnShip) params.ts = trnShip;
      if (trnTax) params.tt = trnTax;
      if (currCode) params.cu = currCode;
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
    key: "social",
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
    key: "exception",
    value: function exception(exDesc, exFatal, clientID) {
      var params = {
        exd: exDesc,
        exf: exFatal
      };
      return this.send('exception', params, clientID);
    }
    /**
     * Send a "refund" request
     *
     * @param {string} trnID          Transaction ID
     * @param {string} evCategory     Event category
     * @param {string} evAction       Event action
     * @param {Number} nonInteraction Non-interaction parameter
     * @param {string} prdID          Product ID
     * @param {Number} prdQty         Product quantity
     * @param {string} clientID       uuidV4
     *
     * @returns {Promise}
     */

  }, {
    key: "refund",
    value: function refund(trnID) {
      var evCategory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Ecommerce';
      var evAction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Refund';
      var nonInteraction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      var _ref4 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          prdID = _ref4.prdID,
          prdQty = _ref4.prdQty;

      var clientID = arguments.length > 5 ? arguments[5] : undefined;
      var params = {
        ec: evCategory,
        ea: evAction,
        ni: nonInteraction,
        ti: trnID,
        pa: 'refund'
      };
      if (prdID) params.pr1id = prdID;
      if (prdQty) params.pr1qt = prdQty;
      return this.send('event', params, clientID);
    }
    /**
     * Send a "purchase" request
     * @param  {string} hostname      Document hostname
     * @param  {string} url           Url of the page
     * @param  {string} title         Title of the page
     * @param  {string} transactionID Transaction ID
     * @param  {string} trnAffil      Transaction affiliation
     * @param  {string} trnRev        Transaction Revenue
     * @param  {Number} trnTax        Transaction tax
     * @param  {Number} trnShip       Transaction shipping
     * @param  {string} trnCoupon     Transaction coupon
     * @param  {string} prdID         Product ID
     * @param  {string} prdName       Product name
     * @param  {string} prdCtg        Product category
     * @param  {string} prdBrand      Product brand
     * @param  {string} prdVar        Product variant
     * @param  {string} prdPos        Product position
     * @param  {string} clientID      uuidV4
     * @return {Promise}
     */

  }, {
    key: "purchase",
    value: function purchase(hostname, url, title, transactionID) {
      var _ref5 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          trnAffil = _ref5.trnAffil,
          trnRev = _ref5.trnRev,
          trnTax = _ref5.trnTax,
          trnShip = _ref5.trnShip,
          trnCoupon = _ref5.trnCoupon,
          prdID = _ref5.prdID,
          prdName = _ref5.prdName,
          prdCtg = _ref5.prdCtg,
          prdBrand = _ref5.prdBrand,
          prdVar = _ref5.prdVar,
          prdPos = _ref5.prdPos;

      var clientID = arguments.length > 5 ? arguments[5] : undefined;
      var params = {
        dh: hostname,
        dp: url,
        dt: title,
        ti: transactionID,
        pa: 'purchase'
      }; // Transaction params

      if (trnAffil) params.ta = trnAffil;
      if (trnRev) params.tr = trnRev;
      if (trnTax) params.tt = trnTax;
      if (trnShip) params.ts = trnShip;
      if (trnCoupon) params.tcc = trnCoupon; // Product params

      if (prdID) params.pr1id = prdID;
      if (prdName) params.pr1nm = prdName;
      if (prdCtg) params.pr1ca = prdCtg;
      if (prdBrand) params.pr1br = prdBrand;
      if (prdVar) params.pr1va = prdVar;
      if (prdPos) params.pr1p = prdPos;
      return this.send('pageview', params, clientID);
    }
    /**
     * Send a "checkout" request
     * @param  {string} hostname     Document hostname
     * @param  {string} url          Url of the page
     * @param  {string} title        Title of the page
     * @param  {string} checkoutStep Checkout step
     * @param  {string} checkoutOpt  Checkout step option
     * @param  {string} prdID        Product ID
     * @param  {string} prdName      Product name
     * @param  {string} prdCtg       Product category
     * @param  {string} prdBrand     Product brand
     * @param  {string} prdVar       Product variant
     * @param  {Number} prdPrice     Product price
     * @param  {Number} prdQty       Product category
     * @param  {string} clientID     uuidV4
     * @return {Promise}
     */

  }, {
    key: "checkout",
    value: function checkout(hostname, url, title, checkoutStep, checkoutOpt) {
      var _ref6 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {},
          prdID = _ref6.prdID,
          prdName = _ref6.prdName,
          prdCtg = _ref6.prdCtg,
          prdBrand = _ref6.prdBrand,
          prdVar = _ref6.prdVar,
          prdPrice = _ref6.prdPrice,
          prdQty = _ref6.prdQty;

      var clientID = arguments.length > 6 ? arguments[6] : undefined;
      var params = {
        dh: hostname,
        dp: url,
        dt: title,
        pa: 'checkout',
        cos: checkoutStep,
        col: checkoutOpt
      };
      if (prdID) params.pr1id = prdID;
      if (prdName) params.pr1nm = prdName;
      if (prdCtg) params.pr1ca = prdCtg;
      if (prdBrand) params.pr1br = prdBrand;
      if (prdVar) params.pr1va = prdVar;
      if (prdPrice) params.pr1pr = prdPrice;
      if (prdQty) params.pr1qt = prdQty;
      return this.send('pageview', params, clientID);
    }
    /**
     * Send a "checkout_option" request
     * @param  {string} evCategory   Event category
     * @param  {string} evAction     Event action
     * @param  {string} checkoutStep Checkout step
     * @param  {string} checkoutOpt  Checkout step option
     * @param  {string} clientID     uuidV4
     * @return {Promise}
     */

  }, {
    key: "checkoutOpt",
    value: function checkoutOpt(evCategory, evAction, checkoutStep, _checkoutOpt, clientID) {
      var params = {
        ec: evCategory,
        ea: evAction,
        pa: 'checkout_option'
      };
      if (checkoutStep) params.cos = checkoutStep;
      if (_checkoutOpt) params.col = _checkoutOpt;
      return this.send('event', params, clientID);
    }
    /**
     *
     * @param {*} hostname
     * @param {*} url
     * @param {*} title
     * @param {*} param3
     * @param {*} clientID
     */

  }, {
    key: "promoImp",
    value: function promoImp(hostname, url, title) {
      var _ref7 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          promoID = _ref7.promoID,
          promoName = _ref7.promoName,
          promoCrt = _ref7.promoCrt,
          promoPos = _ref7.promoPos;

      var clientID = arguments.length > 4 ? arguments[4] : undefined;
      var params = {
        dh: hostname,
        dp: url,
        dt: title
      };
      if (promoID) params.promo1id = promoID;
      if (promoName) params.promo1nm = promoName;
      if (promoCrt) params.promo1cr = promoCrt;
      if (promoPos) params.promo1ps = promoPos;
      return this.send('pageview', params, clientID);
    }
    /**
     *
     * @param {*} evCategory
     * @param {*} evAction
     * @param {*} param2
     * @param {*} clientID
     */

  }, {
    key: "promoCk",
    value: function promoCk(evCategory, evAction) {
      var _ref8 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          evLabel = _ref8.evLabel,
          promoID = _ref8.promoID,
          promoName = _ref8.promoName,
          promoCrt = _ref8.promoCrt,
          promoPos = _ref8.promoPos;

      var clientID = arguments.length > 3 ? arguments[3] : undefined;
      var params = {
        ec: evCategory,
        ea: evAction,
        promos: 'click'
      };
      if (evLabel) params.el = evLabel;
      if (promoID) params.promo1id = promoID;
      if (promoName) params.promo1nm = promoName;
      if (promoCrt) params.promo1cr = promoCrt;
      if (promoPos) params.promo1ps = promoPos;
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
    key: "item",
    value: function item(trnID, itemName) {
      var _ref9 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          itemPrice = _ref9.itemPrice,
          itemQty = _ref9.itemQty,
          itemSku = _ref9.itemSku,
          itemVariation = _ref9.itemVariation,
          currCode = _ref9.currCode;

      var clientID = arguments.length > 3 ? arguments[3] : undefined;
      var params = {
        ti: trnID,
        "in": itemName
      };
      if (itemPrice) params.ip = itemPrice;
      if (itemQty) params.iq = itemQty;
      if (itemSku) params.ic = itemSku;
      if (itemVariation) params.iv = itemVariation;
      if (currCode) params.cu = currCode;
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
    key: "timingTrk",
    value: function timingTrk(timingCtg, timingVar, timingTime) {
      var _ref10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          timingLbl = _ref10.timingLbl,
          dns = _ref10.dns,
          pageDownTime = _ref10.pageDownTime,
          redirTime = _ref10.redirTime,
          tcpConnTime = _ref10.tcpConnTime,
          serverResTime = _ref10.serverResTime;

      var clientID = arguments.length > 4 ? arguments[4] : undefined;
      var params = {
        utc: timingCtg,
        utv: timingVar,
        utt: timingTime
      };
      if (timingLbl) params.utl = timingLbl;
      if (dns) params.dns = dns;
      if (pageDownTime) params.pdt = pageDownTime;
      if (redirTime) params.rrt = redirTime;
      if (tcpConnTime) params.tcp = tcpConnTime;
      if (serverResTime) params.srt = serverResTime;
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
    key: "send",
    value: function send(hitType, params, clientID) {
      var _this = this;

      var formObj = {
        v: this.globalVersion,
        tid: this.globalTrackingID,
        cid: clientID || (0, _uuid.v4)(),
        t: hitType
      };
      if (params) Object.assign(formObj, params);

      if (Object.keys(this.customParams).length > 0) {
        Object.assign(formObj, this.customParams);
      }

      var url = "".concat(this.globalBaseURL).concat(this.globalCollectURL);

      if (this.globalDebug) {
        url = "".concat(this.globalBaseURL).concat(this.globalDebugURL).concat(this.globalCollectURL);
      }

      var reqObj = {
        method: 'post',
        body: Object.keys(formObj).map(function (key) {
          return "".concat(encodeURI(key), "=").concat(encodeURI(formObj[key]));
        }).join('&')
      };

      if (this.globalUserAgent !== '') {
        reqObj.headers = {
          'User-Agent': this.globalUserAgent
        };
      }

      return (0, _electronFetch["default"])(url, reqObj).then(function (res) {
        var response = {};

        if (res.headers.get('content-type') !== 'image/gif') {
          response = res.json();
        } else {
          response = res.text();
        }

        if (res.status === 200) {
          return response;
        }

        return Promise.reject(new Error(response));
      }).then(function (json) {
        if (_this.globalDebug) {
          if (json.hitParsingResult[0].valid) {
            return {
              clientID: formObj.cid
            };
          }
        }

        return {
          clientID: formObj.cid
        };
      })["catch"](function (err) {
        return new Error(err);
      });
    }
  }]);

  return Analytics;
}();

var _default = Analytics;
exports["default"] = _default;