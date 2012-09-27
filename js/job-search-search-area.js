$(function () {
if ($('#searchResults').size() > 0) {
  /* -----------------------------
      Set Up the Job Filters
  ----------------------------- */
  
  
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
  
  /* ---------------------------
        Main Search Module
  ------------------------------ */
  
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
    backLink.children('a').appendTo(container).addClass('root');
    $('#pageTitle').appendTo(container);
    $('.backLink').attr('formated','true');
    container.children('a').each(function() {
      $(this).after(arrow);
    });
    backLink.append(container);
  }
  
  function setupSearchInfo() {
    var jobSearchForm = $('#jobSearchForm');
    console.log('run');
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
      jobStatusCheckbox.hide().appendTo(moreOptionsContainer);
      skillsOptions.appendTo(moreOptionsContainer);
      advancedSearch.hide().appendTo(moreOptionsContainer);
      
      moreOptionsContainer.insertAfter(fieldset.find('.keepFiltersCheckbox'));
      moreOptionsBtn.insertBefore(moreOptionsContainer);
      
      saveSearch.appendTo(moreOptionsContainer);
      keywordSearch.attr('placeholder','Keywords').wrap('<div class="keywordsCheckbox"></div>');
      
      setTimeout(function() { 
        jobSearchForm.attr('format','true'); 
      },300);

    }
  }
  
  setupSearchInfo();

  /* ---------------------------
        Search Results
  ------------------------------ */
  function skillsFormat(el){
    var total = el.find('dd.skill').size();
    if (total > 3) {
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
    var jobLink = el.find('h3 a').attr('href');
    var link = jobLink + ' #main';
    // ---- Qualifications ---- //
    var extraInfo = $('<div class="extraInfo"><div class="icon sprite"></div><div class="extraContent"></div></div>');
    var extraInfoContent = extraInfo.find('.extraContent');
    var cache = $('<div></div>');
    cache.load(link,function(){
      var qualifications = cache.find('.col.col1of2:first table.oDescTable');
      if (qualifications.size() > 0) {
        extraInfoContent.prepend('<div class="arrow"></div>');
        /* build the data container */
        var dataContainer = $('<div class="dataContainer"><div class="tableContainer"><div class="arrow sprite"></div></div></div>');
        dataContainer.find('.tableContainer').append(qualifications);
        var yellowWarning = qualifications.find('.oWarningIcon');
        var warningNum = yellowWarning.size();
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
      el.find('.resultHeader').append(timeZone);
      el.bind('click',function(){
        if ($(this).hasClass('applied')) {
          $(this).toggleClass('collapsed');
        }
      })
      /* More text */
      var jobDesc = el.find('p[name]');
      if (jobDesc.find('.more_link').size() > 0) {
        jobDesc.find('.more_link').remove();
        var jobStr    = jobDesc.html(),
            jobLen    = jobStr.length,
            moreBtn   = $('<span class="toggleDesc moreBtn">»</span>'),
            lessBtn   = $('<span class="toggleDesc lessBtn">«</span>'),
            fullDesc  = $('<div class="fullDesc" style="display: none;"></div>'),
            fullText  = cache.find('.oMain.break article div.pam:first');
        jobDesc
          .addClass('hasMore')
          .append(moreBtn)
          .after(fullDesc)
          .find('a').remove()
          .html(jobStr.substring(0,jobLen - 3));
        fullDesc.append(fullText);
        fullText.append(lessBtn);
        el.find('.toggleDesc').each(function(){
          $(this).bind('click',function(){
            jobDesc.toggle();
            fullDesc.toggle();
          });
        });
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
  function JobResultsGetMoreText(el) {
  }

  function JobResultsGetApplication(el) {
    var link = el.find('h3 a').attr('href');
    el.find('h3 a').bind('click',function(event){
      /* Stop the link from changing locations */
      event.preventDefault();
      var appbox = $('<div id="app-box"><div class="applink"></div><div id="appmodule"></div></div>');
      $('body').append(appbox);
      applink = link + '.oSide article.oSideSection a.oBtn.oBtnPrimary.oBtnJumbo.mvs'
      appbox.find('.applink').load(applink,function(){
        var appmodulelink = appbox.find('.applink a').attr('href') + ' #main';
        appbox.find('#appmodule').load(appmodulelink,function(){
          var module = $('#appmodule');
          module.find('meta').remove();
          module.find('footer').remove();
          module.find('header').remove();
          /*module.find('link').remove();*/
        });
      });
    });
  }

  function formatJobResults(){
    $('.searchResult .resultButtons').each(function() { $(this).remove() });
    var n = $('.searchResult .resultHeader .extraInfo').size();
    $('.searchResult').each(function(i){
      var job = $(this);
      if (i >= n) {
        JobResultsQualifications(job);
        JobResultsGetMoreText(job);
      }
    }); // Search Result Each Function //
  }

  function checkClosedJobs(){
    $('.searchResult .resultStatus').each(function(){
      if ($(this).html() == 'Closed') { $(this).parents('.searchResult').addClass('jobClosed'); }
    });
  }

  /* Inifite Scroll Jobs */
  function jobCount(el) {
    var count = $('.searchResult').size();
    var total = $('#totalJobs').html();
    if ($('#searchCount').size() <= 0) {
      var searchCount = $('<div id="searchCount"><p>Viewing <span class="count"></span> of <span class="total"></span></p></div>');
      el.after(searchCount);
    }
    $('#searchCount .count').html(count);
    $('#searchCount .total').html(total);
  }

  function duration(time) {
    
    var minutes   = time / 60,
        hours     = Math.round(minutes / 60),
        days      = Math.round(hours / 24),
        months    = Math.round(days / 28),
        time      = hours + ' hours ago';

    if (days > 1) { time = days + ' days ago'; }
    if (months > 1) { time = months + ' months ago'; }
    
    return time;
  }

  function findTime(oldTime,newTime) {
    var timeStamp   = parseInt(oldTime.attr('data-timestamp').slice(0,-1)),
        newTime     = parseInt(newTime.slice(0,-1)),
        hours       = 1;
    if (oldTime.html() != 'about an hour ago') {
      var hours = parseInt($.trim(oldTime.html().replace('hours ago',"")));
    }
    return (timeStamp + (hours * 3600)) - newTime;
  }

  function process(elem){
    $('#processWheel').toggleClass('processing');
    if ($('#processWheel').size() < 1) {
      var process = $('<div id="processWheel"><div class="spinner"></div></div>');
      elem.after(process);
    }
    jobCount(elem);
  }

  function getNextPage(nextPageURL,searchResults){
    /* Process Wheel */
    process(searchResults);
    $.getJSON(nextPageURL,function(data){
      process(searchResults);
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
      // Add time to job listings
      $('span.autoRelativeTime').each(function(){
        var el = $(this);
        if (el.html() == '') {
          var currentTime   = Math.round(new Date().getTime() / 1000),
              newTime       = el.attr('data-timestamp'),
              totalTime     = findTime($('span.autoRelativeTime:first'),newTime),
              ts            = duration(totalTime);
          el.html(ts);
        }
      });
      formatJobResults();
      checkClosedJobs();
    });
  }

  function searchResultsScroll(){
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      if ($('.find_work_list').length) {
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
  
  function formatModules(){
    /*setupFilters();*/
    bindSelectFilter();
    jobsCriteria();
    backLink();
    checkClosedJobs();
    formatJobResults();
    process($('#searchResults'));
  }
  /* Fire functions that require post processing */
  $('#searchResults').bind('processend',function(){
    formatModules();
  });
  /* When the page newly loads, it doesn't trigger a process 
    so run these after one second if no processing has occurred
  */
  setTimeout(function(){
    if ($('#searchResults').attr('format') != 'true') {
      formatModules();
    }
  },600);

  /* Window Scroll Events */
  $(window).scroll(function() {
    /*filterScroll();*/
    searchResultsScroll();
  });
}
});
/* */