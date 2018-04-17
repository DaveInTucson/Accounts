(function ()
{
  'use strict';

  angular.module('Accounts')
    .component('money', {
      templateUrl: 'src/accounts/templates/moneycomponent.html',
      bindings: {
        amount: '@',
      },
    });


})();
