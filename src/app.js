/// <reference path="../typings/tsd.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var app = angular.module('app', ['ngRoute']);
var values = [];
for (var i = 0; i < 10000; i++) {
    values.push(i.toString());
}
var BaseController = (function () {
    function BaseController() {
    }
    BaseController.prototype.getValue = function () {
        return 'true';
    };
    return BaseController;
})();
var HomeController = (function (_super) {
    __extends(HomeController, _super);
    function HomeController(homeScope, getWatchCount) {
        _super.call(this);
        var clickCount = 0;
        homeScope.name = "test " + clickCount;
        homeScope.values = ['1']; //values;
        homeScope.handleClick = function () {
            homeScope.name = "test " + ++clickCount;
            homeScope.values[10] = 'test';
        };
        //		console.log(this.getValue());
        homeScope.$watch(function () { return getWatchCount(); }, function (newValue) {
            //				console.log(newValue);
            homeScope.watchCount = newValue;
        });
    }
    HomeController.prototype.getValue = function () {
        return this.test;
    };
    HomeController.$inject = ['$scope', 'getWatchCount'];
    return HomeController;
})(BaseController);
HomeController.prototype.test = 'test2';
function getWatchCount() {
    return function () {
        var total = 0;
        angular.element('.ng-scope').each(function (index, element) {
            var scope = $(element).scope();
            total += scope.$$watchers ? scope.$$watchers.length : 0;
        });
        return total;
    };
}
function makeid(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
var AboutUsController = (function () {
    function AboutUsController($scope, MemoryLeakService) {
        var _this = this;
        this.largeValue = makeid(10000);
        MemoryLeakService.attach(function () {
            return _this.largeValue.length;
        });
    }
    return AboutUsController;
})();
var MemoryLeakService = (function () {
    function MemoryLeakService() {
        this.fnArray = [];
    }
    MemoryLeakService.prototype.attach = function (fn) {
        this.fnArray.push(fn);
    };
    return MemoryLeakService;
})();
app.factory('getWatchCount', getWatchCount);
app.controller('HomeController', HomeController);
app.controller('AboutUsController', AboutUsController);
app.service('MemoryLeakService', MemoryLeakService);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'HomeController.html',
        controller: 'HomeController'
    }).when('/aboutus', {
        templateUrl: 'AboutUsController.html',
        controller: 'AboutUsController'
    }).otherwise({
        redirectTo: '/home'
    });
}]);
