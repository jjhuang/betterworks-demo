'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
describe('BetterWorks App', function() {

  describe('index view', function() {

    beforeEach(function() {
      browser.get('app/index.html');
    });


        it('initialize', function() {
            var actualVal = element(by.model('actual'));
            var charts = element.all(by.tagName('progress-chart'));
            expect(charts.count()).toBe(9);

            var actualText = element(by.className('actualText')).getText();
            expect(actualText).toEqual(actualVal.getAttribute('value'));

            actualVal.clear();
            actualText = element(by.className('actualText')).getText();
            expect(actualText).toEqual('0');
        });
    });
});
