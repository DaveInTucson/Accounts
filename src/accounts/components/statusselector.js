(function ()
{
  'use strict';

  angular.module('Accounts')
    .component('statusSelector', {
      templateUrl: 'src/accounts/templates/statusselector.component.html',
      controller: StatusSelectorController,
      bindings: {
        transaction: '<',
      },
    });

  StatusSelectorController.$inject = ['AccountDBService'];
  function StatusSelectorController(AccountDBService)
  {
    let $ctrl = this;
    if ($ctrl.transaction) $ctrl.originalStatus = $ctrl.transaction.status;

    $ctrl.onChange = function()
    {
      console.log('in onChange');
      try {
        AccountDBService.updateTransactionStatus($ctrl.transaction)
        .then(function(result)
        {
          console.log('result=', result);
        })
        .catch(function(result) {
          console.log('caught result=', result)
          $ctrl.transaction = $ctrl.originalStatus;
        });
      } catch (e) {
          console.log('caught exception', e);
      }
      console.log('exiting onChange');
    }
  }
})();
