/// <reference path="../typings/tsd.d.ts" />

var app = angular.module('app', ['ngRoute']);

var values = [];
for (var i = 0; i < 10000; i++) {
	values.push(i.toString());
}

interface IHomeScope extends angular.IScope {
	name: string;
	values: string[];
	watchCount: number;
	handleClick: Function;
}

class BaseController {
	getValue() {
		return 'true';
	}
}


class HomeController extends BaseController {
	test: string;
	static $inject = ['$scope', 'getWatchCount'];
	constructor(homeScope: IHomeScope, getWatchCount: () => number) {
		super();
		var clickCount = 0;
		homeScope.name = `test ${clickCount}`;
		homeScope.values = ['1'];//values;
		homeScope.handleClick = () => {
				homeScope.name = `test ${++clickCount}`;
				homeScope.values[10] = 'test';
		}
//		console.log(this.getValue());
		homeScope.$watch(
			() => getWatchCount(), 
			(newValue) => {
//				console.log(newValue);
				homeScope.watchCount = newValue;
			});
	}
	
	getValue() {
		return this.test;
	}
}
HomeController.prototype.test = 'test2';

function getWatchCount() {
	return () => {
		var total = 0;
		angular.element('.ng-scope').each((index, element) => {
			var scope = (<any>$(element)).scope();
			
			total += scope.$$watchers ? scope.$$watchers.length : 0;
		});
		
		return total;
	};
}

function makeid(len)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
class AboutUsController {
	largeValue: string;
	constructor($scope: angular.IScope, MemoryLeakService: MemoryLeakService) {
		this.largeValue = makeid(10000);
		MemoryLeakService.attach(() => {
			return this.largeValue.length;
		});
	}
}

class MemoryLeakService {
	fnArray: Function[] = [];
	attach(fn: Function) {
		this.fnArray.push(fn)
	}
}

app.factory('getWatchCount', getWatchCount);
app.controller('HomeController', HomeController);
app.controller('AboutUsController', AboutUsController);
app.service('MemoryLeakService', MemoryLeakService);

app.config(['$routeProvider', function ($routeProvider: angular.route.IRouteProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'HomeController.html',
			controller: 'HomeController'
		})
		.when('/aboutus', {
			templateUrl: 'AboutUsController.html',
			controller: 'AboutUsController'
		})
		.otherwise({
			redirectTo: '/home'
		});
}]);