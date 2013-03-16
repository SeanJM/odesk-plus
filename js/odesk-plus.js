
/* --------------------------------------- */
/* // Database */
/* --------------------------------------- */

var db = {};

db.init = function(name) {
  var val;
  db.value = {};
  console.log(db);
  /* ------------- job search */
  db.value.jobsearch = {};
  db.value.jobsearch.sidemenu = {};

  console.log('Does databas exist?');
  if (localStorage.getItem(name) != 'undefined') {
    console.log('- Yes: loading database');
    val = JSON.parse(localStorage.getItem(name));

    if (val) { db.value = val; }
  }
  else {
    console.log('- No: Initializing first start');
    firststart();
  }
}

db.save = function(name) {
  console.log('- Saving database');
  localStorage.setItem(name,JSON.stringify(db.value)); 
}

/* --------------------------// First start */
function firststart() { }

/* --------------------------// Return the Chrome URL */

function dir (str) { return $('html').attr('directory') + str; }
template.dir = function() { return dir('../templates/templates.html'); }

/* --------------------------// Site Map */

var url = {
  Applications: '/applications',
  Home        : '/home',
  Profile     : '',
  Report      :
  { Home      :'/reports',
    Timelogs  :'/reports/timelogs' },
  Wallet      : '/withdrawal-methods'
}

/* --------------------------// Is page */
function cleanURL() {
  var href = window.location.href;
      href = href.split('/');
      href = href.splice(3,href.length).join('/');
  return href;
}

var is           = {}
    is.joblist   = function () { if (/find-work-home/.test(cleanURL())) { return true; } return false; }
    is.jobsearch = function () { if (/jobs/.test(cleanURL()) && !/jobs\s*(.*?)main/.test(cleanURL())) { return true; } return false; }
    is.apply     = function () { if (/jobs/.test(cleanURL()) && /jobs\s*(.*?)main/.test(cleanURL())) { return true; } return false; }

/* Clean Page */
function removeContent() { $('body').children('remove'); }

/* A general UI and Interaction library that is barebones */

w = {};

w.fn = {}

w.expander = function (el,arg) {

  function expand(el) {
    var expander = el.closest('.expander');
    
    expander.toggleClass('active');
    
    if (expander.hasClass('active') & typeof arg.open === 'function') { arg.open(expander); }
    else if (!expander.hasClass('active') & typeof arg.close === 'function') { arg.close(expander); }
  }

  el.find('.expander-btn').each(function (){
    $(this).unbind('click');
    $(this).bind('click',function (e){
      expand($(this));
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
          if (radioTrigger.is(':checked')) { expander.addClass('active'); }
          else { expander.removeClass('active'); }
          e.stopPropagation();
        });
      });

    }
    
    else {
      $(this).unbind('click'); 
      $(this).bind('click',function (e) { 
        expand($(this));
        e.stopPropagation();
      });
    }
  
  });
}

w.popout = function (el) {
  el.find('.popout-trigger').each(function (e) {
    $(this).unbind('click');
    $(this).bind('click',function (event) {
      var target = $(event.target);
      var popout = target.closest('.popout');
      if (target.parents('.popout-menu').size() < 1) {
        popout.toggleClass('active');
      }
      popout.bind('blur',function (event) {
        popout.removeClass('active'); 
      })
    });
  });
}

w.range = function (el) {
  el.find('.range-slider').each(function() {
    var container      = $(this);
    var currency       = '';
    var percentage     = '';
    var containerRange = container.attr('range').replace(/%|\$/ig,'').split(',');
    var range          = {
      min: parseInt(containerRange[0]),
      max: parseInt(containerRange[1])
    }
    var rangeHTML     = $('<div class="range"><div class="slider"><div class="slider-fill"><div class="knob knob-min"><div class="face"></div></div><div class="knob knob-max"><div class="face"></div></div><div class="range-popup"></div></div></div></div>');
    var knob          = rangeHTML.find('.knob');
    var slider        = rangeHTML.find('.slider');
    var fill          = rangeHTML.find('.slider-fill');
    var fn            = container.attr('on');
    var id            = $(this).attr('id');
    var selectedRange = {};


    if (/\$/ig.test(container.attr('range'))) { currency = '$'; }
    if (/%/ig.test(container.attr('range'))) { percentage = '%'; }

    knob.css('position','absolute').css('cursor','pointer');
    fill.css('position','relative').css('cursor','pointer');
    container.css('-webkit-user-select', 'none'); 

    fill.css('margin-left',parseInt(db.value.jobFilters[id].x)).css('width',parseInt(db.value.jobFilters[id].w));

    container.bind('slide',function(e,mouseX) {
      var knob = {
        active: container.find('.knob.active'),
        max: container.find('.knob-max'),
        min: container.find('.knob-min')
      };

      
      if (knob.min.hasClass('active')) { 
        var minX = mouseX - slider.offset().left;
        var maxY = fill.width() - (minX - parseInt(fill.css('margin-left')));
      }

      if (knob.max.hasClass('active')) { 
        var minX = parseInt(fill.offset().left - slider.offset().left);
        var maxY = mouseX - (fill.offset().left);
      }

      selectedRange = {
        min: Math.round((minX / slider.width()) * (range.max - range.min)),
        max: Math.round(((maxY+minX) / slider.width()) * range.max)
      }
      if (selectedRange.max > range.max) { selectedRange.max = range.max; }
      if (selectedRange.min < range.min) { selectedRange.min = range.min; }

      function setRange(obj) {
        /* ------------- Convert Ranges to X & W coordinates for fill */
        var x = ((obj.sMin - obj.min) / obj.max) * slider.width();
        var w = ((obj.sMax - obj.sMin) / obj.max) * slider.width();
        var text = "<p><span class='min span10 center'>" + obj.before + obj.sMin + obj.after + "</span><span class='span4 center'>to</span><span class='max span10 center'>" + obj.before + obj.sMax + obj.after + "</span></p>";
  
        /* ------------- Popup */
        var popup = container.find('.range-popup');
        popup.html(text);
        
        /* ------------- Control Fill */
        fill.css('margin-left',parseInt(x)).css('width',parseInt(w));
        
        if (typeof db.value.jobFilters == 'undefined') { db.value.jobFilters = {}; }
        db.value.jobFilters[id] = {
          x: x,
          w: w
        };
      }

      setRange({
        before: currency,
        after: percentage,
        min: range.min,
        max: range.max,
        sMin: selectedRange.min,
        sMax: selectedRange.max
      });
    
    });

    container.bind('slideup',function() {
      container.attr('range',selectedRange.min + ',' + selectedRange.max);
      /* Check if function is attached, convert to object literal */
      if (typeof eval('w.fn.' + fn) == 'function') {
        eval('w.fn.' + fn + '({element: container,range: selectedRange})'); 
      }
      db.save('odeskplus');
    });

    knob.unbind('mousedown');
    knob.bind('mousedown',function () {
      container.addClass('active');
      $('html').addClass('sliding');
      $(this).addClass('active');
    });
    
    container.css('position','relative').html(rangeHTML);

    /* ------------- Table */
    var table = $('<table><tr></tr></table>')
      .css('table-layout','fixed')
      .css('text-align','center')
      .css('position','relative');

    for (i = range.min;i<=range.max;i++) {
      if (i % Math.round(range.max/7) == 0) {
        table.find('tr').append('<td>' + currency + i + percentage + '</td>');
      }
    }
    /* ------------- Table Width */
    var totalTD = table.find('td').size();
    var cellWidth = slider.width()/totalTD;
    var cellCenter = cellWidth/2;
    var newCellWidth = cellWidth+((cellCenter)/(totalTD/2));
    var tableWidth = ((newCellWidth*totalTD)+(cellCenter/totalTD));
    var TablePercent = Math.round((tableWidth/slider.width())*100) + '%';
    console.log(TablePercent);

    table.css('width',TablePercent).css('right',cellCenter);

    rangeHTML.append(table);
  });
}

w.offClick = function () {
  $('html').unbind('click');
  $('html').bind('click',function (event) {
    if ($(event.target).closest('.popout.active').size() < 1) {
      $('.popout.active').removeClass('active');
    }
  });

  $('html').unbind('mouseup');
  $('html').bind('mouseup',function (event) {
    var activeSlider = $('.range-slider.active');
    if (activeSlider.size() > 0) {
      activeSlider.removeClass('active').find('.knob.active').removeClass('active');
      $(this).removeClass('sliding');
      activeSlider.trigger('slideup',[event]);
    }
  });

  $('html').bind('mousemove',function (event) {
    if ($(this).hasClass('sliding')) {
      $('.range-slider.active').trigger('slide',[event.pageX]);
    }
  });
}

w.init = function (el) {
  w.popout(el);
  w.expander(el);
  w.range(el);
  w.offClick();
}

/* ----------------------------------------------------------------- */
/* Find work home */
/* ----------------------------------------------------------------- */

cleanTable = function (obj) {
  var table        = $(obj.table);
  var tableClasses = table.attr('class');
  var columns      = obj.columns;

  table.find('tr').each(function () {
    $(this).find('th,td').each(function(i) {
      if ($.inArray(i,columns) > -1) {
        $(this).remove();
      }
    });
  });
  return '<table class="' + tableClasses + '">' + table.html() + '</table>';
}

function thisWeeksEarnings() {
  var tmp      = $('<div></div>');
  var timelogs = '/reports/timelogs #hourly .oReportTable:eq(0)';
  var earnings = '/withdrawal-methods table.oDescTable .oPos';
  var keys     = {};
  var header   = $('header:first');

  tmp.load(timelogs,function () {
    keys['week-total'] = tmp.find('.oFinCol:last').text();
    keys['week-table'] = cleanTable({table: tmp.html(),columns: [1,2,3,4,5,6,7,10]});

    keys['hours'] = tmp.find('.oSumRow td:eq(8)').text();
    if (keys['hours'].length < 1) { keys['hours'] = 0; }

    if (keys['week-total'].length <= 0) { keys['week-total'] = '$0.00'; }

    tmp = $('<div></div>');
    tmp.load(earnings,function () {
      keys['week-earnings'] = tmp.text();
      template.get({'template':'dashboard','src':dir('templates/templates.html')},function (html) {
        var processed = $(template.insert({'template':html,'keys':keys}));
        processed.prependTo(header);
        w.init(processed);
      });
    });
  });
};

/* ----------------------------------------------------------------- */
/* Job Search */
/* ----------------------------------------------------------------- */

var jobs = {};
var process = {};
var checkProcess;
process.check = function () {
  checkProcess = setInterval(function() {
    if ($('.oIndicatorMsg').size() > 0) {
      if (!$('body').hasClass('process')) {
        $('body').addClass('process');
      }
    }

    if ($('.oIndicatorMsg').size() == 0 && $('body').hasClass('process')) {
      $('body').removeClass('process');
      $('body').addClass('process-over');
      console.log('Initiating Job Processing');
      jobs.init();
    }
  },30);
}

process.validate = function () {
  setTimeout(function() {
    if ($('.oIndicatorMsg').size() == 0 && !$('body').hasClass('process') || !$('body').hasClass('process-over')) {
      $('body').addClass('process-over');
      console.log('Initiating Job Processing from failure to validate loading');
      jobs.init();
    }
  },1000);
}

// ----------------------------------------------------
// Initializations
// ----------------------------------------------------

/* ------------- Get my Info (Rate, Rating, Timezone) */

var myInfo = {};

myInfo.get = function (callback) {
  var cache = $('<div></div>');
  var rating;
  cache.load('/d/view_profile.php #main',function() {
    myInfo.rate   = parseInt(cache.find('.oRateLarge').text().split('/')[0].trim().replace('$','') * 100);
    myInfo.rating = 5;
    rating = cache.find('.oStarsTotal').text();
    if (typeof rating != 'undefined' && rating.length > 0) {
      myInfo.rating = parseInt(rating.split('(')[1].split(')')[0] * 100);
    }
    cache.find('aside.oSide section table.oDescTable tr').each(function(){
      var row = $(this);
      if (row.find('th').text().trim() == 'Location') {
        var num = row.find('td').text().split('(')[1].split(')')[0].replace('UTC','');
        myInfo.utc = parseInt(num);
      }
    });
    if (typeof callback == 'function') { callback(); }
  });
}

jobs.init = function () {
  myInfo.get(function () {
    jobs.format();
    formatSidebar();
  });
}

/* ------------- Search results filters */
var filter = {}

/* Convert string value to obj range */
function strToRange(str) {
  /* Clean String */
  if (typeof str != 'undefined') {
    str = str.replace(/%|\$/ig,'');

    var obj = {
      min: parseInt(Math.round(str)),
      max: parseInt(Math.round(str))
    };
    
    if (str.split(',').length > 1) { 
      obj.min = parseInt(Math.round(str.split(',')[0])); 
      obj.max = parseInt(Math.round(str.split(',')[1]));
    }

    return obj;
  }
}

/* Return true if value is within range, otherwise return false */
isRange = function (val,rangeDefinition) {
  if (isNaN(val.min) || isNaN(val.max) || isNaN(rangeDefinition.min) || isNaN(rangeDefinition.max)) { return true; }
  else if (val.min >= rangeDefinition.min && val.max <= rangeDefinition.max) { return true; }
  return false;
}

/* Return if the timezone is within range */
filter.timezone = function (element) {
  var rangeDefinition = strToRange($('#timezone-range').attr('range'));
  var val = strToRange(element.attr('timedifference'));

  return isRange(val,rangeDefinition);
}

filter.rate = function (element) {
  var rangeDefinition = strToRange($('#rate-range').attr('range'));
  var val = strToRange(element.attr('rate'));

  return isRange(val,rangeDefinition);
}

filter.avgrate = function (element) {
  var rangeDefinition = strToRange($('#average-rate-range').attr('range'));
  var val = strToRange(element.attr('avgrate'));
  return isRange(val,rangeDefinition);
}

filter.hirate = function (element) {
  var rangeDefinition = strToRange($('#highest-rate-paid').attr('range'));
  var val = strToRange(element.attr('hirate'));
  return isRange(val,rangeDefinition);
}

function jobShow(element) {
  if (filter.timezone(element) == false) { return false; }
  if (filter.rate(element) == false) { return false; }
  if (filter.avgrate(element) == false) { return false; }
  return true;
}

function jobFilterAll() {
  $('.jsSearchResults article').each(function(){ 
    if (jobShow($(this))) { $(this).removeClass('hidden'); }
    else { $(this).addClass('hidden'); }
  });
}

/* Range Functions */
w.fn.filter = {}
w.fn.rangeFilter = function(obj) {
  jobFilterAll();
}

function oJobFilters(el) {
  el.find('.oFormField').each(function () {
    if ($(this).find('.expander-btn').size() < 1) {
      var btn = '<div class="expander-btn"></div>';
      var id = $(this).find('.oLabel').text().split(' ').join('-').toLowerCase();
      $(this).addClass('expander').attr('id',id);
      $(this).find('.oLabel').prepend(btn);
      $(this).find('.oLabel').nextAll().wrap('<div class="expander-section"></div>');
      if (db.value['jobsearch']['sidemenu'][id] == 'active') { $(this).addClass('active'); }
      
      w.expander($(this),{
        open:function () {
          db.value['jobsearch']['sidemenu'][id] = 'active';
          db.save('odeskplus');
        },
        close:function () {
          db.value['jobsearch']['sidemenu'][id] = '';
          db.save('odeskplus');
        }
      });
    }
  });
}

function formatSidebar() {
  template.get({'src':dir('templates/templates.html'),'template':'job-filters'},function(element) {
    if ($('.visibilityFilter').size() == 0) {
      var element = $(element);
      element.insertAfter('.oSide .jsSearchFormFilters');
      w.init(element);
    }
  });

  oJobFilters($('div.oBd.oFormTop.oFilterPanel'));
}

/* ------------- Job Search Main Area */

/* Infinite Scroll */

function getNextPage(){
  var paginator           = $('#main').find('nav.oPagination:last'),
      nextPageURL            = paginator.find('.isCurrent').removeClass('isCurrent').next().addClass('isCurrent').attr('href'),
      searchResults = $('section.jsSearchResults');

  $.getJSON(nextPageURL,function(data){
    console.log('oDesk+: Next page JSON loaded');
    var cache = $('<div/>');
    var items = [];

    $.each(data, function(key, val) {
      if (val != '[object Object]' && !/null/i.test(val)) {
        var output = '<div class="' + key + '">' + val + '</div>';
        if (key == 'paginator_wrapper') { output = '<div class="' + key + '" style="display:none;">' + val + '</div>' }
        if (key != 'jobs_count' && key != 'query_string' && key != 'where_filter' && key != 'sub_cat' && key != 'group') { items.push(output); }
      }
    });

    $(items.join('')).appendTo(cache);

    cache = cache.replaceWith(cache.contents());

    cache.find('header.oBreadcrumbBar').remove();
    
    cache.find('.oJobTile').each(function() { jobFormat($(this)); });

    cache.appendTo(searchResults);

  });
}

function searchResultsScroll(){
  $(window).bind('scroll',function () {
    var side = $('aside.oSide');
    var top = $(window).scrollTop();

    if (top + $(window).height() > ($(document).height() - 360)) getNextPage();

    if (top > side.offset().top) { side.addClass('fixed'); }
    else if (top < side.offset().top) { side.removeClass('fixed'); }
  })
}


/* ------------- Job results formatting */

jobs.moreText = function (cache) {
  var description    = cache.find('#jobDescriptionSection').find('h1').remove().end();
  var firstParagraph = description.find('p:eq(0)');
  if (/Hourly Rate/.test(firstParagraph.text())) { firstParagraph.remove(); }
  var text           = description.html();
  var moreCreated    = false;
  var maxLen         = 400;
  var less = "";
  var more = "";

  if (text.length > maxLen) {
    less = $(text).text().substring(0,maxLen);
    moreCreated = true;
  }

  var obj = {'more-text':moreCreated,'less':less,'text':text};
  return obj;
}

jobs.moreTextBind = function (element) {
  element.find('.toggleDesc').bind('click',function () {
    $(this).closest('.job-description').toggleClass('show-more');
  });
}

/* Timezone & Location */

function findTimezone(self) {
  var time = 'Unknown';
  self.each(function(){
    if ($(this).text().split('(').length > 1 && !/reviews/.test($(this).text())) { time = $(this).text(); }
  });
  return time;
}

jobs.timeDifference = function (cache) {
  var timezoneStr    = findTimezone(cache.find('#jobsAboutBuyer ul.oPlainList li')),
      timeUTC        = timezoneStr.split('(')[1].split(')')[0].replace('UTC','').replace(':','.'),
      timeDifference = myInfo.utc+parseInt(timeUTC)*-1;

  if (timeDifference < 0) { timeDifference = timeDifference*-1; }
  return timeDifference;
}

jobs.timezone = function (cache) {
  var timezoneStr = findTimezone(cache.find('#jobsAboutBuyer ul.oPlainList li'));
  return timezoneStr.split('(')[1].split(')')[0];
}

jobs.location = function (cache) {
  var timezoneStr = findTimezone(cache.find('#jobsAboutBuyer ul.oPlainList li'));
  return timezoneStr.split('(')[0].trim();
}

jobs.applied = function (cache) {
  var applied = cache.find('#main .oMsg.oMsgSuccess').text();
  if (/applied/i.test(applied)) { return true }
  return false;
}

/* Scan tables for matching headings */

jobs.tableScan = function (obj,callback) {
  var str = obj['string'];
  obj['table'].find('tr').each(function(){
    var row = $(this),
        th  = row.find('th').text().trim(),
        td,
        obj;

    if (th == str) {
      td = row.find('td').text().trim();

      if (typeof callback == 'function') { callback({'key':str,'value':td}); }
    }
  });
}

/* Qualifications */

jobs.rateHigh = function (cache) {
  var bool  = false;
  var maxRate;
  var table = cache.find('#jobQualificationsSection');
  jobs.tableScan({'table':table,'string':'Hourly Rate:'},function (obj) {
    var maxRate = obj['value'].split('-')[1].trim().split('/')[0].split('$')[1] * 100;
    if ((myInfo.rate*0.7) > maxRate) { bool = true; }
  });
  return bool;
}

jobs.feedbackHigh = function (cache) {
  var table = cache.find('#jobQualificationsSection');
  var bool = false;
  jobs.tableScan({'table':table,'string':'Feedback Score:'}, function (obj) {
    rating = parseInt(obj['value'].split(' ')[2] * 100);
    if (rating > myInfo.rating) { bool = true; }
  });
  return bool;
}

jobs.feedback = function (cache) {
  var table = cache.find('#jobQualificationsSection');
  var rating = '';
  jobs.tableScan({'table':table,'string':'Feedback Score:'}, function (obj) {
    rating = obj['value'].split(' ')[2];
  });
  return rating;
}

jobs.qualWarning = function (cache) {
  if (jobs.feedbackHigh(cache) == true) { return true; }
  if (jobs.rateHigh(cache) == true) { return true; }
  return false;
}

/* Interview */

jobs.interview = function (cache) {
  var table        = cache.find('#jobActivitySection table');

  jobs.tableScan({'table':table,'string':'Interviewing:'},function (interviewObj) {
    var interview    = interviewObj['value'];

    if (interview.split('(').length > 1) {
      var interviewDollars        = parseInt(interview.split('/')[0].split('$')[1] * 100),
          interviewPercent        = parseInt(interviewDollars/myInfo.rate*100),
          interviewDollarDistance = 60;
      if (interviewPercent <= interviewDollarDistance) {
        job.addClass('interviewLow');
      }
      interview = interview.split('(')[0] + interview.split('(')[1].trim().replace(')','');
    }
    return interview;
  });
  return '';
}

/* Title & URL */

jobs.title = function (cache) { return cache.find('header h1.oH1Huge').text().trim(); }

/* Hourly Rate */

jobs.hourlyRate = function (cache) {
  var val = '';
  var table = cache.find('#jobsAdditionalInfo #jobQualificationsSection table.oDescTable');
  var rate = {};
  var tmp;

  jobs.tableScan({'table':table,'string':'Hourly Rate:'},function (rateObj) {
    tmp = rateObj['value'].replace(/\/hr/gi,'').replace(/\$/gi,'').split('-');
    rate = {
      min: $.trim(tmp[0]),
      max: $.trim(tmp[1])
    }
  });

  if (typeof rate.min != 'undefined') { val = rate; };

  return val;
}

jobs.spending = function (job) {
  var arr = job.find('.oSpendIndicator .oSpendIcon').attr('class').split(' ');
  return arr[1];
}

/* Posted */

jobs.posted = function (cache) { return cache.find('header #jobsJobsHeaderCtime').text(); }

jobs.type = function (cache) { return cache.find('header #jobsJobsHeaderType').text(); }

jobs.duration = function (cache) { return cache.find('header #jobsJobsHeaderEngDuration').text(); }

/* Skills */

jobs.skills = function (cache) {
  var skill = cache.find('#jobSkillsSection .oInlineList').html();
  if (skill) {
    return cache.find('#jobSkillsSection .oInlineList').html();
  }
  return 'N/A';
}

/* Rate */

jobs.rateStats = function (cache) {
  var amt;
  var amtAvg;
  var amtAvgLow       = false;
  var amtHighest      = 0;
  var amtHighestHours = 0;
  var amtHighestLow   = false;
  var amtPrev         = 0;
  var amtTotal        = 0;
  var hours;
  var hoursTotal      = 0;
  var i               = 0;
  var tmp;

  cache.find('#jobHistorySection .cols').each(function () {
    tmp = $(this).find('.col:last').text();
    if (/@/.test(tmp)) {
      i++;
      hourIndex  = tmp.split('@')[0].split(' ').length;
      amtPrev    = amt;
      hours      = tmp.split('@')[0].split(' ')[hourIndex-3]*1;
      amt        = parseInt(tmp.split('@')[1].split('/')[0].trim().split('$')[1]*100);
      amtTotal   += amt;
      hoursTotal += hours;
      /* I multiply by 1 to minimally convert the type to a number */
      /*console.log(jobs.title(cache) + ' ' + tmp);*/
      if (amt > amtHighest && hours > 0) {
        amtHighest      = amt;
        amtHighestHours = hours;
      }
    }
  });

  var amtAvg = Math.round(amtTotal/i)/100;
  if (isNaN(amtAvg)) { amtAvg = ''; }
  else {
    if ((myInfo.rate*0.7) > amtAvg) { amtAvgLow = true; }
    amtAvg = '$' + amtAvg;
  }

  if (amtHighest === 0) { amtHighest = ''; }
  else {
    if ((myInfo.rate*0.7) > amtHighest) { amtHighestLow = true; }
    amtHighest = '$' + amtHighest/100;
  }

  if (amtHighestHours === 0) { amtHighestHours = ''; }

  var obj = {'avg':amtAvg, 'highest-paid':amtHighest, 'highest-paid-hours':amtHighestHours, 'amt-avg-low': amtAvgLow, 'amt-highest-low': amtHighestLow};
  return obj;
}

/* ------------- Job Budget */
jobs.budget = function(cache) {
  var budget = '';
  var type = cache.find('#jobsJobsHeaderType');
  if (/fixed/i.test(type.text())) {
    budget = cache.find('#jobsJobsHeaderAmount').text();
  }
  return budget;
}

/* ------------- Main Format Function */

function jobFormat (job) {
  console.log('formatting ' + job.find('h1.oRowTitle a').text());
  var
      href  = job.find('h1.oRowTitle a').attr('href') + ' #main',
      cache = $('<div/>'),
      obj   = {},
      i     = 0;
      processing = '<div class="processing-container"><div class="wheel"></div></div>'
  
  job.addClass('processing');

  if (job.find('.processing-container').size() < 1) { job.append(processing); }
  
  cache.load(href,function() {
    var rateStats   = jobs.rateStats(cache);
    var jobDescKeys = jobs.moreText(cache);
    var hourlyRate  = jobs.hourlyRate(cache);
    i++;
    if (i < 2) {
      obj['amt-avg-low']        = rateStats['amt-avg-low'];
      obj['applied']            = jobs.applied(cache);
      obj['average-rate']       = rateStats['avg'];
      obj['duration']           = jobs.duration(cache);
      obj['feedback-high']      = jobs.feedbackHigh(cache);
      obj['feedback']           = jobs.feedback(cache);
      obj['highest-paid']       = rateStats['highest-paid'];
      obj['highest-paid-hours'] = rateStats['highest-paid-hours'];
      obj['amt-highest-low']    = rateStats['amt-highest-low'];
      obj['hourly-rate-min']    = hourlyRate.min;
      obj['hourly-rate-max']    = hourlyRate.max;
      obj['interview']          = jobs.interview(cache);
      obj['location']           = jobs.location(cache);
      obj['posted']             = jobs.posted(cache);
      obj['rate-high']          = jobs.rateHigh(cache);
      obj['skills']             = jobs.skills(cache);
      obj['spending']           = jobs.spending(job);
      obj['time-difference']    = jobs.timeDifference(cache);
      obj['timezone']           = jobs.timezone(cache);
      obj['title']              = jobs.title(cache);
      obj['type']               = jobs.type(cache);
      obj['url']                = href;
      obj['warning']            = jobs.qualWarning(cache);
      obj['budget']             = jobs.budget(cache);

      template.get({'src':dir('templates/templates.html'),'template':'job'},function(element) {
        template.get({'src':dir('templates/templates.html'),'template':'job-desc'},function (jobDesc) {

          obj['description'] = template.insert({'template':jobDesc,'keys':jobDescKeys});

          processed = $(template.insert({'template':element,'keys':obj}));
          jobs.moreTextBind(processed);
          job.replaceWith(processed);

          /* Hide or Display Processed Job based on filters */
          if (!jobShow(processed)) { processed.addClass('hidden'); };
        });
      });
    }
  });
}

jobs.format = function () {
  job = $('article.oJobTile');
  job.each(function(){
    if ($(this).find('.right').size() == 0) {
      jobFormat($(this));
    }
  });
}


$(function(){
  var body = $('body');

  /* Job Search, checks if the jobs are loading */
  if (is.jobsearch()) {
    process.check();
    process.validate();
    searchResultsScroll();
  }
  thisWeeksEarnings();
  db.init('odeskplus');
  console.log(is.apply());
});