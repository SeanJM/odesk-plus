$(function(){
  function modifyTables() {
    var sent = $('#applications table');
    var load = $('<div class="loading"><p>Loading...</p><div class="loading-container"><div class="loadbar"></div></div></div>');
    var loadbarSize = sent.find('tbody tr').size();
    var i = 0;


    loadX = $(window).height()/2+load.height()/2;
    loadY = ($(window).width()/2)-(load.width()/2);
    load.css('top',loadX).css('left',loadY);

    $('body').append(load);

    sent.find('thead tr').append('<th>Interviewing</th>');
    sent.find('thead tr').append('<th>Location</th>');
    sent.find('thead tr').append('<th>Rate</th>');
    sent.find('tbody tr').each(function(){
      var row = $(this);
      var days = row.find('td:first .oSupportInfo').text().split(' ')[0];
      var timeScale = row.find('td:first .oSupportInfo').text().split(' ')[1];
      if (timeScale == 'minutes' || timeScale == "hours") {
        days = 0;
      }
      var address = row.find('a').attr('href') + ' #mainBody';
      var cache = $('<div></div>');
      if (days >= 14 && days < 25) { row.addClass('medium'); }
      if (days >= 21) { row.addClass('overdue'); }
      cache.load(address,function(){
        var locationArr = cache.find('#jobFactsBox li[name="applicationBuyerLocation"]').text().replace('Location: ','').split(' ');
        var location = [];
        for (var n=0;n<locationArr.length;n++) {
          if (n == locationArr.length-1) {
            location.push('<span class="timezone">' + locationArr[n] + '</span>');
          }
          else { location.push(locationArr[n]); }
        }
        location = location.join(' ');
        var rate = cache.find('#proposedTerms dd strong[name="dataActionBoxTermsRate"]').text();
        var locData = $('<td>' + location + '</td>');
        var rateData = $('<td>' + rate + '</td>');
        var applicationDetails = cache.find('p[name="applicationJobDetails"] a').attr('href') + ' #jobActivitySection';
        var jobCache = $('<div></div>');
        jobCache.load(applicationDetails,function(){
          jobCache.find('tr').each(function(){
            if ($(this).find('th').text() == "Interviewing:") {
              i++;
              var interview = $(this).find('td').text();
              var interviewData = $('<td>' + interview + '</td>')
              row.append(interviewData);
              row.append(locData);
              row.append(rateData);
              load.find('.loadbar').css('width',((i)/loadbarSize*100) + '%');
              if (i == loadbarSize) { load.remove(); }
            }
          });
        });
      });
    });
  }

  if ($('#main h1.oH1.inlineBlock').text() == "My Job Applications") {
    $('body').addClass('job-application');
    modifyTables();
  }
  
  function jobApplicationPage() {
    $('body').addClass('apply');
  }

  if ($('aside .oSideSection .oBtn.oBtnPrimary').text().trim().split(' ')[0] == 'Apply') {
    jobApplicationPage();
  }

});