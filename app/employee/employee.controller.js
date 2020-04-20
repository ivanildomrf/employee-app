(function () {
    'use strict';

    angular
        .module('appEmployee', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/employee', {
                templateUrl: 'employee/employee.view.html',
                controller: 'EmployeeController'
            });
        }])
        .controller('EmployeeController', EmployeeController);

    EmployeeController.$inject = ['UserService', '$rootScope'];
    function EmployeeController(UserService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            console.log('Init controller: ' + $rootScope.globals.currentUser.username);
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            console.log('Current user: ' + $rootScope.globals.currentUser.username);


            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
                .then(function () {
                    loadAllUsers();
                });
        }
    }

})();