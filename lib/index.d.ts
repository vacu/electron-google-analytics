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
declare class Analytics {
    private globalDebug;
    private globalUserAgent;
    private globalBaseURL;
    private globalDebugURL;
    private globalCollectURL;
    private globalBatchURL;
    private globalTrackingID;
    private globalVersion;
    private customParams;
    /**
     * Constructor
     *
     * @param {string} trackingID
     * @param {Object} param1
     */
    constructor(trackingID: string, { userAgent, debug, version }?: {
        userAgent?: string | undefined;
        debug?: boolean | undefined;
        version?: number | undefined;
    });
    /**
     * Adds custom parameters to requests
     * if value is null, then parameter will be removed
     *
     * @param  {string} key     Parameter name
     * @param  {string} value   Parameter value
     */
    set(key: string, value: string): void;
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
    pageview(hostname: string, url: string, title: string, clientID?: string, sessDuration?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    event(evCategory: string, evAction: string, { evLabel, evValue, clientID }?: IEvent): Promise<Error | {
        clientID: string | number;
    }>;
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
    screen(appName: string, appVer: string, appID: string, appInstallerID: string, screenName: string, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    transaction(trnID: string, { trnAffil, trnRev, trnShip, trnTax, currCode }?: ITransaction, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    social(socialAction: string, socialNetwork: string, socialTarget: string, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
    /**
     * Send a "exception" request
     *
     * @param  {string} exDesc   Exception description
     * @param  {Number} exFatal  Exception is fatal?
     * @param  {string} clientID uuidV4
     *
     * @return {Promise}
     */
    exception(exDesc: string, exFatal: number, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    refund(trnID: string, evCategory?: string, evAction?: string, nonInteraction?: number, { prdID, prdQty }?: IRefund, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    purchase(hostname: string, url: string, title: string, transactionID: string, { trnAffil, trnRev, trnTax, trnShip, trnCoupon, prdID, prdName, prdCtg, prdBrand, prdVar, prdPos, }?: IPurchase, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    checkout(hostname: string, url: string, title: string, checkoutStep: string, checkoutOpt: string, { prdID, prdName, prdCtg, prdBrand, prdVar, prdPrice, prdQty, }?: ICheckout, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
    /**
     * Send a "checkout_option" request
     * @param  {string} evCategory   Event category
     * @param  {string} evAction     Event action
     * @param  {string} checkoutStep Checkout step
     * @param  {string} checkoutOpt  Checkout step option
     * @param  {string} clientID     uuidV4
     * @return {Promise}
     */
    checkoutOpt(evCategory: string, evAction: string, checkoutStep?: string, checkoutOpt?: string, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
    /**
     *
     * @param {*} hostname
     * @param {*} url
     * @param {*} title
     * @param {*} param3
     * @param {*} clientID
     */
    promoImp(hostname: string, url: string, title: string, { promoID, promoName, promoCrt, promoPos }?: IPromoImp, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
    /**
     *
     * @param {*} evCategory
     * @param {*} evAction
     * @param {*} param2
     * @param {*} clientID
     */
    promoCk(evCategory: string, evAction: string, { evLabel, promoID, promoName, promoCrt, promoPos }?: IPromoCk, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    item(trnID: string, itemName: string, { itemPrice, itemQty, itemSku, itemVariation, currCode }?: IItem, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
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
    timingTrk(timingCtg: string, timingVar: string, timingTime: number, { timingLbl, dns, pageDownTime, redirTime, tcpConnTime, serverResTime, }?: ITimingTrk, clientID?: string): Promise<Error | {
        clientID: string | number;
    }>;
    /**
     * Send a request to google-analytics
     *
     * @param  {string} hitType  Hit type
     * @param  {string} clientID Unique identifier (uuidV4)
     * @param  {Object} params   Options
     *
     * @return {Promise}
     */
    private send;
}
export default Analytics;
