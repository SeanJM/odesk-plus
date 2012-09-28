
function jobsCriteria() {
  var searchInfo = $('#searchInfo');
  var resultDesc = searchInfo.find('#jobSearchForm .resultDescription');
  var headingTotal = $('#pageTitle h1 .total');
  var totalJobs = $('#totalJobs').html();
  resultDesc.hide();
  if (headingTotal.size() < 1) {
    var total = $('<span class="total"></span>');
    $('#pageTitle h1').append(total);
  }
  $('#pageTitle h1 .total').html(' (' + totalJobs + ')');
}

function backLink() {
  var backLink = $('.backLink');
  var container = $('<div class="container" />');
  var arrow = $('<span class="arrow sprite"/>');
  if (backLink.find('#pageTitle').size() < 1) {
    backLink.children('a').appendTo(container).addClass('root');
    $('#pageTitle').appendTo(container);
    $('.backLink').attr('formated','true');
    container.children('a').each(function() {
      $(this).after(arrow);
    });
    backLink.append(container);
  }
}

function setupSearchInfo() {
  var jobSearchForm = $('#jobSearchForm');
  if (jobSearchForm.attr('format') != 'true') {

    var fieldset              = $('#jobSearchForm fieldset'),
        jobStatusCheckbox     = $('<div class="jobStatusCheckbox" />'),
        searchMoreContainer   = $('<div id="search-more-container"></div>'),
        skillsOptions         = fieldset.children('ul'),
        keywordCheckbox       = fieldset.find('input[name="keepfacet"]'),
        keywordCheckboxLabel  = fieldset.find('label[for="keep-facet"]'),
        keywordSearch         = $('#jobSearchForm fieldset #filter-q'),
        keepFilters           = $('<div class="keepFiltersCheckbox"></div>'),
        searchBtn             = $('#jobSearchForm input.formButton'),
        advancedSearch        = $('#jobSearchForm .switchToAdvanced'),
        moreOptionsContainer  = $('<div id="moreOptionsContainer" />'),
        moreOptionsBtn        = $('<div class="show-more"><span class="more-label">More</span><span class="less-label">Less</span> Options<span class="sprite arrow"></span></div>'),
        jobTitle              = fieldset.find('#filter-qt'),
        saveSearch            = $('#searchInfo .saveSearchLink');

    searchBtn.addClass('btn');
    advancedSearch
      .addClass('btn')
      .html('Advanced');
    
    $('#jobSearchForm .description').appendTo('#jobSearchForm fieldset');
    searchBtn.attr('value','Search').insertAfter(keywordSearch);
    
    keywordCheckbox.appendTo(keepFilters);
    keywordCheckboxLabel.appendTo(keepFilters);
    
    keepFilters.insertAfter(searchBtn);
    
    fieldset.find('div.description').appendTo(jobStatusCheckbox);
    fieldset.find('label[for="filter-st"]').appendTo(jobStatusCheckbox);
    fieldset.find('#filter-st').appendTo(jobStatusCheckbox);
    fieldset.find('label[for="filter-q"]').remove();
    fieldset.find('legend:first').remove();
    fieldset.find('label[for="filter-qt"]').remove();
    
    skillsOptions.find('td.skillsLabel').remove();
    skillsOptions.addClass('skillsOptions');
    
    moreOptionsBtn.bind('click',function(){
      skillsOptions.find('.more').toggle()
      skillsOptions.find('.ac_input').attr('placeholder','Skills');
      
      jobTitle.toggle();
      jobStatusCheckbox.toggle();
      advancedSearch.toggle();
      moreOptionsContainer.toggleClass('more');
      $(this).toggleClass('more');
    });

    jobTitle.attr('placeholder','Job Title').appendTo(moreOptionsContainer);
    skillsOptions.appendTo(moreOptionsContainer);
    jobStatusCheckbox.hide().appendTo(moreOptionsContainer);
    advancedSearch.hide().appendTo(moreOptionsContainer);
    
    moreOptionsContainer.insertAfter(fieldset.find('.keepFiltersCheckbox'));
    moreOptionsBtn.insertBefore(moreOptionsContainer);
    
    saveSearch.appendTo(moreOptionsContainer);
    keywordSearch.attr('placeholder','Keywords').wrap('<div class="keywordsCheckbox"></div>');
    
    setTimeout(function() { 
      jobSearchForm.attr('format','true'); 
    },300);
    backLink();
  }
}

$(function () {
if ($('#searchResults').size() > 0) {
  
  setupSearchInfo();

  /* ---------------------------
        Search Results
  ------------------------------ */
  function skillsFormat(el){
    var total = el.find('dd.skill').size();
    if (total > 3 && el.find('.extra-skills-container').size() < 1) {
      var container = $('<div class="extra-skills-container"/>');
      var extra = el.find('dd').filter(':gt(2)');
      var dropdown = $('<div class="extra-skills-dropdown" />');
      extra.appendTo(dropdown);
      dropdown.appendTo(container);
      el.append(container);
      var extraTotal = dropdown.find('dd.skill').size();
      var totalEl = $('<div class="skills-count">' + extraTotal + '<div class="arrow"></div></div>');
      dropdown.before(totalEl);
    }
  }
  function JobResultsQualifications(el) {
    if (!el.attr('format')) {
      var jobLink           = el.find('h3 a').attr('href'),
        link              = jobLink + ' #main',
        extraInfo         = $('<div class="extraInfo"><div class="icon sprite"></div><div class="extraContent"></div></div>'),
        extraInfoContent  = extraInfo.find('.extraContent'),
        cache             = $('<div></div>');
      cache.load(link,function(){
        el.attr('format','');
        // ---- Qualifications ---- //
        var qualifications  = cache.find('.col.col1of2:first table.oDescTable');
        if (qualifications.size() > 0) {
          extraInfoContent.prepend('<div class="arrow"></div>');
          /* build the data container */
          var dataContainer = $('<div class="dataContainer"><div class="tableContainer"><div class="arrow sprite"></div></div></div>'),
              yellowWarning = qualifications.find('.oWarningIcon');
              warningNum    = yellowWarning.size();
          dataContainer.find('.tableContainer').append(qualifications);
          if (warningNum > 0) {
            extraInfo.addClass('yellowWarning');
            yellowWarning.each(function(){ $(this).parents('tr').addClass('yellowWarning'); });
            extraInfo.find('.icon').html(warningNum);
          }
        }
        var jobApply = cache.find('.oMsgSuccess');
        if (jobApply.size()) {
          extraInfo.addClass('applied');
          el.addClass('applied').addClass('collapsed');
        }
        var timestr = cache.find('.oSide .oSideSection .ptl:first').text().split('(');
        var timeZone = $('<div class="timezone"><p class="country">' + timestr[0] + '</p>' + ' (' + timestr[1] + '</div>');
        extraInfoContent.append(dataContainer);
        el.find('.resultHeader h3').append(extraInfo);
        if (el.find('.timezone').size() < 1) {
          el.find('.resultHeader').append(timeZone);
        }
        el.bind('click',function(){
          if ($(this).hasClass('applied')) {
            $(this).toggleClass('collapsed');
          }
        })
        /* More text */
        var jobDesc     = el.find('p[name]'),
            moreBtn     = $('<span class="toggleDesc moreBtn">»</span>'),
            lessBtn     = $('<span class="toggleDesc lessBtn">«</span>'),
            fullDescStr = cache.find('.oMain.break article div.pam:first').html();
            fullDesc     = $('<p name class="job-description"></p>'),
            maxLen      = 200;
        function formatDesc(e) {
          if (e.length > maxLen) {
            var arr = $.trim(e).split(' '),
                str = [],
                temp,
                moreContainer = $('<span class="moreText"></span>'),
                moreCreated = false;
            for (i = 0;i < arr.length;i++) {
              /* Temporarily close all br tags */
              str.push(arr[i]);
              temp = str.join(' ');
              if (moreCreated == false) {
                var opentag = (temp.split('<').length-1) - (temp.split('>').length-1);
                if (temp.length >= maxLen && opentag < 1) {
                  moreCreated = true;
                  var less = $('<span class="less">' + temp + ' </span>');
                  less.append(moreBtn);
                  fullDesc.append(less);
                  str = [];
                }
              }
            }
            moreContainer.append(temp);
            moreContainer.append(lessBtn);
            fullDesc.append(moreContainer);
          }
          else { fullDesc.append(e); }
        }
        formatDesc(fullDescStr);
        /*fullDesc.append(lessBtn);*/
        jobDesc.after(fullDesc);
        jobDesc.remove();
        el.find('.toggleDesc').each(function(){
          $(this).bind('click',function(){
            el.find('p.job-description').toggleClass('show-all');
          });
        });
        /* Duration of Jobs */
        var time = cache.find('header.phs hgroup p.oText:first');
        el.find('.resultHeader dl:first').remove();
        /* Sometimes these are loading twice, this will prevent that */
        if (el.find('.resultHeader p.oText').size() < 1) { 
          el.find('.resultHeader h3').after(time);
        }
      });
      skillsFormat(el.find('dl.skills'));
      var heading         = el.find('.resultHeader h3 a'),
          headingShort    = heading.html(),
          maxHeadingLen   = 70;
      if (headingShort.length > maxHeadingLen) { 
        headingShort = headingShort.substring(0, maxHeadingLen) + "...";
      }
      heading.html(headingShort);
      el.find('.skills .qualifications').parent().remove();
    }
  }

  function formatJobResults(){
    var n = $('.searchResult .resultHeader .extraInfo').size();
    
    $('.searchResult .resultButtons').each(function() { $(this).remove() });
    $('.searchResult').each(function(i){
      if (i >= n) { JobResultsQualifications($(this)); }
    });
  }

  function checkClosedJobs(){
    $('.searchResult .resultStatus').each(function(){
      if ($(this).html() == 'Closed') { $(this).parents('.searchResult').addClass('jobClosed'); }
    });
  }

  /* Inifite Scroll Jobs */
  function jobCount(el) {
    var count = $('.searchResult').size(),
        total = $('#totalJobs').html();
    if ($('#searchCount').size() <= 0) {
      var searchCount = $('<div id="searchCount"><p>Viewing <span class="count"></span> of <span class="total"></span></p></div>');
      el.after(searchCount);
    }
    $('#searchCount .count').html(count);
    $('#searchCount .total').html(total);
  }

  function process(par){
    elem = $('#searchResults');
    if ($('#processWheel').size() < 1) {
      var process = $('<div id="processWheel"><div class="spinner"></div></div>');
      elem.after(process);
    }
    else {
      if (par == 'start') { $('#processWheel').addClass('processing'); }
      if (par == 'end') { $('#processWheel').removeClass('processing'); }
    }
    jobCount(elem);
  }

  function getNextPage(nextPageURL,searchResults){
    /* Process Wheel */
    $(searchResults).trigger('nextInit');
    console.log('oDesk+: Initiating getting of next page');
    $.getJSON(nextPageURL,function(data){
      console.log('oDesk+: Next page JSON loaded');
      var items = [];
      $.each(data, function(key, val) {
        if (val != '[object Object]') {
          var output = '<div class="' + key + '">' + val + '</div>';
          if (key == 'paginator_wrapper') { output = '<div class="' + key + '" style="display:none;">' + val + '</div>' }
          items.push(output);
        }
      });
      $('<div/>', {
        'class': 'moreResults',
        html: items.join('')
      }).appendTo('#searchResults');
      $('.moreResults > .content').appendTo('#searchResults');
      // Remove Apply Button
      $('.moreResults').remove();
      $(searchResults).trigger('nextLoaded');
    });
  }
  /* After the next page is loaded */
  $('#searchResults').bind('nextInit',function(){
      process('start');
  });
  $('#searchResults').bind('nextLoaded',function(){
      formatJobResults();
      checkClosedJobs();
      process('end');
  });
  function searchResultsScroll(){
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      if ($('.find_work_list').length) {
        if (!$('#processWheel').hasClass('processing')) {
          var searchResults = $('.find_work_list #searchResults');
          var paginator = searchResults.find('ul.paginator:last');
          var nextPage = paginator.find('.currentPage').removeClass('currentPage').next();
          nextPage.addClass('currentPage');
          var pagLast = $('.paginator:last');
          var currentPageNumber =  pagLast.find('li.currentPage').text();
          var lastPageNumber = pagLast.find('li:last').prev().text();
          searchResults.append('<div class="moreList" />');
          getNextPage(nextPage.find('a').attr('href'),searchResults);
        }
      }
    }
  }
  
  function formatModules(){
    console.log('oDesk+: Formating Main modules');
    jobsCriteria();
    checkClosedJobs();
    formatJobResults();
  }
  /* Fire functions that require post processing */
  $('#searchResults').bind('processend',function(){
    console.log('oDesk+: oDesk default job processing complete');
    formatModules();
    process($(this));
  });
  /* When the page newly loads, it doesn't trigger a process 
    so run these after one second if no processing has occurred
  */
  setTimeout(function(){
    if ($('#searchResults').attr('format') != 'true') {
      console.log('oDesk+: oDesk default job processing did not complete, running timeout tasks');
      formatModules();
    }
  },600);

  /* Window Scroll Events */
  $(window).scroll(function() {
    searchResultsScroll();
  });
}
});
/* */