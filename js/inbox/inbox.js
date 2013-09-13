function inbox() {
  var inbox  = $('<div class="inbox-content"></div>'),
      notify = $('<div class="notify-content"></div>');
  $('#main').children().wrapAll(inbox);
  var cache = $('<div></div>');
  cache.load('/notifications #main',function(){
    var notifications = cache.find('#main .oLayout:first');
    notifications.appendTo('#main').wrap(notify);
    var h = $('.notify-content').height();
    var ih = $('.inbox-content').height();
    if (h < ih) { $('.notify-content').css('height',ih); }
  });
}
function notify() {
  var button = $('<button class="delete">Delete</button>');
  $('body #main .oLayoutLeftNav h1').after(button);
  button.bind('click',function(){
    $('.toggle').each(function(){
      if ($(this).attr('checked') == 'checked') {
        $(this).next().trigger('click');
      }
    });
    checkLoading();
  });
  $('table.oTableLite tr').each(function(){
    var checkbox = $('<input type="checkbox" class="toggle">');
    $(this).find('td:first').prepend(checkbox);
  });
}
function checkLoading() {
}
$(function(){
  if ($('body #mcNewMessage').size() > 0) { inbox(); }
  if ($('body #main .oLayoutLeftNav h1').text() == 'Notifications') { notify(); }
});