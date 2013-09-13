/* ======================================================= */
/* Initialization Command ================================ */
/* ======================================================= */

function dir (str) { return $('html').attr('directory') + str; }

var expander = {
  init: function (el) {
    var container,trigger,section;
    el.find('.expander-section').each(function () {
      section   = $(this);
      container = section.closest('.expander-container');
      trigger   = container.find('.expander-trigger');

      trigger.on('click',function () {
        section.toggleClass('expander-section_is-active');
        trigger.toggleClass('expander-trigger_is-active');
        container.toggleClass('expander-container_is-active');
      });
    });
  }
}

/* --------------------------// First start */
var oplus = {
  init: function () {

  }
}

var init = {
  all: function () {
    db.init('odesk');
    header.init();
    jobApply.init();
  }
};

$(function () {
  init.all();
});