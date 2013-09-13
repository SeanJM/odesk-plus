/* Dingo! */

var dingo = {
  trigger: function (dingoEvent,options) {
    var events = ['click','mouseup','mouseenter','mousemove','keyup','keydown','keypress'];
    $.each(events,function (i,k) {
      if (typeof dingo[k] === 'object' && typeof dingo[k][dingoEvent] === 'function') {
        options.el.off(k);
        options.el.on(k,function (event) {
          options.event = event;
          dingo[k][dingoEvent](options);
        });
      }
    });
  },
  on: function (classes,el) {
    var dingos = classes.split(' ');
    var options = {
      el: el,
    };
    var dingoEvent;
    var thisOption;
    $.each(dingos,function (i,k) {
      dingoEvent = k.match(/([a-zA-Z0-9_-]+)(?:\{([\s\S]*?)}|)/);
      if (typeof dingoEvent[2] === 'string') {
        $.each(dingoEvent[2].split(';'),function (j,l) {
          if (l.length > 0) {
            thisOption = l.match(/([a-zA-Z0-9_]+)(?:\s+|):(?:\s+|)([\s\S]*?)$/);
            options[thisOption[1]] = thisOption[2];
          }
        });
      }
      dingo.trigger(dingoEvent[1],options);
    });
  },
  init: function (el) {
    function addOn(_el) {
      var attr  = _el.attr('data-dingo');
      dingo.on(attr,_el);
    }
    if (typeof el.attr('data-dingo') === 'string') {
      addOn(el);
    }
    el.find('[data-dingo]').each(function () {
      addOn($(this));
    });
  }
}