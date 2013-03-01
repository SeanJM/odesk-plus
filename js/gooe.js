var gooe = {};

gooe.expander = function (el) {
  el.find('.expander-btn').each(function (){
    $(this).unbind('click');
    $(this).bind('click',function (e){
      $(this).closest('.expander').toggleClass('gactive');
      e.stopPropagation();
    });
  });
  
  el.find('.expander-trigger').each(function (){
    if ($(this).attr('type') == 'radio') {
      var name         = $(this).attr('name'),
          expander     = $(this).closest('.expander'),
          radioTrigger = expander.find('input[name="' + name + '"].expander-trigger');

      expander.find('[name="' + name + '"]').each(function () {
        $(this).unbind('click');
        $(this).bind('click',function (e){
          if (radioTrigger.is(':checked')) { expander.addClass('gactive'); }
          else { expander.removeClass('gactive'); }
          e.stopPropagation();
        });
      });

    }
    
    else {
      $(this).unbind('click'); 
      $(this).bind('click',function (e) { 
        $(this).closest('.expander').toggleClass('gactive');
        e.stopPropagation();
      });
    }
  
  });
}

gooe.dropdown = function (el) {
  el.find('.dropdown-trigger').each(function (e) {
    $(this).bind('click',function (event) {
      if ($(event.target).parents('.dropdown-menu').size() < 1) {
        $(this).closest('.dropdown').toggleClass('gactive');
      }
    });
  });
}

gooe.init = function (el) {
  gooe.dropdown(el);
  gooe.expander(el);
}

gooe.offClick = function () {
  $('html').bind('click',function (event) {
    if ($(event.target).closest('.gactive').size() < 1) {
      $('.gactive').removeClass('gactive');
    }
  });
}

$(function () { gooe.offClick(); });