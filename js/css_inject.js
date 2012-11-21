$(function(){
  if ($('body #main .oLayoutLeftNav h1').text() == 'Notifications') {
    $('body').addClass('notify');
  }
  if ($('body #mcNewMessage').size() > 0) {
    $('body').addClass('inbox');
  }
});