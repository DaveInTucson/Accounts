(function ()
{
  'use strict';

  angular.module('Accounts')
    .component('reloadButton', {
      templateUrl: 'src/accounts/templates/reloadbutton.component.html',
      controller: ReloadButtonComponentController,
    });

  ReloadButtonComponentController.$inject = ['$rootScope'];
  function ReloadButtonComponentController($rootScope)
  {
    let $ctrl = this;

    $ctrl.reload = function()
    {
      $rootScope.$broadcast('reloadButton:reload')
    };
  }
})();
