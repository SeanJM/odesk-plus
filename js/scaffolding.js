$(function(){
  $(window).bind('scroll',function(e){
    header = $('header[role="banner"]');
    body = $('body');
    var headerOffset = header.scrollTop()+header.height();
    if ($(window).scrollTop() > headerOffset && !body.hasClass('header-scroll')) {
      body.addClass('header-scroll');
    }

    if ($(window).scrollTop() < headerOffset && body.hasClass('header-scroll')) {
      body.removeClass('header-scroll');
    }

  });
});