// Initializations

function jobSearchInit() {
    formatJobs();
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
    
    var timezone = findTimezone(cache.find('#jobsAboutBuyer ul.oPlainList li'));
    findTimezone(cache.find('#jobsAboutBuyer ul.oPlainList li'));
    var timezoneObject = $('<p class="timezone">' + timezone + '</p>');

    var interviewTable = cache.find('#jobActivitySection table');
    interviewTable.find('tr').each(function(){
      if ($(this).find('th').text() == 'Interviewing:') {
        var interview = $(this).find('td').text();
        var interviewObject = $('<p class="interview"><span class="label">Interviewing:</span> ' + interview + '</p>')
        right.append(timezoneObject).append(qualifications).append(interviewObject);
      }
    });

  });
}

function formatJobs() {
  job = $('article.oJobTile');
  job.each(function(){
    jobFormat($(this));
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