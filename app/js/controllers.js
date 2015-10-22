'use strict';

/* Controllers */

var ctrl = angular.module('betterworksControllers', []);
ctrl.controller('ChartCtrl', function($scope) {
    $scope.chartData = [
        {'expected': 0.5, 'actual': 0.5},
        {'expected': 0.1, 'actual': 1},
        {'expected': 2, 'actual': -3},
    ];
    $scope.expected = Math.round(Math.random() * 100) / 100;
    $scope.actual = Math.round(Math.random() * 100) / 100;
});

ctrl.directive("progressChart", function() {
    return {
        restrict: "E",
        link: function(scope, elem, attrs) {
            var radius = 45;
            var pi = Math.PI;
            var chart = d3.select(elem[0]);
            var svg = chart.append("svg").attr("width", "200px").attr("height", "200px");
            var group = svg.append("g").attr('transform', 'translate(100,100)');
            var circle = group.append("circle").attr("class", "progressCircle").attr("r", radius);

            // Render the outer arc
            var actualArc = d3.svg.arc().innerRadius(radius + 17).outerRadius(radius + 11).cornerRadius(5).startAngle(0);
            var actualPath = group.append('path').datum({endAngle: 1e-6}).attr('fill', "#77C000").attr('d', actualArc);

            // Render the inner arc
            var expectArc = d3.svg.arc().innerRadius(radius + 9).outerRadius(radius + 6).cornerRadius(5).startAngle(0);
            var expectPath = group.append('path').datum({endAngle: 1e-6}).attr('fill', "#c4e493").attr('d', expectArc);

            // Render the XX% Progress text
            var text = group.append("text").attr('class', 'actualText')
                                           .attr('dx', '-0.3em')
                                           .text(0)
                                           .transition()
                                           .duration(1000)
                                           .tween("text", function(d) {
                                                var i = d3.interpolate(this.textContent, 100 * attrs.actual);
                                                return function(t) {
                                                    this.textContent = Math.round(i(t));
                                                };
                                            });
            group.append("text").text("%").attr('class', 'percentText').attr('dx', '1.5em');
            group.append("text").text("Progress").attr('class', 'progressText').attr('dy', '1.1em');

            expectPath.transition().call(arcTween, expectArc, attrs.expected);
            actualPath.transition().call(arcTween, actualArc, attrs.actual);

            function arcTween(transition, arc, newVal) {
                transition.duration(1000).attrTween("d", function(d) {
                    var interpolate = d3.interpolate(d.endAngle, 1e-6 + pi * 2 * newVal);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                });
                transition.attrTween("fill", function(d) {
                    var interpolate = d3.interpolateHsl('#D00', '#0D0');
                    return function(t) {
                        return interpolate(newVal);
                    };
                });
            };
        }
    };
});
