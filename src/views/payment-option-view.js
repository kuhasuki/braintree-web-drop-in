'use strict';

var BaseView = require('./base-view');
var classlist = require('../lib/classlist');
var paymentOptionIDs = require('../constants').paymentOptionIDs;
var paymentMethodOptionHTML = require('../html/payment-option.html');
var transitionHelper = require('../lib/transition-helper');

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
      html = html.replace(/@OPTION_ID/g, 'option-card');
      html = html.replace(/@OPTION_TITLE/g, this.strings.Card);
      html = html.replace(/@CLASSNAME/g, 'braintree-icon--bordered');
      break;
    case paymentOptionIDs.paypal:
      html = html.replace(/@ICON/g, 'logoPayPal');
      html = html.replace(/@OPTION_ID/g, 'option-paypal');
      html = html.replace(/@OPTION_TITLE/g, this.strings.PayPal);
      html = html.replace(/@CLASSNAME/g, '');
      break;
    default:
      break;
  }

  this.element.innerHTML = html;
};

PaymentOptionView.prototype.setActive = function (active, callback) {
  var self = this;
  var transitionClass = active ? 'braintree-option--selected' : 'braintree-option--unselected';

  classlist.add(this.element, transitionClass);
  transitionHelper.onTransitionEnd(self.element, function () {
    classlist.remove(self.element, transitionClass);
    if (callback) {  // TODO: is a function
      callback();
    }
  });
};

module.exports = PaymentOptionView;
