var gooe = {};

gooe.expander = function (el) {
  el.find('.expander-btn').each(function (){
    $(this).bind('click',function (e){
      $(this).closest('.expander').toggleClass('active');
      e.stopPropagation();
    });
  });
  
  el.find('.expander-trigger').each(function (){
    if ($(this).attr('type') == 'radio') {
      var name         = $(this).attr('name'),
          expander     = $(this).closest('.expander'),
          radioTrigger = expander.find('input[name="' + name + '"].expander-trigger');

      expander.find('[name="' + name + '"]').each(function () {
        $(this).bind('click',function (e){
          if (radioTrigger.is(':checked')) { expander.addClass('active'); }
          else { expander.removeClass('active'); }
          e.stopPropagation();
        });
      });

    }
    
    else {
      $(this).bind('click',function (e) { 
        $(this).closest('.expander').toggleClass('active');
        e.stopPropagation();
      });
    }
  
  });
}

gooe.dropdown = function (el) {
  el.find('.dropdown-trigger').each(function (e) {
    $(this).bind('click',function () {
      $(this).closest('.dropdown').toggleClass('active');
    });
  });
}

gooe.init = function (el) {
  gooe.dropdown(el);
  gooe.expander(el);
}