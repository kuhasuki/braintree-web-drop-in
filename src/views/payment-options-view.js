'use strict';

var analytics = require('../lib/analytics');
var BaseView = require('./base-view');
var PaymentOptionView = require('./payment-option-view');

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

  for (i = 0; i < this.views.length; i++) {
    optionView = this.views[i];

    if (this.views[i].paymentOptionID === paymentOptionID) {
      this.activeOptionView = optionView;
    } else {
      optionView.setActive(false);
    }
  }

  this.activeOptionView.setActive(true, function () {
    this.mainView.setPrimaryView(paymentOptionID);
  }.bind(this));

  analytics.sendEvent(this.client, 'selected.' + paymentOptionID);
};

module.exports = PaymentOptionsView;
