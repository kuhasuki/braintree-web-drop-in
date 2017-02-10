'use strict';

var analytics = require('../../../src/lib/analytics');
var BaseView = require('../../../src/views/base-view');
var CardView = require('../../../src/views/payment-sheet-views/card-view');
var DropinModel = require('../../../src/dropin-model');
var fake = require('../../helpers/fake');
var mainHTML = require('../../../src/html/main.html');
var PaymentOptionsView = require('../../../src/views/payment-options-view');
var strings = require('../../../src/translations/en');
var transitionHelper = require('../../../src/lib/transition-helper');

describe('PaymentOptionsView', function () {
  beforeEach(function () {
    this.wrapper = document.createElement('div');
    this.wrapper.innerHTML = mainHTML;
    this.element = this.wrapper.querySelector('[data-braintree-id="' + PaymentOptionsView.ID + '"]');
    this.client = {
      getConfiguration: fake.configuration,
      request: function () {},
      _request: function () {}
    };
  });

  describe('Constructor', function () {
    beforeEach(function () {
      this.sandbox.stub(PaymentOptionsView.prototype, '_initialize');
    });

    it('inherits from BaseView', function () {
      expect(new PaymentOptionsView({})).to.be.an.instanceof(BaseView);
    });

    it('calls _initialize', function () {
      new PaymentOptionsView({}); // eslint-disable-line no-new

      expect(PaymentOptionsView.prototype._initialize).to.have.been.calledOnce;
    });
  });

  describe('_initialize', function () {
    it('adds a Card option', function () {
      var paymentOptionsView = new PaymentOptionsView({
        client: this.client,
        element: this.element,
        mainView: {},
        model: modelThatSupports(['card']),
        strings: strings
      });
      var label = paymentOptionsView.container.querySelector('.braintree-option__label');
      var icon = paymentOptionsView.container.querySelector('use');
      var iconContainer = icon.parentElement;

      expect(label.innerHTML).to.equal(strings.Card);
      expect(icon.href.baseVal).to.equal('#iconCardFront');
      expect(iconContainer.classList.contains('braintree-icon--bordered')).to.be.true;
    });

    it('adds a PayPal option', function () {
      var paymentOptionsView = new PaymentOptionsView({
        client: this.client,
        element: this.element,
        mainView: {},
        model: modelThatSupports(['paypal']),
        strings: strings
      });
      var label = paymentOptionsView.container.querySelector('.braintree-option__label');
      var icon = paymentOptionsView.container.querySelector('use');
      var iconContainer = icon.parentElement.parentElement;

      expect(label.innerHTML).to.equal(strings.PayPal);
      expect(icon.href.baseVal).to.equal('#logoPayPal');
      expect(iconContainer.classList.contains('braintree-option__logo@CLASSNAME')).to.be.false;
    });
  });

  describe('_changeActivePaymentOption', function () {
    it('sets the primary view to the payment option when clicked', function () {
      var mainViewStub = {setPrimaryView: this.sandbox.stub()};
      var paymentOptionsView = new PaymentOptionsView({
        client: this.client,
        element: this.element,
        mainView: mainViewStub,
        model: modelThatSupports(['card']),
        strings: strings
      });
      var option = paymentOptionsView.container.querySelector('.braintree-option');

      this.sandbox.stub(transitionHelper, 'onTransitionEnd').yields();

      option.click();

      expect(mainViewStub.setPrimaryView).to.have.been.calledWith(CardView.ID);
    });
  });

  describe('_changeActivePaymentOption', function () {
    it('adds the braintree-options--option-selected class when an option is selected', function (done) {
      var mainViewStub = {setPrimaryView: this.sandbox.stub()};
      var paymentOptionsView = new PaymentOptionsView({
        client: this.client,
        element: this.element,
        mainView: mainViewStub,
        model: modelThatSupports(['card']),
        strings: strings
      });
      var option = paymentOptionsView.container.querySelector('.braintree-option');
      var options = paymentOptionsView.element;

      this.sandbox.stub(transitionHelper, 'onTransitionEnd', function () {
        expect(options.classList.contains('braintree-options--option-selected')).to.be.true;

        done();
      });

      option.click();
    });

    it('removes the braintree-options--option-selected class after transistionend', function () {
      var clock = sinon.useFakeTimers();
      var mainViewStub = {
        setPrimaryView: this.sandbox.stub()
      };
      var paymentOptionsView = new PaymentOptionsView({
        client: this.client,
        element: this.element,
        mainView: mainViewStub,
        model: modelThatSupports(['card']),
        strings: strings
      });
      var option = paymentOptionsView.container.querySelector('.braintree-option');
      var options = paymentOptionsView.element;

      this.sandbox.stub(transitionHelper, 'onTransitionEnd').yields();

      option.click();

      expect(options.classList.contains('braintree-options--option-selected')).to.be.false;

      clock.restore();
    });
  });

  describe('sends analytics events', function () {
    var viewConfiguration;

    beforeEach(function () {
      viewConfiguration = {
        client: this.client,
        element: this.element,
        mainView: {setPrimaryView: this.sandbox.stub()},
        strings: strings
      };
    });

    it('when the Card option is selected', function () {
      var option, paymentOptionsView;
      var model = modelThatSupports(['card']);

      this.sandbox.stub(analytics, 'sendEvent');

      viewConfiguration.model = model;
      paymentOptionsView = new PaymentOptionsView(viewConfiguration);
      option = paymentOptionsView.container.querySelector('.braintree-option');

      option.click();

      expect(analytics.sendEvent).to.have.been.calledWith(paymentOptionsView.client, 'selected.card');
    });

    it('when the PayPal option is selected', function () {
      var option, paymentOptionsView;
      var model = modelThatSupports(['paypal']);

      this.sandbox.stub(analytics, 'sendEvent');

      viewConfiguration.model = model;
      paymentOptionsView = new PaymentOptionsView(viewConfiguration);
      option = paymentOptionsView.container.querySelector('.braintree-option');

      option.click();

      expect(analytics.sendEvent).to.have.been.calledWith(paymentOptionsView.client, 'selected.paypal');
    });
  });
});

function modelThatSupports(supportedPaymentOptions) {
  var result = new DropinModel(fake.modelOptions());

  result.supportedPaymentOptions = supportedPaymentOptions;

  return result;
}
