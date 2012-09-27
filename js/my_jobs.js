 $(function(){
 // My Jobs
  var job_applications = $('body .navigation.v2 a[href="/applications/active/"]');
  if (job_applications.hasClass('current')) {
    $('body').addClass('job_applications');
    fn_job_application();
  }
});