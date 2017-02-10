'use strict';

var analytics = require('../lib/analytics');
var BaseView = require('./base-view');
var classlist = require('../lib/classlist');
var PaymentOptionView = require('./payment-option-view');
var transitionHelper = require('../lib/transition-helper');

function PaymentOptionsView() {
  BaseView.apply(this, arguments);

  this._initialize();
}

PaymentOptionsView.prototype = Object.create(BaseView.prototype);
PaymentOptionsView.prototype.constructor = PaymentOptionsView;
PaymentOptionsView.ID = PaymentOptionsView.prototype.ID = 'options';

PaymentOptionsView.prototype._initialize = function () {
  this.views = [];
  this.container = this.getElementById('payment-options-container');

  this.model.on('changeActivePaymentOption', this._changeActivePaymentOption.bind(this));

  this.model.supportedPaymentOptions.forEach(function (paymentOptionID) {
    this._addPaymentOption(paymentOptionID);
  }.bind(this));
};

PaymentOptionsView.prototype._addPaymentOption = function (paymentOptionID) {
  var paymentOptionView = new PaymentOptionView({
    model: this.model,
    paymentOptionID: paymentOptionID,
    strings: this.strings
  });

  this.views.push(paymentOptionView);
  this.container.appendChild(paymentOptionView.element);
};

PaymentOptionsView.prototype._changeActivePaymentOption = function (paymentOptionID) {
  var i, optionView;
  var self = this;

  for (i = 0; i < self.views.length; i++) {
    optionView = self.views[i];

    if (self.views[i].paymentOptionID === paymentOptionID) {
      self.activeOptionView = optionView;
    } else {
      optionView.setActive(false);
    }
  }

  self.activeOptionView.setActive(true, function () {
    classlist.add(self.element, 'braintree-options--option-selected');

    transitionHelper.onTransitionEnd(self.element, function () {
      self.mainView.setPrimaryView(paymentOptionID);
      classlist.remove(self.element, 'braintree-options--option-selected');
    });
  });

  analytics.sendEvent(self.client, 'selected.' + paymentOptionID);
};

module.exports = PaymentOptionsView;
