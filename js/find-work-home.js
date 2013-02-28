function thisWeeksEarnings() {

  var tmp = $('<div></div>');
  var timelogs = '/reports/timelogs #summary .oReportTable';
  var earnings = '/withdrawal-methods table.oDescTable .oPos';
  var keys = {};
  var header = $('header:first');

  tmp.load(timelogs,function () {
    keys['week-total'] = tmp.find('.oFinCol:last').text();
    keys['week-table'] = tmp.html();
    if (keys['week-total'].length <= 0) { keys['week-total'] = '$0.00'; }
  
    tmp = $('<div></div>');
    tmp.load(earnings,function () {
      console.log(tmp.html());
      keys['week-earnings'] = tmp.text();
      template.get({'template':'dashboard','src':dir('templates/templates.html')},function (html) {
        var processed = $(template.insert({'template':html,'keys':keys}));
        gooe.init(processed);
        processed.prependTo(header);
      });
    });
  });
};

$(function(){
  console.log('Home is loaded.');
  thisWeeksEarnings();
});