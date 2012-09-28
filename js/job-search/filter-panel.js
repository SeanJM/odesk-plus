function selectJobType(){
  var type    =[],
      select  = "",
      jobSelect = $('select[target=".filterList_Job_Type"]'); 
  $('.searchResult .resultHeader dl dt.type').each(function(){ type.push($(this).html()); });
  $(type).each(function(n){
    if (type[0] != type[n]) { select = 't-all'; }
    else { select = 't-1'; if (type[0] == 'Hourly') { select = 't-0'; } }
  });
  jobSelect
    .find('option[selected="selected"]')
    .attr('selected','');
  jobSelect
    .find('option[checkbox="' + select + '"]')
    .attr('selected','selected');
}
function createListOption(target) {
  var catItems = [];
  $(target).find('li').each(function(){
    var val     = $(this).find('label').html(),
        key     = $(this).find('input').attr('id'),
        output  = '<option checkbox="' + key + '">' + val + '</option>';
    catItems.push(output);
  });
  return catItems;
}

function createSelectList(target){
  var catItems = createListOption(target);
  $(target).after('<div class="selectList filters" target="' + target + '"></div>');
  $('<select/>',{
    'class': 'categorySelect',
    'target': target,
    html: catItems.join('')
  }).appendTo('.selectList[target="' + target + '"]');
  var hiddenDiv = document.createElement('div');
  hiddenDiv.style.cssText = 'display:none';
  $(target).hide().wrapAll(hiddenDiv);
}

function setupFilters(){
  var filters = $('#searchFilters');
  if (filters.attr('format') != 'true') {
    filters.find('#allFilters > li.group').each(function(){
      var elem = $(this);
      var legend = elem.find('legend');
      if (legend.html() != 'Sub Categories' && legend.html() != 'Fixed-Price Budget') {
        var id = 'filterList_' + legend.html().split(' ').join('_');
        legend.next('ul').addClass(id);
        createSelectList('.' + id);
        // Select the correct option
        selectSelectList('.' + id);
      }
      if (legend.html() == 'Job Type') { selectJobType(); }
      legend.prepend('<span class="collapse"><span class="arrow"></span></span>');
      // Collapse collapsed filters
      if (elem.hasClass('expand')) { 
        elem.find('fieldset .filters').last().toggle();
      }
    });
    $('.controlPlusMinus').hide();
    filters.attr('format','true');
  }
}
function selectSelectList(target){
  $(target).find('li').each(function(){
    var checkbox = $(this).find('input');
    if (checkbox.is(':checked')) { 
      var option = checkbox.attr('id'); 
      $('option[checkbox="' + option + '"]').attr('selected','selected');
    }
  });
}
// Monitor the dropdown menu
function categoryClick(categorySelect) {
  categorySelect.bind('click',function(){
    var target = $(this).attr('target');
    $(target).find('li').each(function(){
        var val = $(this).find('label').html();
        var key = $(this).find('input').attr('id');
        $('option[checkbox="' + key + '"]').html(val);
    })
  });
}
function categoryChange(categorySelect) {
  categorySelect.each(function() {
    $(this).bind('change',function(){
      var selectedVal = $(this).find(':selected');
      var id = selectedVal.attr('checkbox');
      var checkBox = $('input[id=' + id + ']');
      /*checkBox.trigger('click');*/
    });
  });
}
function categoryToggle(categorySelect) {
  var legend = $('#allFilters legend');
  if (legend.attr('bound') != 'true') {
    legend.each(function() {
      /* To make sure it's not binding the event more than once */
      $(this).attr('bound','true');
      $(this).bind('click',function(){
        var categorySelect = $(this).parents('fieldset').find('.filters');
        if (categorySelect.size() > 1) {
          categorySelect.last().toggle();
        }
        else { categorySelect.toggle(); }
      });
    });
  }
}
function categoryCheckbox() {
  $('#allFilters input[type="checkbox"]').bind('change',function(){
    $('#searchResults').trigger('updateSearchArea');
  });
}
function bindSelectFilter(){
  var categorySelect = $('.categorySelect');
  categoryClick(categorySelect);
  categoryChange(categorySelect);
  categoryToggle(categorySelect);
  categoryCheckbox();
}
function filterScroll(){
  var filters = $('#searchFilters');
  var filtersPos = 190;
  var scroll = $(window).scrollTop();
  if(scroll < filtersPos) {
    if (filters.css('position') == 'fixed') { 
      filters.css('position','inherit'); 
    }
  }
  if(scroll > filtersPos) {
    if (filters.css('position') != 'fixed') { 
      filters.css('position','fixed').css('top','10px'); 
    }
  }
}
  