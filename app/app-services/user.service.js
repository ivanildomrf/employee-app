(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$location', '$rootScope'];
    function UserService($http, $location, $rootScope) {
        var service = {};

        service.GetBaseURL = GetBaseURL;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetUserByUsername = GetUserByUsername;  

        return service;

        function GetBaseURL() {
            return $location.protocol() + "://" + $location.host() + ":8080";
        };        

        function GetAll() {
            return $http.get('/api/user').then(handleSuccess, handleError('Error getting all users'));
        };

        function GetById(id) {
            return $http.get('/api/user/' + id).then(handleSuccess, handleError('Error getting user by id'));
        };

        function GetByUsername(username) {
            return $http.get('/api/user/' + username).then(handleSuccess, handleError('Error getting user by username'));
        };

        function Create(user) {
            return $http.post('/api/user', user).then(handleSuccess, handleError('Error creating user'));
        };

        function Update(user) {
            return $http.put('/api/user/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        };

        function Delete(id) {
            return $http.delete('/api/user/' + id).then(handleSuccess, handleError('Error deleting user'));
        };      

        // private functions

        function handleSuccess(response) {
            console.log('handleSuccess: ' + response.data);
            return response.data;
        };

        function handleError(error) {
            console.log('handleError: ' + error);
            return function () {
                return { success: false, message: error };
            };
        };
    };

})();