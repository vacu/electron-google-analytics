import fetch from "electron-fetch";
import { v4 as uuidv4 } from "uuid";

interface ICustomObject {
  [key: string]: string | number;
}

interface IEvent {
  evLabel?: string;
  evValue?: string;
  clientID?: string;
}

interface ITransaction {
  trnAffil?: string;
  trnRev?: string;
  trnShip?: number;
  trnTax?: number;
  currCode?: string;
}

interface IRefund {
  prdID?: string;
  prdQty?: string;
}

interface IPurchase {
  trnAffil?: string;
  trnRev?: string;
  trnTax?: number;
  trnShip?: number;
  trnCoupon?: string;
  prdID?: string;
  prdName?: string;
  prdCtg?: string;
  prdBrand?: string;
  prdVar?: string;
  prdPos?: string;
}

interface ICheckout {
  prdID?: string;
  prdName?: string;
  prdCtg?: string;
  prdBrand?: string;
  prdVar?: string;
  prdPrice?: number;
  prdQty?: number;
}

interface IPromoImp {
  promoID?: string;
  promoName?: string;
  promoCrt?: string;
  promoPos?: string;
}

interface IPromoCk extends IPromoImp {
  evLabel?: string;
}

interface IItem {
  itemPrice?: number;
  itemQty?: string;
  itemSku?: string;
  itemVariation?: string;
  currCode?: string;
}

interface ITimingTrk {
  timingLbl?: string;
  dns?: number;
  pageDownTime?: number;
  redirTime?: number;
  tcpConnTime?: number;
  serverResTime?: number;
}

class Analytics {
  private globalDebug: boolean;
  private globalUserAgent: string;
  private globalBaseURL: string;
  private globalDebugURL: string;
  private globalCollectURL: string;
  private globalBatchURL: string;
  private globalTrackingID: string;
  private globalVersion: number;
  private customParams: ICustomObject;

  /**
   * Constructor
   *
   * @param {string} trackingID
   * @param {Object} param1
   */

  constructor(
    trackingID: string,
    { userAgent = "", debug = false, version = 1 } = {}
  ) {
    // Debug
    this.globalDebug = debug;
    // User-agent
    this.globalUserAgent = userAgent;
    // Links
    this.globalBaseURL = "https://www.google-analytics.com";
    this.globalDebugURL = "/debug";
    this.globalCollectURL = "/collect";
    this.globalBatchURL = "/batch";
    // Google generated ID
    this.globalTrackingID = trackingID;
    // Google API version
    this.globalVersion = version;
    // Custom parameters
    this.customParams = {};
  }

  /**
   * Adds custom parameters to requests
   * if value is null, then parameter will be removed
   *
   * @param  {string} key     Parameter name
   * @param  {string} value   Parameter value
   */
  public set(key: string, value: string): void {
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
  public pageview(
    hostname: string,
    url: string,
    title: string,
    clientID?: string,
    sessDuration?: string
  ) {
    const params: ICustomObject = {
      dh: hostname,
      dp: url,
      dt: title,
    };

    if (typeof sessDuration !== "undefined") {
      params.sc = sessDuration;
    }

    return this.send("pageview", params, clientID);
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
  public event(
    evCategory: string,
    evAction: string,
    { evLabel, evValue, clientID }: IEvent = {}
  ) {
    const params: ICustomObject = { ec: evCategory, ea: evAction };

    if (evLabel) params.el = evLabel;
    if (evValue) params.ev = evValue;

    return this.send("event", params, clientID);
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
  public screen(
    appName: string,
    appVer: string,
    appID: string,
    appInstallerID: string,
    screenName: string,
    clientID?: string
  ) {
    const params = {
      an: appName,
      av: appVer,
      aid: appID,
      aiid: appInstallerID,
      cd: screenName,
    };

    return this.send("screenview", params, clientID);
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
  public transaction(
    trnID: string,
    { trnAffil, trnRev, trnShip, trnTax, currCode }: ITransaction = {},
    clientID?: string
  ) {
    const params: ICustomObject = { ti: trnID };

    if (trnAffil) params.ta = trnAffil;
    if (trnRev) params.tr = trnRev;
    if (trnShip) params.ts = trnShip;
    if (trnTax) params.tt = trnTax;
    if (currCode) params.cu = currCode;

    return this.send("transaction", params, clientID);
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
  public social(
    socialAction: string,
    socialNetwork: string,
    socialTarget: string,
    clientID?: string
  ) {
    const params = { sa: socialAction, sn: socialNetwork, st: socialTarget };

    return this.send("social", params, clientID);
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
  public exception(exDesc: string, exFatal: number, clientID?: string) {
    const params = { exd: exDesc, exf: exFatal };

    return this.send("exception", params, clientID);
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
  public refund(
    trnID: string,
    evCategory = "Ecommerce",
    evAction = "Refund",
    nonInteraction = 1,
    { prdID, prdQty }: IRefund = {},
    clientID?: string
  ) {
    const params: ICustomObject = {
      ec: evCategory,
      ea: evAction,
      ni: nonInteraction,
      ti: trnID,
      pa: "refund",
    };

    if (prdID) params.pr1id = prdID;
    if (prdQty) params.pr1qt = prdQty;

    return this.send("event", params, clientID);
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
  public purchase(
    hostname: string,
    url: string,
    title: string,
    transactionID: string,
    {
      trnAffil,
      trnRev,
      trnTax,
      trnShip,
      trnCoupon,
      prdID,
      prdName,
      prdCtg,
      prdBrand,
      prdVar,
      prdPos,
    }: IPurchase = {},
    clientID?: string
  ) {
    const params: ICustomObject = {
      dh: hostname,
      dp: url,
      dt: title,
      ti: transactionID,
      pa: "purchase",
    };

    // Transaction params
    if (trnAffil) params.ta = trnAffil;
    if (trnRev) params.tr = trnRev;
    if (trnTax) params.tt = trnTax;
    if (trnShip) params.ts = trnShip;
    if (trnCoupon) params.tcc = trnCoupon;
    // Product params
    if (prdID) params.pr1id = prdID;
    if (prdName) params.pr1nm = prdName;
    if (prdCtg) params.pr1ca = prdCtg;
    if (prdBrand) params.pr1br = prdBrand;
    if (prdVar) params.pr1va = prdVar;
    if (prdPos) params.pr1p = prdPos;

    return this.send("pageview", params, clientID);
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

  public checkout(
    hostname: string,
    url: string,
    title: string,
    checkoutStep: string,
    checkoutOpt: string,
    {
      prdID,
      prdName,
      prdCtg,
      prdBrand,
      prdVar,
      prdPrice,
      prdQty,
    }: ICheckout = {},
    clientID?: string
  ) {
    const params: ICustomObject = {
      dh: hostname,
      dp: url,
      dt: title,
      pa: "checkout",
      cos: checkoutStep,
      col: checkoutOpt,
    };

    if (prdID) params.pr1id = prdID;
    if (prdName) params.pr1nm = prdName;
    if (prdCtg) params.pr1ca = prdCtg;
    if (prdBrand) params.pr1br = prdBrand;
    if (prdVar) params.pr1va = prdVar;
    if (prdPrice) params.pr1pr = prdPrice;
    if (prdQty) params.pr1qt = prdQty;

    return this.send("pageview", params, clientID);
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
  public checkoutOpt(
    evCategory: string,
    evAction: string,
    checkoutStep?: string,
    checkoutOpt?: string,
    clientID?: string
  ) {
    const params: ICustomObject = {
      ec: evCategory,
      ea: evAction,
      pa: "checkout_option",
    };

    if (checkoutStep) params.cos = checkoutStep;
    if (checkoutOpt) params.col = checkoutOpt;

    return this.send("event", params, clientID);
  }

  /**
   *
   * @param {*} hostname
   * @param {*} url
   * @param {*} title
   * @param {*} param3
   * @param {*} clientID
   */
  public promoImp(
    hostname: string,
    url: string,
    title: string,
    { promoID, promoName, promoCrt, promoPos }: IPromoImp = {},
    clientID?: string
  ) {
    const params: ICustomObject = {
      dh: hostname,
      dp: url,
      dt: title,
    };

    if (promoID) params.promo1id = promoID;
    if (promoName) params.promo1nm = promoName;
    if (promoCrt) params.promo1cr = promoCrt;
    if (promoPos) params.promo1ps = promoPos;

    return this.send("pageview", params, clientID);
  }

  /**
   *
   * @param {*} evCategory
   * @param {*} evAction
   * @param {*} param2
   * @param {*} clientID
   */
  public promoCk(
    evCategory: string,
    evAction: string,
    { evLabel, promoID, promoName, promoCrt, promoPos }: IPromoCk = {},
    clientID?: string
  ) {
    const params: ICustomObject = {
      ec: evCategory,
      ea: evAction,
      promos: "click",
    };

    if (evLabel) params.el = evLabel;
    if (promoID) params.promo1id = promoID;
    if (promoName) params.promo1nm = promoName;
    if (promoCrt) params.promo1cr = promoCrt;
    if (promoPos) params.promo1ps = promoPos;

    return this.send("event", params, clientID);
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
  public item(
    trnID: string,
    itemName: string,
    { itemPrice, itemQty, itemSku, itemVariation, currCode }: IItem = {},
    clientID?: string
  ) {
    const params: ICustomObject = { ti: trnID, in: itemName };

    if (itemPrice) params.ip = itemPrice;
    if (itemQty) params.iq = itemQty;
    if (itemSku) params.ic = itemSku;
    if (itemVariation) params.iv = itemVariation;
    if (currCode) params.cu = currCode;

    return this.send("item", params, clientID);
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
  public timingTrk(
    timingCtg: string,
    timingVar: string,
    timingTime: number,
    {
      timingLbl,
      dns,
      pageDownTime,
      redirTime,
      tcpConnTime,
      serverResTime,
    }: ITimingTrk = {},
    clientID?: string
  ) {
    const params: ICustomObject = {
      utc: timingCtg,
      utv: timingVar,
      utt: timingTime,
    };

    if (timingLbl) params.utl = timingLbl;
    if (dns) params.dns = dns;
    if (pageDownTime) params.pdt = pageDownTime;
    if (redirTime) params.rrt = redirTime;
    if (tcpConnTime) params.tcp = tcpConnTime;
    if (serverResTime) params.srt = serverResTime;

    return this.send("timing", params, clientID);
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
  private send(hitType: string, params: ICustomObject, clientID?: string) {
    const formObj: ICustomObject = {
      v: this.globalVersion,
      tid: this.globalTrackingID,
      cid: clientID || uuidv4(),
      t: hitType,
    };
    if (params) Object.assign(formObj, params);

    if (Object.keys(this.customParams).length > 0) {
      Object.assign(formObj, this.customParams);
    }

    let url = `${this.globalBaseURL}${this.globalCollectURL}`;
    if (this.globalDebug) {
      url = `${this.globalBaseURL}${this.globalDebugURL}${this.globalCollectURL}`;
    }

    const reqObj = {
      method: "post",
      body: Object.keys(formObj)
        .map((key) => `${encodeURI(key)}=${encodeURI(formObj[key] as string)}`)
        .join("&"),
      headers:
        this.globalUserAgent !== ""
          ? { "User-Agent": this.globalUserAgent }
          : undefined,
    };

    return fetch(url, reqObj)
      .then((res) => {
        let response = {};

        if (res.headers.get("content-type") !== "image/gif") {
          response = res.json();
        } else {
          response = res.text();
        }

        if (res.status === 200) {
          return response;
        }

        return Promise.reject(new Error(response as string));
      })
      .then((json: any) => {
        if (this.globalDebug) {
          if (json.hitParsingResult[0].valid) {
            return { clientID: formObj.cid };
          }
        }

        return { clientID: formObj.cid };
      })
      .catch((err) => new Error(err));
  }
}

export default Analytics;
