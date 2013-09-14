var jobApplyTemplates;

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
    var item      = $('#advanced-editor_list_'+options.id);
    var value;
    var arr;

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
      value = textarea.val()+'\n\n';
      if (coverText.val().length > 0) {
        value = coverText.val()+'\n'+value;
      }
      coverText.val(value);
    }
    else if (options.type === 'delete') {
      arr = db.get('jobApply');
      arr.splice(options.id,options.id);
      console.log(arr);
      db.set('jobApply',arr);
      item.addClass('advanced-editor_list-item_is-deleted');
      setTimeout(function () {
        item.remove();
      },600);
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

var jobApply = {
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