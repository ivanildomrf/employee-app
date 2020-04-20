(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', 'HomeService', '$rootScope'];
    function HomeController(UserService, HomeService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            console.log('Init controller: '+$rootScope.globals.currentUser.username);
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            console.log('Current user: '+$rootScope.globals.currentUser.username);
            
            HomeService.GetAll();
            /*UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });*/
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