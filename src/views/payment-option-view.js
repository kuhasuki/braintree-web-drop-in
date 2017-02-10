'use strict';

var BaseView = require('./base-view');
var paymentOptionIDs = require('../constants').paymentOptionIDs;
var paymentMethodOptionHTML = require('../html/payment-option.html');

function PaymentOptionView() {
  BaseView.apply(this, arguments);

  this._initialize();
}

PaymentOptionView.prototype = Object.create(BaseView.prototype);
PaymentOptionView.prototype.constructor = PaymentOptionView;
PaymentOptionView.prototype._initialize = function () {
  var html = paymentMethodOptionHTML;

  this.element = document.createElement('div');
  this.element.className = 'braintree-option';
  this.element.addEventListener('click', function () {
    this.model.changeActivePaymentOption(this.paymentOptionID);
  }.bind(this));

  switch (this.paymentOptionID) {
    case paymentOptionIDs.card:
      html = html.replace(/@ICON/g, 'iconCardFront');
      html = html.replace(/@OPTION_TITLE/g, this.strings.Card);
      html = html.replace(/@CLASSNAME/g, 'braintree-icon--bordered');
      break;
    case paymentOptionIDs.paypal:
      html = html.replace(/@ICON/g, 'logoPayPal');
      html = html.replace(/@OPTION_TITLE/g, this.strings.PayPal);
      html = html.replace(/@CLASSNAME/g, '');
      break;
    default:
      break;
  }

  this.element.innerHTML = html;
};

PaymentOptionView.prototype.setActive = function (active, callback) {
  if (callback) {
    callback();
  }
};

module.exports = PaymentOptionView;
