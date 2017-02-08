import chai from 'chai';
import Analytics from '../src/index';

const expect = chai.expect;
const trackingID = '';

describe('Analytics', function() {
  it('should fail sending a pageview request', function() {
    const analytics = new Analytics('', { debug: true });

    return analytics.pageview('http://example.com', 'test', 'test')
    .then((response) => {
      return expect(response).to.be.empty;
    }).catch((err) => {
      return expect(err).to.not.be.empty;
    });
  });

  it('should send a pageview request', function() {
    const analytics = new Analytics(trackingID, { debug: true });

    return analytics.pageview('http://example.com', 'test', 'test')
    .then((response) => {
      return expect(response).to.have.property('clientID');
    }).catch((err) => {
      return expect(err).to.be.empty;
    });
  });

  it('should send a event request', function() {
    const analytics = new Analytics(trackingID, { debug: true });

    return analytics.event('category', 'view').then((response) => {
      return expect(response).to.have.property('clientID');
    }).catch((err) => {
      return expect(err).to.be.empty;
    });
  });

  it('should fail sending a event request', function() {
    const analytics = new Analytics('', { debug: true });

    return analytics.event('category', 'view').then((response) => {
      return expect(response).to.be.empty;
    }).catch((err) => {
      return expect(err).to.not.be.empty;
    });
  });

  it('should send a screenview request', function() {
    const analytics = new Analytics(trackingID, { debug: true });

    return analytics.screen('test', '1.0.0', 'com.app.test', 'com.app.installer', 'Test')
    .then((response) => {
      return expect(response).to.have.property('clientID');
    }).catch((err) => {
      return expect(err).to.be.empty;
    });
  });

  it('should fail sending a screenview request', function() {
    const analytics = new Analytics('', { debug: true });

    return analytics.screen('test', '1.0.0', 'com.app.test', 'com.app.installer', 'Test')
    .then((response) => {
      return expect(response).to.be.empty;
    }).catch((err) => {
      return expect(err).to.not.be.empty;
    });
  });

  it('should send a custom request', function() {
    const analytics = new Analytics(trackingID, { debug: true });

    return analytics.send('social', { sa: 'social', sn: 'facebook', st: 'home' })
    .then((response) => {
      return expect(response).to.have.property('clientID');
    }).catch((err) => {
      return expect(err).to.be.empty;
    });
  });

  it('should fail sending a custom request', function() {
    const analytics = new Analytics('', { debug: true });

    return analytics.send('social', { sa: 'social', sn: 'facebook', st: 'home' })
    .then((response) => {
      return expect(response).to.be.empty;
    }).catch((err) => {
      return expect(err).to.not.be.empty;
    });
  });
});
