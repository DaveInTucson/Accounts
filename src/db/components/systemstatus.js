(function ()
{
  'use strict';

  angular.module('DB')
    .component('systemStatus', {
      templateUrl: 'src/db/templates/systemstatus.component.html',
      controller: SystemStatusComponentController,
    });


  function makeErrorStatus(status, context, info)
  {
      if (status !== 'error')
        return 'unexpected status ' + status + ' reported by ' + context;

      if (info)
      {
        if (info.status && info.statusText)
          return context + ": " + info.status + ' ' + info.statusText;

        return context + ' error: ' + info;
      }

      return context + ' reported an error with no info';
  }

  SystemStatusComponentController.$inject = ['DBStatusService'];
  function SystemStatusComponentController(DBStatusService)
  {
    let $ctrl = this;
    $ctrl.currentStatus = 'loaded, awaiting events';
    $ctrl.systemErrors = [];

    // status: loading, success, error
    // context, info
    let cancelFn = DBStatusService.onStatus(function (event, data)
    {
      //console.log('in onStatus, data=', data);
      if (data.status === 'loading')
        $ctrl.currentStatus = 'calling ' + data.context;
      else if (data.status == 'success')
        $ctrl.currentStatus = 'ready';
      else
      {
          $ctrl.currentStatus = makeErrorStatus(data.status, data.context, data.info)
          $ctrl.systemErrors.push({ message:$ctrl.currentStatus});
      }
    });

    $ctrl.$onDestroy = function()
    { cancelFn(); }
  }
})();
