'use strict';

var analytics = require('../lib/analytics');
var BaseView = require('./base-view');
var classlist = require('../lib/classlist');
var paymentMethodOptionHTML = require('../html/payment-option.html');
var paymentOptionIDs = require('../constants').paymentOptionIDs;
var transitionHelper = require('../lib/transition-helper');

function PaymentOptionsView() {
  BaseView.apply(this, arguments);

  this._initialize();
}

PaymentOptionsView.prototype = Object.create(BaseView.prototype);
PaymentOptionsView.prototype.constructor = PaymentOptionsView;
PaymentOptionsView.ID = PaymentOptionsView.prototype.ID = 'options';

PaymentOptionsView.prototype._initialize = function () {
  this.container = this.getElementById('payment-options-container');

  this.model.supportedPaymentOptions.forEach(function (paymentOptionID) {
    this._addPaymentOption(paymentOptionID);
  }.bind(this));
};

PaymentOptionsView.prototype._addPaymentOption = function (paymentOptionID) {
  var self = this;
  var div = document.createElement('div');
  var html = paymentMethodOptionHTML;

  div.className = 'braintree-option';

  switch (paymentOptionID) {
    case paymentOptionIDs.card:
      html = html.replace(/@ICON/g, 'iconCardFront');
      html = html.replace(/@OPTION_TITLE/g, self.strings.Card);
      html = html.replace(/@CLASSNAME/g, 'braintree-icon--bordered');
      break;
    case paymentOptionIDs.paypal:
      html = html.replace(/@ICON/g, 'logoPayPal');
      html = html.replace(/@OPTION_TITLE/g, self.strings.PayPal);
      html = html.replace(/@CLASSNAME/g, '');
      break;
    default:
      break;
  }

  div.innerHTML = html;
  div.addEventListener('click', function () {
    classlist.add(div, 'braintree-option--active');
    transitionHelper.onTransitionEnd(div, function () {
      self.mainView.setPrimaryView(paymentOptionID);
      classlist.remove(div, 'braintree-option--active');
    });
    analytics.sendEvent(self.client, 'selected.' + paymentOptionIDs[paymentOptionID]);
  });
  self.container.appendChild(div);
};

module.exports = PaymentOptionsView;
