'use strict';

var browserDetection = require('../../../../src/lib/browser-detection');
var onTransitionEnd = require('../../../../src/lib/transition-helper').onTransitionEnd;

describe('onTransitionEnd', function () {
  it('immediately calls callback when IE9', function (done) {
    var element = document.createElement('div');

    this.sandbox.stub(browserDetection, 'isIe9').returns(true);

    onTransitionEnd(element, function () {
      done();
    });
  });

  it('calls callback after onTransitionEnd end', function (done) {
    var element = document.createElement('div');

    element.addEventListener = this.sandbox.stub().yields();
    this.sandbox.stub(browserDetection, 'isIe9').returns(false);

    onTransitionEnd(element, function () {
      done();
    });
  });
});

