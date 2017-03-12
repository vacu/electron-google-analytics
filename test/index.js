'use strict'
/* global describe, it */

import chai, {expect, assert} from 'chai'
import dirtyChai from 'dirty-chai'
import Analytics, {AnalyticsError} from '../src/index'

chai.use(dirtyChai)

const trackingID = process.env.TRACKING_ID || ''

describe('Analytics', function () {
  if (trackingID) {
    it('should send a pageview request', function () {
      const analytics = new Analytics({ trackingID, debug: true })
      return analytics.pageview('http://example.com', '/test', 'Test')
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a event request', function () {
      const analytics = new Analytics({ trackingID, debug: true })
      return analytics.event('category', 'view')
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a screenview request', function () {
      const analytics = new Analytics({ trackingID, debug: true, appName: 'test' })
      return analytics.screen('Test')
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a transaction request', function () {
      const analytics = new Analytics({ trackingID, debug: true })
      return analytics.transaction(123)
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a social request', function () {
      const analytics = new Analytics({ trackingID, debug: true })
      return analytics.social('like', 'facebook', 'home')
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a exception request', function () {
      const analytics = new Analytics({ trackingID, debug: true })
      return analytics.exception('IOException', 1)
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a refund request', function () {
      const analytics = new Analytics({ trackingID, debug: true })
      return analytics.refund('T123')
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a custom request', function () {
      const analytics = new Analytics({ trackingID, debug: true })
      return analytics.send('social', { sa: 'social', sn: 'facebook', st: 'home' })
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })

    it('should send a request customizing userAgent, appName, appID and appVersion', function () {
      const analytics = new Analytics({
        trackingID,
        debug: true,
        userAgent: 'test',
        appName: 'testApp',
        appID: 'com.example.test',
        appVersion: '1.0'
      })
      return analytics.send('social', { sa: 'social', sn: 'facebook', st: 'home' })
        .then((response) => {
          return expect(response).to.have.property('clientID')
        })
    })
  }

  it('should fail sending a pageview request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true })
    return analytics.pageview('http://example.com', 'test', 'test')
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })

  it('should fail sending a event request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true })
    return analytics.event('category', 'view')
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })
  it('should fail sending a screenview request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true, appName: 'test' })
    return analytics.screen('Test')
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })

  it('should fail sending a transaction request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true })
    return analytics.transaction(123)
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })

  it('should fail sending a social request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true })
    return analytics.social('like', 'facebook', 'home')
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })

  it('should fail sending a exception request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true })
    return analytics.exception('IOException', 1)
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })

  it('should fail sending a refund request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true })
    return analytics.refund('T123')
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })

  it('should fail sending a custom request', function () {
    const analytics = new Analytics({ trackingID: '', debug: true })
    return analytics.send('social', { sa: 'social', sn: 'facebook', st: 'home' })
      .then(() => assert(false))
      .catch((err) => {
        expect(err).to.be.instanceOf(AnalyticsError)
        expect(err.data).not.to.be.empty()
      })
  })
})
