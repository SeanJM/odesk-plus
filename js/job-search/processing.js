/*  -------------------------------------------------
    
Search Jobs Processing Event

Usage:

  Start:  $('#searchResults').bind('process');
  End:    $('#searchResults').bind('processend');

----------------------------------------------------- */
  
function checkProcess() {
  var checkProcess = setInterval(function(){ 
    if ($('#searchResults').hasClass('process')) { 
      clearInterval(checkProcess); 
      $('#searchResults').trigger('process');
    } 
  },30);
}
// Execute the check to see if processing is over
$('#searchResults').bind('process',function(){ 
  var checkProcessOver = setInterval(function(){ 
    if (!$('#searchResults').hasClass('process')) { 
      clearInterval(checkProcessOver); 
      $('#searchResults').trigger('processend'); 
    } 
  },30);
  //Have a 3 second timeout to kill the checking for the end of the processing
  setTimeout(function(){ clearInterval(checkProcessOver); },3000)
});
$('#searchResults').bind('processend',function(){ checkProcess(); $(this).attr('format','true'); });

checkProcess();

/* ---------------------------- */
/* Search Jobs Processing Event */
/* ---------------------------- */