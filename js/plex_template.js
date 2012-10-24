// Plex Labs Templating
var template = {};
template.load = function (data,callback) {
  var cache           = $('<div />'),
      templateAddress = './templates/' + data['template'] + ' ' + data['id'],
      newCache;
  cache.load(templateAddress,function() {
    newCache = cache.replaceWith(cache.contents());
    newCache.appendTo(data['parent']);
    if (callback) { callback(newCache); }
  });
}

//template.process({'element':$(this),'keys':[{'title':'Some title','subhead':'some more subhead'}]})

template.process = function (object,callback) {
  var str = object['element'].html(),
      arr = object['keys'];
  for (var i=0;i<arr.length;i++) {
    div.html(str.replace(/{{(\w*)}}/g,function(m,key){
      if (arr[i].hasOwnProperty(key)) { return arr[i][key]; }
    }));
  }
  if (callback) { callback(); }
}

function template(element,arr,callback) {
    var t = arr.length;
    for (i = 0;i < arr.length;i++) {
      var div = element.clone(true); /* Clone the template and show it */
      /* Adapted from http://stackoverflow.com/questions/377961/efficient-javascript-string-replacement */
      str = div.html();
      div.html(str.replace(/{{(\w*)}}/g,function(m,key){
        if (arr[i].hasOwnProperty(key)) { return arr[i][key]; }
      }));
      element.before(div);
    }
    element.remove(); /* Remove the template element */
    if (typeof callback == 'function') { 
      callback(); 
    }
  }