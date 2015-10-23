'use strict';

/* jasmine specs for controllers go here */
describe('Betterworks controllers', function() {
  var elem, scope;
  beforeEach(module('betterworksApps'));
  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    elem = '<progress-chart expect-val="expected" actual-val="actual"></progress-chart>';
    elem = $compile(elem)(scope);
    scope.$digest();
  }));

  describe('ChartCtrl', function(){
    it('Basic sample data test', inject(function($controller) {
        var scope = {};
        var ctrl = $controller('ChartCtrl', {$scope:scope});
        expect(scope.chartData.length).toBe(7);
    }));

    it('Produces a single chart', inject(function($controller) {
        var scope = {};
        var ctrl = $controller('ChartCtrl', {$scope:scope});
        expect(elem.find('circle').length).toEqual(1);
        var texts = elem.find('text')
        expect(texts.length).toEqual(3);
        expect(texts[0].innerHTML).toEqual('0');
        expect(texts[1].innerHTML).toEqual('%');
        expect(texts[2].innerHTML).toEqual('Progress');

        //console.log(scope.expected);
        //console.log(texts[0].innerHTML);

    }));
  });
});
