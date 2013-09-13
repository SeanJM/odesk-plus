var jobApplyTemplates;

var dingo = {
  trigger: function (dingoEvent,options) {
    var events = ['click'];
    $.each(events,function (i,k) {
      if (typeof dingo[k][dingoEvent] === 'function') {
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

dingo.click = {
  'advanced-editor_item-add': function (options) {
    db.get('jobApply').push('Empty');
    var editor = options.el.closest('#advanced-editor');
    var item   = editor.find(options.item).eq(0);
    var clone  = $(jobApply.addItem(db.get('jobApply').length-1));
    var list   = editor.find('.advanced-editor_list');

    clone.appendTo(list);
    dingo.init(clone);
  },
  'advanced-editor_item-edit': function (options) {
    var container = $(options.item);
    var def       = container.find('.advanced-editor_default-mode');
    var edit      = container.find('.advanced-editor_edit-mode');
    var textarea  = $(options.textarea);
    var shortText = $('#advanced-editor_short-text_'+options.id);
    var longText  = $('#advanced-editor_long-text_'+options.id);
    var coverText = $('#coverLetter');
    var value;

    if (options.type === 'edit') {
      def.addClass('advanced-editor_default-mode_is-off');
      edit.addClass('advanced-editor_edit-mode_is-on');
    }
    else if (options.type === 'save') {
      db.get('jobApply')[options.id] = textarea.val();
      db.set('jobApply',db.get('jobApply'));
      shortText.html(db.get('jobApply')[options.id]);
      longText.html(db.get('jobApply')[options.id]);
      def.removeClass('advanced-editor_default-mode_is-off');
      edit.removeClass('advanced-editor_edit-mode_is-on');
    }
    else if (options.type === 'add') {
      console.log('add');
      if (coverText.val().length > 0) {
        value = coverText.val()+'\n'+textarea.val();
      } else {
        value = textarea.val();
      }
      coverText.val(value);
    }
  },
  'expander': function (options) {
    section   = options.el.closest('.expander-container').find('.expander-section').eq(0);
    container = section.closest('.expander-container');
    trigger   = options.el;

    section.toggleClass('expander-section_is-active');
    trigger.toggleClass('expander-trigger_is-active');
    container.toggleClass('expander-container_is-active');
  }
}

jobApply = {
  addItem: function (i) {
    return jobApplyTemplates.find('#advanced-editor_list').html().replace(/%[a-zA-Z]+/g,function (m) {
      if (m === '%id') return i;
      else if (m === '%text') return db.get('jobApply')[i];
    });
  },
  shorten: function (string) {
    return string.substring(0,200);
  },
  advancedEdit: function () {
    var coverTextarea  = $('#coverLetter');
    var coverContainer = $('#oFormField-coverLetter');
    var description    = $('#jobDetails .jsFull').html();
    var entries        = db.get('jobApply');
    var items = [];
    var item;
    var advanced;

    $('<div>').load(dir('../templates/jobApply.html'),function (i,s) {
      jobApplyTemplates = $(i);
      advanced = jobApplyTemplates.find('#advanced-editor');
      for (var i=0;i<entries.length;i++) {
        item = jobApply.addItem(i);
        items.push(item);
      }
      advanced.find('.advanced-editor_list').append($(items.join('')));
      coverContainer.append(advanced);
      dingo.init(advanced);
    });
  },
  init: function () {
    if (isPage.jobApply()) {
      jobApply.advancedEdit();
    }
  }
}