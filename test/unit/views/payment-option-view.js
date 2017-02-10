'use strict';

var BaseView = require('../../../src/views/base-view');
var PaymentOptionView = require('../../../src/views/payment-option-view');
var paymentOptionHTML = require('../../../src/html/payment-option.html');
var strings = require('../../../src/translations/en');

describe('PaymentOptionView', function () {
  beforeEach(function () {
    this.div = document.createElement('div');
    this.div.innerHTML = paymentOptionHTML;
    document.body.appendChild(this.div);
  });

  describe('Constructor', function () {
    beforeEach(function () {
      this.sandbox.stub(PaymentOptionView.prototype, '_initialize');
    });

    it('inherits from BaseView', function () {
      expect(new PaymentOptionView({})).to.be.an.instanceof(BaseView);
    });

    it('calls _initialize', function () {
      new PaymentOptionView({}); // eslint-disable-line no-new

      expect(PaymentOptionView.prototype._initialize).to.have.been.calledOnce;
    });
  });

  describe('_initialize', function () {
    beforeEach(function () {
      this.context = {
        strings: strings
      };
    });

    it('sets the inner HTML correctly when the paymentOption is a credit card', function () {
      var iconElement, iconContainer, labelElement;
      var paymentOptionID = 'card';

      this.context.paymentOptionID = paymentOptionID;

      PaymentOptionView.prototype._initialize.call(this.context);

      iconElement = this.context.element.querySelector('.braintree-option__logo use');
      iconContainer = this.context.element.querySelector('.braintree-option__logo svg');
      labelElement = this.context.element.querySelector('.braintree-option__label');

      expect(iconElement.getAttribute('xlink:href')).to.equal('#iconCardFront');
      expect(labelElement.textContent).to.contain(strings.Card);
      expect(iconContainer.classList.contains('braintree-icon--bordered')).to.be.true;
    });

    it('sets the inner HTML correctly when the paymentOption is PayPal', function () {
      var iconElement, labelElement;
      var paymentOptionID = 'paypal';

      this.context.paymentOptionID = paymentOptionID;

      PaymentOptionView.prototype._initialize.call(this.context);

      iconElement = this.context.element.querySelector('.braintree-option__logo use');
      labelElement = this.context.element.querySelector('.braintree-option__label');

      expect(iconElement.getAttribute('xlink:href')).to.equal('#logoPayPal');
      expect(labelElement.textContent).to.contain(strings.PayPal);
    });
  });

  describe('setActive', function () {
    it('calls the callback if one exists', function (done) {
      var paymentOptionView = new PaymentOptionView({});

      paymentOptionView.setActive(true, function () {
        done();
      });
    });
  });
});
