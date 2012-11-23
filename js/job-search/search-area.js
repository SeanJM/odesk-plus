// Initializations

var myInfo = {};
function jobSearchInit() {
  var cache = $('<div></div>');
  cache.load('/d/view_profile.php #main',function() {
    myInfo.rate   = parseInt(cache.find('.oRateLarge').text().split('/')[0].trim().replace('$','') * 100);
    myInfo.rating = parseInt(cache.find('.oStarsTotal').text().split('(')[1].split(')')[0] * 100);
    cache.find('aside.oSide article.oSideSection table.oDescTable tr').each(function(){
      var row = $(this);
      if (row.find('th').text().trim() == 'Location') {
        var num = row.find('td').text().split('(')[1].split(')')[0].replace('UTC','');
        myInfo.utc = parseInt(num);
        console.log(myInfo.utc);
      }
    })
    formatJobs();
    formatSidebar();
  });
}

function jobShow(job) {
  var check = 1;
  var minDiff = parseInt($('.timeSlider .val').text());
  if ($('#timeDifference').attr('checked') == 'checked' && parseInt(job.attr('timeDifference')) > minDiff) { check = 0; }
  if (job.hasClass('ratingLow') && $('#hideJobRating').attr('checked') == 'checked') { check = 0; }
  if (job.hasClass('interviewLow') && $('#hideJobRate').attr('checked') == 'checked') { check = 0; }
  if (job.hasClass('rateHigh') && $('#hideJobRate').attr('checked') == 'checked') { check = 0; }
  if (check == 1) { return true; }
  return false;
}

function jobFilter() {
  $('article').each(function(){
    var job = $(this);
    console.log(jobShow(job));
    if (jobShow(job) == true) { job.removeClass('hidden'); }
    else { job.addClass('hidden'); }
  });
}

function timeSlide(object) {
  slider = object.slider;
  var container = slider.find('.sliderContainer');
  container.bind('mousedown',function(){
    $('body').addClass('timeSlide');
  });
  $('body').bind('mouseup',function(){
    $('body').removeClass('timeSlide');
    if ($('body').hasClass('timeSlide')) { jobFilter(); }
  });
  $('body').bind('mousemove',function(e){
    if ($(this).hasClass('timeSlide')) {
      var knob = slider.find('.knob');
      var bubble = slider.find('.bubble');
      var knobX = (e.pageX - slider.offset().left)-(knob.width()/2);
      var bubbleX = (e.pageX - slider.offset().left);
      var max = (slider.find('.slider').width()-knob.width());
      if (knobX >= 0 && knobX < max) { 
        knob.css('left',knobX); 
        var val = Math.round(knobX/max*object.max);
        bubble.css('left',bubbleX).find('.val').text(val);
      }
    }
  });
}

function formatSidebar() {
  if ($('.visibilityFilter').size() == 0) {
    var sidebar = $('#main aside.oSide form article.oWidget.jsSearchFormFilters');
    var visibleObj = $('<div class="oPlusSide visibilityFilter"><div class="container"><legend class="oLabel">Visibility</legend></div></div>');
    var rates = $('<label class="oOpt oOptLbl"><input type="checkbox" id="hideJobRate">Hide Jobs with low rates</label>');
    var rating = $('<label class="oOpt oOptLbl"><input type="checkbox" id="hideJobRating">Hide Jobs higher ratings than mine</label>');
    var timeDiff = $('<label class="oOpt oOptLbl"><input type="checkbox" id="timeDifference">Hide time differences larger than:</label>');
    var timeSlider = $('<div class="timeSlider disabled"><div class="sliderContainer"><div class="slider"><div class="knob"></div></div><div class="bubble"><div class="arrow"><div class="face"></div></div><p class="val">0</p></div></div><div class="measure"><span>0</span><span>15</span></div></div>');
    timeSlide({'slider':timeSlider,'min':0,'max':15});
    timeDiff.find('input').bind('click',function(){
      if ($(this).find('input').attr('checked') == 'checked') {
        timeSlider.removeClass('disabled');
      }
      else {
        timeSlider.addClass('disabled');
      }
    });
    visibleObj.find('legend').after(rating).after(rates).after(timeSlider).after(timeDiff);

    sidebar.after(visibleObj);
    
    visibleObj.find('input').bind('click',function(){
      jobFilter();
    });
  }
}


var searchResults = $('section.jsSearchResults');

function getNextPage(nextPageURL,searchResults){
  $.getJSON(nextPageURL,function(data){
    console.log('oDesk+: Next page JSON loaded');
    var cache = $('<div/>');
    var items = [];
    
    $.each(data, function(key, val) {
      if (val != '[object Object]') {
        var output = '<div class="' + key + '">' + val + '</div>';
        if (key == 'paginator_wrapper') { output = '<div class="' + key + '" style="display:none;">' + val + '</div>' }
        if (key != 'jobs_count' && key != 'query_string' && key != 'where_filter' && key != 'sub_cat' && key != 'group') { items.push(output); }
      }
    });
    
    $(items.join('')).appendTo(cache);
    
    cache = cache.replaceWith(cache.contents());
    cache.appendTo(searchResults);

  });
}

function searchResultsScroll(){
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    var paginator           = searchResults.find('nav.oPagination:last'),
        nextPage            = paginator.find('.isCurrent').removeClass('isCurrent').next().addClass('isCurrent').attr('href');
    getNextPage(nextPage,searchResults);
  }
}

function tagPage() {
  if ($('header .oSecondaryNavList li .isCurrent').text() == 'Find Jobs') {
    $('body').addClass('jobs');
  }
}

function moreText(object) {
  var
      text          = object.description.html(),
      job           = object.job,
      jobDesc       = job.find('p.jsDescription'),
      moreBtn       = $('<span class="toggleDesc moreBtn">»</span>'),
      moreContainer = $('<span class="moreText"></span>'),
      lessBtn       = $('<span class="toggleDesc lessBtn">«</span>'),
      fullDesc      = $('<p class="job-description"></p>'),
      moreCreated   = false,
      maxLen        = 400;

  if (text.length > maxLen) {
    var arr = $.trim(text).split(' '),
        str = [],
        temp;
    for (i = 0;i < arr.length;i++) {
      str.push(arr[i]);
      temp = str.join(' ');
      if (moreCreated == false) {
        var opentag = (temp.split('<').length-1) - (temp.split('>').length-1);
        if (temp.length >= maxLen && opentag < 1) {
          moreCreated = true;
          var less = $('<span class="less">' + temp + ' </span>').append(moreBtn);
          fullDesc.append(less);
          str = [];
        }
      }
    }
    moreContainer.append(temp);
    moreContainer.append(lessBtn);
    fullDesc.append(moreContainer);
  }
  else { fullDesc.append(text); }

  jobDesc.replaceWith(fullDesc);
  job.find('p.jsTruncated').remove();

  job.find('.toggleDesc').each(function(){
    $(this).bind('click',function(){
      job.find('p.job-description').toggleClass('show-all');
    });
  });
}
function findTimezone(self) {
  var time = 'Unknown';
  self.each(function(){
    if ($(this).text().split('(').length > 1 && !/reviews/.test($(this).text())) { time = $(this).text(); }
  });
  return time;
}
function jobFormat (job) {
  var 
      href  = job.find('h1.oRowTitle a').attr('href') + ' #main',
      cache = $('<div/>'),
      right = $('<div class="right"><div class="content"></div></div>'),
      left  = $('<div class="left"><div class="content"></div></div>');

      job.children().wrapAll(left);
      job.append(right);

  cache.load(href,function() {
    var description = cache.find('#jobDescriptionSection p');
    moreText({'description':description,'job':job});
    job.find('.oRight a.oBtn').remove();
    job.find('p').each(function(){
      if ($(this).text().length < 1) { $(this).remove(); }
    });

    var applied = cache.find('#main .oMsg.oMsgSuccess').size();
    if (applied) { job.addClass('applied'); }
    
    var qualifications = cache.find('#jobQualificationsSection').removeAttr('id').addClass('qualifications').removeClass('col1of2');
    qualifications.find('tr').each(function(){
      var row = $(this),
          th  = row.find('th').text().trim();
      if (th == 'Hourly Rate:') {
        var rate = parseInt(row.find('td').text().split('-')[1].trim().split('/')[0].replace('$','') * 100);
        if (myInfo.rate > rate) {
          job.addClass('rateHigh');
          row.addClass('warning');
        }
      }
      if (th == 'Feedback Score:') {
        var rating = parseInt(row.find('td').text().split(' ')[2] * 100);
        if (rating > myInfo.rating) {
          job.addClass('ratingLow');
          row.addClass('warning');
        }
      }
    });
    
    var timezoneStr = findTimezone(cache.find('#jobsAboutBuyer ul.oPlainList li'));
    timezone = timezoneStr.split('(')[0] + '<span class="timezone">(' + timezoneStr.split('(')[1] + '</span>';
    timeUTC = timezoneStr.split('(')[1].split(')')[0].replace('UTC','').replace(':','.');
    if (timeUTC.split('').length == 0) { timeUTC = 0; }
    var timezoneObject = $('<p class="location">' + timezone + '</p>');
    var timeDifference = myInfo.utc+parseInt(timeUTC)*-1;
    if (timeDifference < 0) { timeDifference = timeDifference*-1; }
    
    job.attr('timeDifference',timeDifference);

    var interviewTable = cache.find('#jobActivitySection table');

    interviewTable.find('tr').each(function(){
      var row = $(this);
      if (row.find('th').text() == 'Interviewing:') {
        var interview = row.find('td').text();
        if (interview.split('(').length > 1) {
          var interviewDollars        = parseInt(interview.split('/')[0].split('$')[1] * 100),
              interviewPercent        = parseInt(interviewDollars/myInfo.rate*100),
              interviewDollarDistance = 60;
          if (interviewPercent <= interviewDollarDistance) { 
            job.addClass('interviewLow');
          }
          interview = interview.split('(')[0] + '<span class="average">(' + interview.split('(')[1].trim().replace(')','') + ')</span>'
        }
        var interviewObject = $('<p class="interview"><span class="label">Interviewing:</span> ' + interview + '</p>')
        right.append(timezoneObject).append(interviewObject).append(qualifications);
      }
    });
    if (jobShow(job) == false) { job.addClass('hidden'); }

  });
}

function formatJobs() {
  job = $('article.oJobTile');
  job.each(function(){
    if ($(this).find('.right').size() == 0) {
      jobFormat($(this));
    }
  });
}


$(function(){
  var body = $('body');

  tagPage(); 
  
  if (body.hasClass('jobs')) {

    /*body.bind('keyup',function(e) {
      var paginator           = searchResults.find('nav.oPagination:last'),
          nextPage            = paginator.find('.isCurrent').next().attr('href'),
          prevPage            = paginator.find('.isCurrent').prev().attr('href');
    
      if (e.which == 39 && nextPage != 'undefined' && $('body').hasClass('jobs')) {
        window.location = nextPage;
      }
      if (e.which == 37 && prevPage != 'undefined' && $('body').hasClass('jobs')) {
        window.location = prevPage;
      }
    });*/
  }
  /*$(window).bind('scroll',function() {
    searchResultsScroll();
  });*/

});