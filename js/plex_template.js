// Plex Labs Templating
pl_template = {};

pl_template.load = function (data,callback) {
  var templateAddress = '#templates ' + data['id'];
  $(templateAddress).clone().appendTo(data.parent);
  if (typeof callback == 'function') { callback(); }
}

//template.process({'element':$(this),'keys':[{'title':'Some title','subhead':'some more subhead'}]})

pl_template.process = function (object,callback) {
  var str = object['id'].html(),
      arr = object['keys'];
  for (var i=0;i<arr.length;i++) {
    str.replace(/{{\s*(.*?)}}/g,function(m,key){
      if (/^if /.test(key)) { 
        var test = key.replace(/^if /,'');
        if (!arr[i].hasOwnProperty(test) || !arr[i][test]) { 
          str = str.split('{{' + key + '}}')[0] + str.split('{{' + key + '}}')[1].split('{{endif}}')[1];
        }
      }
    });
    object['id'].html(str.replace(/{{\s*(.*?)}}/g,function(m,key){
      if (arr[i].hasOwnProperty(key)) { return arr[i][key]; }
      return '';
    }));
  }
  if (typeof callback == 'function') { callback(); }
}