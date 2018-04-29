(function ()
{
  'use strict';

  angular.module('Accounts')
    .service('UtilsService', UtilsService);

  let date_re  = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
  let monthNames = ['month 0',
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];

  function UtilsService()
  {
    let service = this;

    service.parseSQLDate = function(sqlDate)
    {
      let matchInfo = date_re.exec(sqlDate);
      if (matchInfo)
      {
        let year        = parseInt(matchInfo[1]);
        let monthNumber = parseInt(matchInfo[2]);
        let dayNumber   = parseInt(matchInfo[3]);
        let monthName   = 'month ' + monthNumber;

        if (1 <= monthNumber && monthNumber <= 12)
          monthName = monthNames[monthNumber];

        return {
          year:year, monthNumber:monthNumber, dayNumber:dayNumber, monthName:monthName
        };
      }

      return null;
    };
  }
})();
