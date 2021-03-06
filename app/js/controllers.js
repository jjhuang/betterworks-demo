'use strict';

/* Controllers */

var ctrl = angular.module('betterworksControllers', []);
ctrl.controller('ChartCtrl', function($scope) {
    // Test data
    $scope.chartData = [
        {id: 1, expected: 0.5, actual: 0.25},
        {id: 2, expected: 0.1, actual: 1},
        {id: 3, expected: 2, actual: -3},
        {id: 4, expected: 0.5, actual: NaN},
        {id: 5, expected: NaN, actual: 0.35},
        {id: 6, expected: 'expected', actual: 'actual'},
        {id: 7, expected: 0.75, actual: 0.55},
        {id: 8, expected: Number.NEGATIVE_INFINITY, 'actual': Number.POSITIVE_INFINITY}
    ];

    // Controlled by input fields
    $scope.expected = Math.round(Math.random() * 100) / 100;
    $scope.actual = Math.round(Math.random() * 100) / 100;
});

ctrl.directive('progressChart', function() {
    return {
        restrict: 'E',
        require: '?ngModel',
        scope: {expectVal:'=', actualVal:'='},
        link: function(scope, elem, attrs) {
            // Constants
            var radius = 45;
            var actualBaseArcInner = 17;
            var actualBaseArcOuter = 11;
            var expectBaseArcInner = 9;
            var expectBaseArcOuter = 6;
            var pi = Math.PI;
            var endAngle = 1e-6;  // Eliminate D3 arc path JS error from 0 to 0

            var chart = d3.select(elem[0]);
            var svg = chart.append('svg').attr('class', 'svgContainer');
            var group = svg.append('g').attr('transform', 'translate(75,75)');
            var circle = group.append('circle').attr('class', 'progressCircle').attr('r', radius);

            // Render the outer arc
            var actualArc = d3.svg.arc().innerRadius(radius + actualBaseArcInner).outerRadius(radius + actualBaseArcOuter).cornerRadius(3).startAngle(0);
            var actualPath = group.append('path').datum({endAngle: endAngle}).attr('d', actualArc);

            // Render the inner arc
            var expectArc = d3.svg.arc().innerRadius(radius + expectBaseArcInner).outerRadius(radius + expectBaseArcOuter).cornerRadius(3).startAngle(0);
            var expectPath = group.append('path').datum({endAngle: endAngle}).attr('d', expectArc);

            // Render the XX% Progress text
            var text = group.append("text").attr('class', 'actualText')
                                           .attr('dx', '0.45em')
                                           .attr('dy', '5px')
                                           .text(0)
            group.append('text').text('%').attr('class', 'percentText').attr('dx', '1.5em').attr('dy', '5px');
            group.append('text').text('Progress').attr('class', 'progressText').attr('dy', '20px');

            // Update values
            update(scope.expectVal, scope.actualVal);
            scope.$watchGroup(['expectVal', 'actualVal'], function(newValue, oldValue) {
                if (newValue != oldValue) {
                    update(scope.expectVal, scope.actualVal);
                }
            });

            function update(expect, actual) {
                expect = bound(expect, 0, 1);
                actual = bound(actual, 0, 1);
                text.transition().call(textTween, actual);
                expectPath.transition().call(arcTween, expectArc, expect);
                actualPath.transition().call(arcTween, actualArc, actual);
            }

            function textTween(transition, newVal) {
                transition.duration(1000).tween('text', function(d) {
                    var i = d3.interpolate(this.textContent, 100 * newVal);
                    return function(t) {
                        this.textContent = Math.round(i(t));
                    };
                });
            }

            function arcTween(transition, arc, newVal) {
                transition.duration(1000).attrTween('d', function(d) {
                    var interpolate = d3.interpolate(d.endAngle, 1e-6 + pi * 2 * newVal);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                }).attrTween('fill', function(d) {
                    var start = document.querySelector('.colorStart');
                    var end = document.querySelector('.colorEnd');
                    var interpolate = d3.interpolateHsl(getComputedStyle(start).getPropertyValue('fill'),
                                                        getComputedStyle(end).getPropertyValue('fill'));
                    return function(t) {
                        return interpolate(newVal);
                    };
                });
            }

            function bound(num, min, max) {
                num = parseFloat(num);
                if (isNaN(num))
                    return 0;
                return Math.max(Math.min(num, max), min);
            }
        }
    };
});
