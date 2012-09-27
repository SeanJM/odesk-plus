$(function(){
  
  /*  -------------------------------------------------
    
    Search Jobs Processing Event

    Usage:
    
      Start:  $('#searchResults').bind('process');
      End:    $('#searchResults').bind('processend');

  ----------------------------------------------------- */
  
  var checkProcess = setInterval(function(){ if ($('#searchResults').hasClass('process')) { clearInterval(checkProcess); $('#searchResults').trigger('process'); } },20);
  /* Have a 3 second timeout to kill the check */
  setTimeout(function(){ clearInterval(checkProcess); },3000);
  // Execute the check to see if processing is over
  $('#searchResults').bind('process',function(){ 
    var checkProcessOver = setInterval(function(){ if (!$('#searchResults').hasClass('process')) { clearInterval(checkProcessOver); $('#searchResults').trigger('processend'); } },20);
    //Have a 3 second timeout to kill the checking for the end of the processing
    setTimeout(function(){ clearInterval(checkProcessOver); },3000)
  });
  
  /* ---------------------------- */
  /* Search Jobs Processing Event */
  /* ---------------------------- */

});
