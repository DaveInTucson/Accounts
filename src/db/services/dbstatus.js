(function () {
  'use strict';

  angular.module('DB')
    .service('DBStatusService', DBStatusService);

  DBStatusService.$inject = ['$rootScope'];
  function DBStatusService($rootScope)
  {
      let $service = this;

      $service.broadcastLoading = function(clientContext)
      {
        $rootScope.$broadcast('db:status', { status: 'loading', context: clientContext });
      }

      $service.broadcastSuccess = function(clientContext)
      {
        $rootScope.$broadcast('db:status', { status: 'success', context: clientContext });
      }
      $service.broadcastError = function(clientContext, clientInfo)
      {
        $rootScope.$broadcast('db:status', { status: 'error', context: clientContext, info: clientInfo});
      }

      $service.onStatus = function(handlerFn)
      {
        return $rootScope.$on('db:status', handlerFn)
      }
  };

})();
