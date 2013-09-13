var dingo = {
  getProperties: function (dingoValue) {
    var match,_match,prop,attr,obj={};

    function toBool(string) {
      if (string === 'true') return true;
      else if (string === 'false') return false;
      return string;
    }

    match = dingoValue.match(/([a-zA-Z0-9-_]+)(?:\s+|)(?:{([\S\s]*?)}|)/);
    name         = match[1];
    attr         = (typeof match[2] === 'string') ? match[2].split(';') : [];
    obj['_name'] = name;
    $.each(attr,function (i,k) {
      if (k) {
        _match = k.match(/([\S\s]*?):([\S\s]*?)$/);
        obj[_match[1]] = toBool(_match[2]);
      }
    });

    return obj;
  },
  assign: function (el) {

    function initEvent(options) {
      var match,_match,classes,dingoGroup;

      function toBool(string) {
        if (string === 'true') return true;
        else if (string === 'false') return false;
        return string;
      }

      classes = options.el.attr('data-dingo').split(' ');

      $.each(classes,function (i,k) {
        options = $.extend(options,dingo.getProperties(k));

        if (typeof dingo[options.on] !== 'undefined' && typeof dingo[options.on][options['_name']] !== 'undefined') {
          dingo[options.on][options['_name']](options);
        };
      });

    }

    var events  = ['click','keyup','change','keydown','keypress','dblclick','mouseup','mousedown','mouseenter','mouseleave','mousemove'];

    $.each(events,function (i,k) {
      el.off(k);
      el.on(k,function (event) {
        initEvent({on: k,el: el,event: event,target: $(event.target)});
      });
    });
  },

  all: function (el) {
    if (el[0].getAttribute('data-dingo')) {
      dingo.assign(el);
    }
    el.find('[data-dingo]').each(function () {
      dingo.assign($(this));
    });
  },

  click: {
    "change-badge": function (options) {
      var badge   = $('[badgeid="'+options.id+'"]');
      var icon    = badge.find('[class^="icon-"]').eq(0);

      var classes = badge.attr('class').match(/(\s+|)badge-[a-z]+/g);
      $.each(classes,function (i,k) {
        badge.removeClass(k);
      });
      badge.addClass('badge-'+options.color);

      classes = icon.attr('class').match(/(\s+|)icon-micro-[a-z]+/g);
      $.each(classes,function (i,k) {
        icon.removeClass(k);
      });
      icon.addClass('icon-micro-'+options.icon);
    },

    "close-open-popups": function (options) {
      function dropdown() {
        var dropdownContainer   = $(options.event.target).closest('.dropdown-container');
        var insideDropdown      = (dropdownContainer.size() > 0) ? true : false;
        var isDropdownContainer = $(options.event.target).hasClass('.dropdown-container');

        if (!insideDropdown || $('.dropdown-active').size() > 1) {
          var dropdownContainers = $('.dropdown-container');
          dropdownContainers.each(function (i,e) {
            if (!insideDropdown || e !== dropdownContainer[0]) {
              var controlOption   = $(this).find('.dropdown-control-option');
              var controlDropdown = $(this).find('.dropdown');
              controlOption.removeClass('dropdown-control-option-active');
              controlDropdown.removeClass('dropdown-active');
              $(this).removeClass('dropdown-control_is-active');
            }
          });
        }
      }
      function panelPrompt() {
        var target = $(options.event.target);
        var controlPrompt = $('.control-prompt-selected').eq(0);
        if (target.closest('.control-prompt').size() < 1) {
          if (controlPrompt.hasClass('control-prompt-active')) {
            controlPrompt.fadeOut(200);
            controlPrompt.removeClass('control-prompt-active');
            controlPrompt.removeClass('control-prompt-selected');
          } else {
            controlPrompt.addClass('control-prompt-active');
          }
        }
      }
      function popOut() {

      }
      dropdown();
      panelPrompt();
      popOut();
    },

    "confirm-cancel": function (options) {
      var form = $(options.form);
      if (!form.hasClass('form_has-errors')) {
        modalNav.next(options);
      }
    },

    "control_toggle": function (options) {
      var rows,btn,check,match,enabledClass,disabledClass;
      function enable(bool) {
        btn           = $(options.button);
        match         = btn.attr('class').match(/(btn-(green|red|blue|grey))(-disabled|)/);
        disabledClass = match[1]+'-disabled';
        enabledClass  = match[1];

        if (bool) {
          btn.removeClass(disabledClass);
          btn.addClass(enabledClass);
        } else {
          btn.removeClass(enabledClass);
          btn.addClass(disabledClass);
        }
      }
      if (options.condition === 'row-select') {
        rows = options.el.closest('table').find('.table_row-select_is-active');
        if (rows.size() > 0) {
          enable(true);
        } else {
          enable(false);
        }
      }
      else if (options.condition === 'check-select') {
        check = options.el.closest('table').find('input[type="checkbox"]').filter(':checked');
        if (check.size() > 0) {
          enable(true);
        } else {
          enable(false);
        }
      }
    },

    "datepicker": function (options) {
      options.el.datepicker({trigger: true});
    },

    "dropdown-control": function (options) {
      var controlOption   = options.el.find('.dropdown-control-option');
      var controlDropdown = options.el.find('.dropdown').eq(0);
      var button          = options.el.find('.btn-dropdown').eq(0);

      options.el.toggleClass('dropdown-control_is-active');
      controlOption.toggleClass('dropdown-control-option-active');
      controlDropdown.css('top',(options.el.outerHeight()-1)+'px').toggleClass('dropdown-active');
    },

    "dropdown-select": function (options) {
      var dropdown  = options.el.closest('.dropdown-container');
      var text      = dropdown.find('.dropdown-select_text').html(options.el.text());
      dropdown.find('.dropdown_select_is-selected').removeClass('dropdown_select_is-selected');
      options.el.addClass('dropdown_select_is-selected');
    },

    "edit-content": function (options) {
      if (options.target.attr('data-dingo').match(/(\s+|^)edit-content(\s+|$)/)) {
        editContent.init(options.el,true);
      }
    },

    "edit-content_btn": function (options) {
      var target  = $(options['edit-target']);
      var checked = target.find('.td_select input:checked');
      var bool;
      var bulk = (typeof options['bulk-edit'] === 'string') ? options['bulk-edit'] : false;

      if (options.type === 'edit') {
        bool = true;
      } else if (options.type === 'save') {
        bool = false;
        editContent.save(target,{bulk: bulk});
      }

      if (checked.size() > 0) {
        target.find('input[type="checkbox"]').filter(':checked').each(function () {
          $(this).closest('tr').find('.edit-content_is-default').each(function () {
            editContent.init($(this),bool);
          });
        });
      }
    },

    "edit-content-close": function (options) {
      editContent.if_cancel_all(options);
    },

    "expander-trigger": function (options) {
      var section     = options.el.find('.expander-section')[0];
      var isInSection = (options.target.closest('.expander-section')[0] === section);
      var expander    = options.target.closest('.expander');

      expander.toggleClass('expander-active');
      expanders.setState({expander: expander,expand: expander.hasClass('expander-active')});

    },

    "left-panel-accordion": function (options) {
      if (db.data.leftMenuPanel === options.name) {
        options.name = options.toggle;
      }

      leftPanel.select(options.name);
    },

    "list-prep_send-products_shipping": function (options) {
      $('.list-prep_no-select')
        .removeClass('list-prep_no-select')
        .addClass('list-prep_has-select');
    },

    "microbox_remove-row": function (options) {
      if (!options.el.hasClass('btn-red-small-disabled')) {
        options.el.closest('.microbox-row').remove();
      }
    },

    "modal_close": function (options) {
      modalState.init(options,false);
    },

    "modal_init": function (options) {
      modalState.init(options,true);
    },

    "modal_next": function (options) {
      modalNav.next(options);
    },

    "modal_prev": function (options) {
      modalNav.prev(options);
    },

    "panel-prompt": function (options) {
      var container        = options.el.closest('.right-panel');
      var prompt           = $('#'+options.el.attr('prompt'));
      var promptLeftCenter = options.el.offset().left+(options.el.outerWidth()/2)-(prompt.outerWidth()/2)-($('body').outerWidth()-container.outerWidth());
      var promptLeftRight  = options.el.offset().left-container.offset().left+(options.el.outerWidth()/2)-prompt.outerWidth();
      var promptTopTop     = (options.el.offset().top-container.offset().top)+(options.el.outerHeight()/2)-prompt.outerHeight();
      var promptTopBottom  = (container.offset().top-options.el.offset().top)+(options.el.outerHeight()/2);
      var promptLeft;
      var promptTop;
      if (promptLeftCenter+prompt.outerWidth() > container.outerWidth()) {
        promptLeft = promptLeftRight;
      } else {
        promptLeft = promptLeftCenter;
      }
      if ((promptTopTop+container.offset().top) < 100) {
        promptTop = promptTopBottom;
        console.log('top');
      } else {
        promptTop = promptTopTop;
      }
      prompt.css('left',promptLeft).css('top',promptTop);
      prompt.fadeIn(200);
      prompt.addClass('control-prompt-selected');
    },

    "popout-control": function (options) {
      var popout = options.el.find('.popout');
      var classes = popout.attr('class');
      var active = [];
      $.each(classes.split(' '),function (i,k) {
        if (!k.match(/_is-active/)) active.push(k+'_is-active');
      });
      options.el.addClass('popout-control_is-active');
      popout.addClass(active.join(' '));
    },

    "popout-close": function (options) {
      popoutClose(options);
    },

    "prompt-close": function (options) {
      var prompt = options.el.closest('.control-prompt');
      prompt.fadeOut(200);
      prompt.removeClass('control-prompt-selected');
      prompt.removeClass('control-prompt-active');
    },

    "radio": function (options) {
      radio.init();
    },

    "shadowbox": function (options) {
      if (options.target[0] == options.el[0]) {
        options.el.removeClass('shadowbox-active');
      }
    },

    "status_popout": function (options) {
      statusPopout.init(options,true);
    },

    "status_popout_close": function (options) {
      statusPopout.init(options,false);
    },

    "tab-control": function (options) {
      var container  = options.el.closest('.tab-container');
      var index      = options.el.index();
      var tabSection = container.find('.tab-section').eq(index);
      options.el.siblings().filter('.tab-active').removeClass('tab-active');
      options.el.addClass('tab-active');
      tabSection.siblings().filter('.tab-section-active').removeClass('tab-section-active');
      tabSection.addClass('tab-section-active');
    },

    "table_row-select": function (options) {
      options.el.closest('table').find('.table_row-select_is-active').removeClass('table_row-select_is-active');
      options.el.toggleClass('table_row-select_is-active');
    },

    "th_select": function (options) {

    },

    "th_select-all": function (options) {
      var checkboxes = options.el.closest('table').find('tbody input[type="checkbox"]');
      var checked    = options.el[0].checked;

      checkboxes.each(function () {
        $(this)[0].checked = checked;
      });
    }

  }, /* Click */

  change: {},

  mousedown: {
    "panel-control": function (options) {
      function execute() {
        var panelContainer = options.el.closest('.panel-container').eq(0);
        var activePanel    = options.el.closest('[panel]').eq(0);

        panelContainer.addClass('panel-container-active');
        activePanel   .addClass('panel-active');
        $('body')     .addClass('panel-scale');
      }
      execute();
    },
    "expander-trigger": function (options) {
      var expander = options.target.closest('.expander');
      expanders.mouseDown(expander);
    }
  },

  mouseup: {
    "panel-scale": function (options) {
      if ($('body').hasClass('panel-scale')) {
        var panelContainer = options.el.find('.panel-container-active').eq(0);
        var activePanel    = panelContainer.find('[panel]').eq(0);

        panelContainer.removeClass('panel-container-active');
        activePanel   .removeClass('panel-active');
        $('body')     .removeClass('panel-scale');

        panels.store(panelContainer);
      }
    },
    "expander-trigger": function (options) {
      var expander = options.target.closest('.expander');
      expanders.mouseUp(expander);
    }
  },

  mousemove: {
    "panel-scale": function (options) {
      var mouse = {
        x: options.event.pageX,
        y: options.event.pageY
      }
      // Horizontal Panels
      if ($('body').hasClass('panel-scale')) {
        function toWidth(width) {
          return (width/panelContainer.outerWidth())*100;
        }
        var panelContainer = $('.panel-container-active').eq(0);
        var activePanel    = $('.panel-active').eq(0);
        var attr           = activePanel.attr('panel');
        var otherPanels    = activePanel.siblings().filter('[panel]').not('.panel-active');
        var width          = {
          init: mouse.x-activePanel.offset().left,
          percent: toWidth(mouse.x-activePanel.offset().left)
        }
        var minWidth       = {
          type: (panels.getValue('min-width',attr).match(/px/)) ? 'px' : '%',
          value: parseFloat(panels.getValue('min-width',attr))
        }
        var oldWidth       = toWidth(activePanel.outerWidth());
        var widthSplit     = width/oldWidth;
        var newWidth;
        // Go through each panel
        if (minWidth.type === 'px' && minWidth.value < width.init) {
          otherPanels.each(function (i,k) {
            el = $(k);
            newWidth = el.css('width',(100-width.percent)+'%');
          });
          activePanel.css('width',width.percent+'%');
          responsive.init();
        }
      }
    }
  }, /* Mouse move */

  mouseenter: {
    "dropdown_submenu-control": function (options) {
      dropdownSubmenu.init(options,true);
    },

    "panel-graph": function (options) {
      var stat  = $('[panelstat="'+options.name+'"]');
      var height = parseInt(stat.css('max-height'));
      var graph = options.el.closest('.panel-graph-container').find('.panel-graph');
      var left  = options.event.pageX-(graph.offset().left)-(stat.outerWidth()/2)+'px';
      var top   = options.event.pageY-(graph.offset().top+5)-(height);
      stat.addClass('panel-graph-stat_is-active');
      stat.css('left',left).css('top',top);
    },

    "hover-popout": function (options) {
      var popout = $('[hoverpopout="'+options.name+'"]');
      var container = options.el.closest('.scrollable');

      popout.addClass('hover-popout_is-active');

      var left   = options.el.offset().left-container.offset().left-(popout.outerWidth()/2);
      var top    = options.el.offset().top-container.offset().top+options.el.outerHeight();

      console.log($('#right-panel').offset().top,options.el.offset().top);

      if (popout.css('left') === 'auto' && popout.css('top') === 'auto') {
        popout.css('left',left).css('top',top);
      }

    }

  }, /* Mouse Enter */

  mouseleave: {
    "panel-graph": function (options) {
      var stat = $('[panelstat="'+options.name+'"]');
      stat.removeClass('panel-graph-stat_is-active');
    },

    "popout": function (options) {
      popoutClose(options);
    },

    "dropdown_submenu-control": function (options) {
      dropdownSubmenu.init(options,false);
    },

    "hover-popout": function (options) {
      var popout = $('[hoverpopout="'+options.name+'"]');

      popout.removeClass('hover-popout_is-active');
    }
  },

  keypress: {
    "number": function (options) {
      var keyCode = options.event.which;
      var eChar   = String.fromCharCode(keyCode);
      var max     = (typeof options.max !== 'undefined') ? parseInt(options.max) : '';
      var number;
      var endProd;
      if (keyCode.toString().match(/^(0|8)$/m) === null) {
        if (eChar.match(/[0-9]+/) === null) {
          options.event.preventDefault();
        } else {
          number = options.el.val();
          endProd = parseInt(number+eChar);
          if (typeof max !== 'undefined' && endProd > max) {
            options.event.preventDefault();
          }
        }
      }
    }
  },

  keyup: {
    "microbox_input": function (options) {
      var newRow;
      var thisRow    = options.el.closest('.microbox-row');
      var thisDelete = thisRow.find('.btn-red-small-disabled,.btn-red-small').eq(0);
      var keyCode    = options.event.which;
      var eChar      = String.fromCharCode(keyCode);
      var lastRow    = {};
      var totalEmpty = 0;
      lastRow.el     = options.el.closest('.microbox').find('.microbox-row:last');
      lastRow.length = lastRow.el.find('input[type="text"]').val().length;

      if (options.el.val().length > 0) {
        if (thisDelete.hasClass('btn-red-small-disabled')) {
          thisDelete
            .removeClass('btn-red-small-disabled')
            .addClass('btn-red-small');
        }
        if (lastRow.length > 0) {
          newRow = options.el.closest('.microbox-row').clone();
          newRow.find('input[type="text"]').val('');
          newRow.find('.btn-red-small-disabled,.btn-red-small')
            .removeClass('btn-red-small')
            .addClass('btn-red-small-disabled');
          lastRow.el.after(newRow);
          dingo.all(newRow);
        }
      } else {
        options.el.closest('.microbox-edit').find('input[type="text"]').each(function () {
          if ($(this).val().length < 1) totalEmpty++
        });
        if (totalEmpty > 1) {
          thisRow.remove();
        }
      }

    },

    "close-edit-content": function (options) {
      if (options.event.keyCode === 27) {
        editContent.close();
      }
    },

    "edit-bulk": function (options) {
      var els = options.el.closest('table').find('[name="'+options.name+'"]');
      var val = options.el.val();
      var isEdit;
      els.each(function () {
        isEdit  = ($(this).closest('td').find('.edit-content_is-edit-active').size() > 0);
        if (isEdit) {
          if ($(this)[0] !== options.el[0]) {
            $(this).val(val);
          }
          if (val !== $(this).attr('initvalue')) {
            $(this).attr('changed','');
          } else {
            $(this).removeAttr('changed');
          }
        }
      });
    },

    "input-calculator": function (options) {
      var op;
      var result;
      if (typeof options.multiply === 'string') {
        result = parseInt((parseFloat(options.el.val()) * parseFloat(options.multiply))*100)/100;
        if (isNaN(result)) {
          result = '0.00';
        }
        $(options.target).text(result);
      }
    },
  }, // Keyup


  resize: {
    window: function (options) {
      responsive.init();
      uiScale.init();
      scrollbox.update();
    }
  },

  init: function () {
    dingo.all($('body'));

    function initWindowEvent(options) {
      if (typeof dingo[options.on] !== 'undefined' && typeof dingo[options.on]['window'] !== 'undefined') {
        dingo[options.on]['window'](options.event);
      }
    }

    $.each(['scroll','resize'],function (i,k) {
      $(window).on(k,function (event) {
        initWindowEvent({on: k,el: window,event: event});
      });
    });
  }
}