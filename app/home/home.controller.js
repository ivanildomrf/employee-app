(function () {
    'use strict';

    angular
        .module('appHome', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/home', {
                templateUrl: 'home/home.view.html',
                controller: 'HomeController'
            });
        }])
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'AuthenticationService', '$rootScope', '$location'];
    function HomeController(UserService, AuthenticationService, $rootScope, $location) {
        var vm = this;

        vm.user = null;
        vm.allTeams = [];
        vm.allEmployees = [];
        vm.createTeam = createTeam;
        vm.createEmployee = createEmployee;

        initController();

        function initController() {
            loadCurrentUser();
            loadAllTeams();
            loadAllEmployees();
        };

        function getBaseURL() {
            return $location.protocol() + "://" + $location.host() + ":8080";
        };        

        function loadCurrentUser() {

            var url = getBaseURL();

            AuthenticationService.GetUserByUsername($rootScope.id, url, function (response) {

                if (response.success) {
                    var user = { firstName: response.firstName };
                    vm.user = user;
                } else {
                    FlashService.Error(response.message);
                }

            });

        };

        function createTeam() {

            vm.dataLoading = true;

            var url = getBaseURL();
            
            AuthenticationService.CreateTeam(vm.name, url, function (response) {                
                if (response.success) {
                    loadAllTeams();
                    FlashService.Success(response.message);
                } else {
                    FlashService.Error(response.message);
                }

            });

            vm.dataLoading = false;
        };        

        function loadAllTeams() {

            var url = getBaseURL();

            AuthenticationService.LoadAllTeams(url, function (response) {

                vm.allTeams = [];

                if (response.success) {
                   vm.allTeams = response.data;
                } else {
                    FlashService.Error(response.message);
                }

            });
        };

        function createEmployee() {

            vm.dataLoading = true;

            var url = getBaseURL();

            var employee = {
                name: vm.nameEmpl,
                birthDate: vm.birthDate,
                street: vm.street,
                homeNumber: vm.homeNumber,
                complement: vm.complement,
                neighborhood: vm.neighborhood,
                city: vm.city,
                state: vm.state,
                hiringDate: vm.hiringDate,
                teamName: vm.teamName
            };
            
            AuthenticationService.CreateEmployee(employee, url, function (response) {                
                if (response.success) {
                    loadAllEmployees();
                    FlashService.Success(response.message);
                } else {
                    console.log('Message fail: '+ response.message);
                    FlashService.Error(response.message);
                }

            });

            vm.dataLoading = false;
        };          

        function loadAllEmployees() {

            var url = getBaseURL();

            AuthenticationService.LoadAllEmployees(url, function (response) {

                vm.allEmployees = [];

                if (response.success) {
                   vm.allEmployees = response.data;
                } else {
                    FlashService.Error(response.message);
                }

            });            
        };   
    }

})();