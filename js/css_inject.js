$(function(){
  /* Inject CSS */
  // My Jobs
  if ($('#col1 .pageHeader h1').text() == 'My Jobs') {
    $('body').addClass('my_jobs');
  }
  var find_work = $('body .navigation.v2 a[href="/find-work-home/"]');
  if (find_work.hasClass('current')) {
    $('body').addClass('find_work');
    if ($('#col1 .left #jobBasicSearch').length) {
      // Find Jobs Home
      $('body').addClass('find_work_home');
    }
    if ($('body .backLink a[href="/find-work-home/"]').length) {
      // Find Jobs Listing
      $('body').addClass('find_work_list');
    }
    if ($('body #jobActionArea .applyJob').length) {
      // Find Jobs Listing
      $('body').addClass('find_work_details');
    }
  }
});