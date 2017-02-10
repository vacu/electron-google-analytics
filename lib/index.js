'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');
var uuidV4 = require('uuid/v4');
var _ = require('lodash');

var Analytics = function () {
  /**
   * Class constructor
   */
  function Analytics(trackingID, _ref) {
    var _ref$userAgent = _ref.userAgent,
        userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? 1 : _ref$version;

    _classCallCheck(this, Analytics);

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


  _createClass(Analytics, [{
    key: 'pageview',
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
     * Sned a "exception" request
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
          v: _this.version,
          tid: _this.trackingID,
          cid: clientID || uuidV4(),
          t: hitType
        };
        if (params) _.extend(formObj, params);

        var url = '' + _this.baseURL + _this.collectURL;
        if (_this.debug) {
          url = '' + _this.baseURL + _this.debugURL + _this.collectURL;
        }

        var reqObj = { url: url, form: formObj };
        if (_this.userAgent !== '') {
          reqObj['headers'] = { 'User-Agent': _this.userAgent };
        }

        return request.post(reqObj, function (err, httpResponse, body) {
          if (err) return reject(err);

          if (httpResponse.statusCode === 200) {
            if (_this.debug) {
              var _bodyJson = JSON.parse(body);

              if (_bodyJson.hitParsingResult[0].valid) {
                return resolve({ clientID: formObj.cid });
              }

              return reject(_bodyJson);
            }

            return resolve({ clientID: formObj.cid });
          }

          return reject(bodyJson);
        });
      });
    }
  }]);

  return Analytics;
}();

exports.default = Analytics;