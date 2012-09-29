function jobsCriteria() {
  
  var searchInfo    = $('#searchInfo'),
      headingTotal  = $('#pageTitle h1 .total'),
      resultDesc    = searchInfo.find('#jobSearchForm .resultDescription').hide(),
      total         = $('<span class="total"></span>'),
      totalJobs     = $('#totalJobs').html();
  
  if (headingTotal.size() < 1) { $('#pageTitle h1').append(total); }
  $('#pageTitle h1 .total').html(' (' + totalJobs + ')');
}

function backLink() {
  
  var backLink    = $('.backLink'),
      container   = $('<div class="container" />'),
      arrow       = $('<span class="arrow sprite"/>');
  
  if (backLink.find('#pageTitle').size() < 1) {
    
    backLink.children('a').appendTo(container).addClass('root');
    
    $('#pageTitle').appendTo(container);
    $('.backLink').attr('formated','true');
    
    container.children('a').each(function() { $(this).after(arrow); });
    
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
        jobTitle              = fieldset.find('#filter-qt');

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
    
    /* 
    Check to make sure the save search link is on the page 
    before appending it 
    */
    var checkSearchLink = setInterval(function(){
      saveSearch = $('#searchInfo .saveSearchLink');
      if (saveSearch.size() > 0) {
        saveSearch.appendTo(moreOptionsContainer);
        clearInterval(checkSearchLink);
      }
    },100);

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
    var total = el.find('dd.skill').size(),
        max   = 3;
    if (total > max && el.find('.extra-skills-container').size() < 1) {
      var container   = $('<div class="extra-skills-container"/>').appendTo(el),
          dropdown    = $('<div class="extra-skills-dropdown" />').appendTo(container),
          extra       = el.find('dd').filter(':gt(' + (max-1) + ')').appendTo(dropdown),
          totalEl = $('<div class="skills-count">' + (total-max) + '<div class="arrow"></div></div>');
      dropdown.before(totalEl);
    }
  }
  function SearchResultsFormatting(el) {
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
            fullDescStr = cache.find('.oMain.break article div.pam:first').html(),
            fullDesc     = $('<p name class="job-description"></p>'),
            maxLen      = 400;
        if (fullDescStr.length > maxLen) {
          var arr = $.trim(fullDescStr).split(' '),
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
        else { fullDesc.append(fullDescStr); }
        jobDesc.after(fullDesc);
        jobDesc.remove();
        /* End More Text */
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
      
      /* Format the header */
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
      if (i >= n) { SearchResultsFormatting($(this)); }
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
    if (!$('#processWheel').hasClass('processing')) {
      $(searchResults).trigger('nextInit');
      
      console.log('oDesk+: Initiating getting of next page');
      
      $.getJSON(nextPageURL,function(data){
        console.log('oDesk+: Next page JSON loaded');
        var items = [];
        
        $.each(data, function(key, val) {
          if (val != '[object Object]') {
            var output = '<div class="' + key + '">' + val + '</div>';
            if (key == 'paginator_wrapper') { output = '<div class="' + key + '" style="display:none;">' + val + '</div>' }
            if (key != 'jobs_count' && key != 'query_string' && key != 'where_filter' && key != 'sub_cat') { items.push(output); }
          }
        });
        
        $(items.join('')).appendTo('#searchResults');
        
        $(searchResults).trigger('nextLoaded');
      });
    }
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
      if (!$('#processWheel').hasClass('processing')) {
        var searchResults       = $('#searchResults').append('<div class="moreList />'),
            paginator           = searchResults.find('.paginator:last'),
            nextPage            = paginator.find('.currentPage').removeClass('currentPage').next().addClass('currentPage').find('a').attr('href');
        getNextPage(nextPage,searchResults);
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
      process($(this));
    }
  },600);

  /* Window Scroll Events */
  $(window).scroll(function() {
    searchResultsScroll();
  });
}
});