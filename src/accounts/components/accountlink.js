(function () {
  'use strict';

  angular.module('Accounts')
    .component('accountLink', {
      templateUrl: 'src/accounts/templates/accountlink.component.html',
      bindings: {
        account: '<',
        month: '<',
      },
    });
})();
