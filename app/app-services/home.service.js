(function () {
    'use strict';

    angular
        .module('app')
        .factory('HomeService', HomeService);

    HomeService.$inject = ['$http', '$location', '$cookies', '$rootScope'];
    function HomeService($http, $location, $cookies, $rootScope) {
        var service = {};

        service.GetToken = GetToken;
        service.SetToken = SetToken;
        service.Login = Login;
        service.Logout = Logout;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function GetToken() {
            return localStorage.token;
        }

        function SetToken(token) {
            localStorage.token = token;
        }

        function Login(email, password, callback) {

            var resp;

            var baseUrl = $location.protocol() + "://" + $location.host() + ":8080";
            var url = baseUrl + '/api/authenticate';

            var params = {
                email: email,
                password: password
            };

            var strParams = JSON.stringify(params);

            //Call the api endpoint service
            $http.post(url, strParams, 'application/javascript').then(function (response) {
               
                if (response.data && response.status === 200) {

                    $rootScope.message = "Login efetuado com sucesso";
                    $rootScope.statusval = response.status;
                    $rootScope.statustext = response.statusText;                    
                    $rootScope.id = response.data.id;
                    $rootScope.token = response.data.token;
                    $rootScope.type = response.data.type;
                    $rootScope.username = response.data.username;
                    $rootScope.email = response.data.email;
                    $rootScope.roles = response.data.roles;
                    SetToken($rootScope.token);

                    resp = { success: true, token: $rootScope.token, type: response.type, email: $rootScope.email, username: $rootScope.username, userid: $rootScope.id };

                } else if (response.data && response.status === 401)  {
                    resp = { success: false, message: "Credenciais inválidas, tente novamente!"}; 
                } else {
                    resp = { success: false, message: "Erro inesperado, favor tente novamente em alguns minutos"}; 
                } 

                callback(resp);                

            }, function (response) {

                if (response.message !== null && response.status === 401) {
                    $rootScope.message = "Credenciais informadas são inválidas, acesso não autorizado";
                    $rootScope.statusval = response.status;
                    $rootScope.statustext = response.statusText;
                } else {
                    $rootScope.message = "Erro inesperado, favor entrar em contato com o administrador do sistema";
                    $rootScope.statusval = response.status;
                    $rootScope.statustext = response.statusText;
                }

                resp = { success: false, message: $rootScope.message, statusval: $rootScope.statusval, statustext: $rootScope.statustext };

                callback(resp);
            });
        }

        function Logout() {
            delete localStorage.token;
        }

        function SetCredentials(email, password) {
            var authdata = Base64.encode(email + ':' + password);

            var token = GetToken();

            $rootScope.globals = {
                currentUser: {
                    email: email,
                    username: email,
                    authdata: authdata,
                    token: token
                }
            };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;

            // store user details in globals cookie that keeps user logged in for 1 day (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Bearer';
        }
    }

    // Base64 encoding service used by HomeService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();