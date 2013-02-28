$(function(){
  var path = document.location.pathname;
  if(path.indexOf('earnings-history') > 0) {
    var input = $('<input type="text" placeholder="filter your results">');
    var ptotal = $('<p>Total</p>');
    input.bind('keyup',function(){
      var table = $('.oTable:first');
      var val = $(this).val().toLowerCase();
      var total = 0;
      table.find('tr').each(function(){
        if ($(this).text().toLowerCase().indexOf(val) < 0) {
          $(this).hide();
        }
        else { 
          $(this).show(); 
          var text = $(this).find('td:eq(4)').text().split('(')[1];
          if (typeof text != 'undefined') {
            var num = text.split(')')[0].split('$')[1];
            if (typeof num != 'undefined') {
              total += (num*100);
            }
          }
        }
      });
      var total = total/100;
      if (typeof total != NaN) {
        console.log(total);
      }
    });
    $('#main').prepend(input).prepend(ptotal);
  }
});