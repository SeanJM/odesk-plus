/* Returns the Chrome URL */

function dir (str) { return $('html').attr('directory') + str; }
template.dir = function() { return dir('../templates/templates.html'); }

/* Site Map */

var url = {
  Applications: '/applications',
  Home        : '/home',
  Profile     : '',
  Report      :
  { Home      :'/reports',
    Timelogs  :'/reports/timelogs' },
  Wallet      : '/withdrawal-methods'
}

/* Clean Page */
function removeContent() { $('body').children('remove'); }

/* A general UI and Interaction library that is barebones */

k = {};

k.expander = function (el) {
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

k.dropdown = function (el) {
  el.find('.dropdown-trigger').each(function (e) {
    $(this).unbind('click');
    $(this).bind('click',function (event) {
      $('.gactive').removeClass('active');
      if ($(event.target).parents('.dropdown-menu').size() < 1) {
        $(this).closest('.dropdown').toggleClass('active');
      }
    });
  });
}

k.offClick = function () {
  $('html').unbind('click');
  $('html').bind('click',function (event) {
    if ($(event.target).closest('.active').size() < 1) {
      $('dropdown.active').removeClass('active');
      $('popup.active').removeClass('active');
    }
  });
}

k.init = function (el) {
  k.dropdown(el);
  k.expander(el);
  k.offClick();
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

  var tmp = $('<div></div>');
  var timelogs = '/reports/timelogs #hourly .oReportTable:eq(0)';
  var earnings = '/withdrawal-methods table.oDescTable .oPos';
  var keys = {};
  var header = $('header:first');

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
        k.init(processed);
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

function formatSidebar() {
  template.get({'src':dir('templates/templates.html'),'template':'job-filters'},function(element) {
    if ($('.visibilityFilter').size() == 0) {
      var element = $(element);
      var timeDiff = element.find('#timeDifference');
      var timeSlider = element.find('.timeSlider');

      timeSlide({'slider':timeSlider,'min':0,'max':15});

      timeDiff.bind('click',function(){
        if ($(this).attr('checked') == 'checked') {
          timeSlider.removeClass('disabled');
        }
        else {
          timeSlider.addClass('disabled');
        }
      });

      element.find('input').bind('click',function(){ jobFilter(); });
      element.insertAfter('.oSide .jsSearchFormFilters');
    }
  });
}

function timeSlide(object) {
  slider = object.slider;
  var bubble    = slider.find('.bubble');
  var container = slider.find('.sliderContainer');
  var knob      = slider.find('.knob');

  container.bind('mousedown',function(){
    $('body').addClass('timeSlide');
  });

  $('body').bind('mouseup',function(){
    if ($('body').hasClass('timeSlide')) { jobFilter(); }
    $('body').removeClass('timeSlide');
  });

  $('body').bind('mousemove',function(e){
    if ($(this).hasClass('timeSlide')) {
      var knobX   = (e.pageX - slider.offset().left)-(knob.width()/2);
      var bubbleX = (e.pageX - slider.offset().left-bubble.width()/2);
      var max     = (slider.find('.slider').width()-knob.width());
      if (knobX >= 0-(knob.width()/2) && knobX < max+(knob.width()/3)) {
        knob.css('left',knobX);
        var val = Math.round(knobX/max*object.max);
        bubble.css('left',bubbleX).find('.val').text(val);
        slider.find('.fill').css('width',knobX+knob.width()/2);
      }
    }
  });
}

/* ------------- Job Search Main Area */

/* Infinite Scroll */

function getNextPage(nextPageURL,searchResults){
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
    var searchResults = $('section.jsSearchResults');
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      var paginator           = $('#main').find('nav.oPagination:last'),
          nextPage            = paginator.find('.isCurrent').removeClass('isCurrent').next().addClass('isCurrent').attr('href');
      getNextPage(nextPage,searchResults);
    }
  })
}

/* ------------- Job Filters */

function jobShow(element) {
  var check = 1;
  var minDiff = parseInt($('.timeSlider .val').text());
  if ($('#timeDifference').attr('checked') == 'checked' && parseInt(element.attr('timeDifference')) > minDiff) { check = 0; }
  if (element.hasClass('lowFeedback-true') && $('#hideJobRating').attr('checked') == 'checked') { check = 0; }
  if (element.hasClass('interviewLow') && $('#hideJobRate').attr('checked') == 'checked') { check = 0; }
  if (element.hasClass('highRate-true') && $('#hideJobRate').attr('checked') == 'checked') { check = 0; }
  if (element.hasClass('avgRateLow-true') && $('#hideAvgRate').attr('checked') == 'checked') { check = 0; }
  if (check == 1) { return true; }
  return false;
}

function jobFilter() {
  $('article').each(function(){
    var job = $(this);
    if (jobShow(job) == true) { job.removeClass('hidden'); }
    else { job.addClass('hidden'); }
  });
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
  var applied = cache.find('#main .oMsg.oMsgSuccess').size();
  if (applied) { return true }
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
  var rate;

  jobs.tableScan({'table':table,'string':'Hourly Rate:'},function (rateObj) {
    rate = rateObj['value'];
  });

  if (typeof rate != 'undefined') { val = rate; };

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
    var rateStats = jobs.rateStats(cache);
    var jobDescKeys = jobs.moreText(cache);
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
      obj['hourly-rate']        = jobs.hourlyRate(cache);
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
      obj['visibility']         = jobShow(job);
      obj['warning']            = jobs.qualWarning(cache);

      template.get({'src':dir('templates/templates.html'),'template':'job'},function(element) {
        template.get({'src':dir('templates/templates.html'),'template':'job-desc'},function (jobDesc) {

          obj['description'] = template.insert({'template':jobDesc,'keys':jobDescKeys});

          processed = $(template.insert({'template':element,'keys':obj}));
          jobs.moreTextBind(processed);
          job.replaceWith(processed);
          if (jobShow(processed) == false) { processed.addClass('hidden'); }
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
  process.check();
  process.validate();
  searchResultsScroll();
  thisWeeksEarnings();

});