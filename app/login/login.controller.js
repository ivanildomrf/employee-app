(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        (function initController() {
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            
            AuthenticationService.Login(vm.email, vm.password, function (response) {                
                if (response.success) {
                    AuthenticationService.SetToken(response.token);
                    AuthenticationService.SetCredentials(vm.email, vm.password);
                    $location.path('/');
                    FlashService.Success(response.message);
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
