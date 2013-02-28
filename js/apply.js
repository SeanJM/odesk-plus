var str = '\n\nThank you,\n\nSean MacIsaac -- http://www.seanjmacisaac.com/'
$(function(){
  //Make sure we are on the job application page
  if ($('#jobsApply').size()) {
    /*$('textarea[name="coverLetter"]').html(str);*/
    $('#jobDetails .less').remove();
    $('#jobDetails .more').toggleClass('oHidden');
  }
});