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

  if ($('#jobSearchForm').attr('format') != 'true') {

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
      $('#jobSearchForm').attr('format','true'); 
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

    function SearchResultsQualifications(object) {
      var cache             = object['cache'],
          job               = object['job'],
          qualifications    = cache.find('.col.col1of2:first table.oDescTable'),
          yellowWarning     = qualifications.find('.oWarningIcon'),
          warningNum        = yellowWarning.size(),
          extraInfo         = $('<div class="extraInfo"><div class="icon sprite"></div><div class="extraContent"></div></div>'),
          extraInfoContent  = extraInfo.find('.extraContent'),
          dataContainer     = $('<div class="dataContainer"><div class="tableContainer"><div class="arrow sprite"></div></div></div>');
      
      
      if (qualifications.size() > 0) {
        
        extraInfoContent.prepend('<div class="arrow"></div>');
        dataContainer.find('.tableContainer').append(qualifications);
        
        if (warningNum > 0) {
          
          extraInfo.addClass('yellowWarning');
          yellowWarning.each(function(){ $(this).parents('tr').addClass('yellowWarning'); });
          extraInfo.find('.icon').html(warningNum);

        }
      }
      extraInfoContent.append(dataContainer);
      job.find('.resultButtons').remove();
      job.find('.resultHeader h3').append(extraInfo);
    }

    function SearchResultsApplyBool(object) {
      var cache     = object['cache'],
          job       = object['job'],
          jobApply  = cache.find('.oMsgSuccess');
          
      if (jobApply.size()) {
        job.addClass('applied').addClass('collapsed');
      }

      job.bind('click',function(){
        if ($(this).hasClass('applied')) {
          $(this).toggleClass('collapsed');
        }
      });

      job.find('.skills .qualifications').parent().remove();
    }

    function SearchResultsTimezoneTip(object) {
      var cache     = object['cache'],
          job       = object['job'];
          timestr = cache.find('.oSide .oSideSection .ptl:first').text().split('('),
          timeZone = $('<div class="timezone"><p class="country">' + timestr[0] + '</p>' + ' (' + timestr[1] + '</div>');

      if (job.find('.timezone').size() < 1) {
        job.find('.resultHeader').append(timeZone);
      }
    }

    function stripRedirect(text) {
      var links = $(text).find('a');
      if (links.size() > 0) {
        links.each(function(){
          var href = 'http://' + $(this).attr('href').replace('https://www.odesk.com/leaving_odesk.php?ref=http%253A%252F%252F','');
          $(this).attr('href',href).html();
        });
      }
      return text.html();
    }

    function SearchResultsMoreText(object) {
      var cache         = object['cache'],
          job           = object['job'],
          jobDesc       = job.find('p[name]'),
          moreBtn       = $('<span class="toggleDesc moreBtn">»</span>'),
          moreContainer = $('<span class="moreText"></span>'),
          lessBtn       = $('<span class="toggleDesc lessBtn">«</span>'),
          fullDescStr   = stripRedirect(cache.find('.oMain.break article div.pam:first')),
          fullDesc      = $('<p name class="job-description"></p>'),
          moreCreated   = false,
          maxLen        = 400;

      if (fullDescStr.length > maxLen) {
        var arr = $.trim(fullDescStr).split(' '),
            str = [],
            temp;

        for (i = 0;i < arr.length;i++) {
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

      job.find('.toggleDesc').each(function(){
        $(this).bind('click',function(){
          job.find('p.job-description').toggleClass('show-all');
        });
      });
    }

    function SearchResultsStatusLine(object) {
      var cache   = object['cache'],
          job     = object['job'],
          time    = cache.find('header.phs hgroup p.oText:first');
      job.find('.resultHeader dl:first').remove();
      
      if (job.find('.resultHeader p.oText').size() < 1) { 
        job.find('.resultHeader h3').after(time);
      }
    }
    function SearchResultsHeading(object) {
      var cache           = object['cache'],
          job             = object['job'],
          heading         = job.find('.resultHeader h3 a'),
          headingShort    = heading.html(),
          maxHeadingLen   = 70;
      if (headingShort.length > maxHeadingLen) { 
        headingShort = headingShort.substring(0, maxHeadingLen) + "...";
      }
      heading.html(headingShort);
    }

    function SearchResultsFormatting(el) {
      if (!el.attr('format')) {
        
        var link     = el.find('h3 a').attr('href') + ' #main',
            cache    = $('<div />'),
            object   = {'cache':cache,'job':el};
        
        cache.load(link,function(){
          
          el.attr('format','');
          
          SearchResultsQualifications(object);
          SearchResultsApplyBool(object);
          SearchResultsTimezoneTip(object);
          SearchResultsMoreText(object);
          SearchResultsStatusLine(object);
          SearchResultsHeading(object);

        });
        
        skillsFormat(el.find('dl.skills'));
         
        /* Format the header */
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
      var count         = $('.searchResult').size(),
          searchCount   = $('<div id="searchCount"><p>Viewing <span class="count"></span> of <span class="total"></span></p></div>'),
          total         = $('#totalJobs').html(),
          totalArr      = total.split(''),
          totalLen      = totalArr.length,
          pro           = [],
          orp           = [];
      if ($('#searchCount').size() <= 0) {
        el.after(searchCount);
      }
      if (totalLen > 3) {
        for (i = 0;i <= totalLen;i++) {
          pro.push(totalArr[totalLen - i]);
          if ((i % 3) == 0 && i > 0) { pro.push(','); }
        }
        for (i = 0;i <= pro.length;i++) {
          orp.push(pro[pro.length - i]);
        }
        total = orp.join('');
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
          var cache = $('<div/>');
          var items = [];
          
          $.each(data, function(key, val) {
            if (val != '[object Object]') {
              var output = '<div class="' + key + '">' + val + '</div>';
              if (key == 'paginator_wrapper') { output = '<div class="' + key + '" style="display:none;">' + val + '</div>' }
              if (key != 'jobs_count' && key != 'query_string' && key != 'where_filter' && key != 'sub_cat' && key != 'group') { items.push(output); }
            }
          });
          
          var preformated = $(items.join('')).appendTo(cache);
          
          preformated.find('.searchResult').each(function(){
            SearchResultsFormatting($(this));
          });

          var checkFormat = setInterval(function() {
            if (cache.find('.searchResult[format]').size() >= cache.find('.searchResult').size()) {
              
              cache.appendTo('#searchResults');
              cache.replaceWith(cache.contents());
              $(searchResults).trigger('nextLoaded');

              clearInterval(checkFormat);
            }
          },200);

        });
      }
    }
    /* After the next page is loaded */
    $('#searchResults').bind('nextInit',function(){
        process('start');
    });
    $('#searchResults').bind('nextLoaded',function(){
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
