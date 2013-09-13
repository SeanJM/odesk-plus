/* --------------------------------------- */
/* // Database */
/* --------------------------------------- */

var db = {};
var dbName = 'odesk';

db.init = function() {
  var val;
  db[dbName] = {};
  db[dbName].value = {};
  /* ------------- job search */
  db[dbName].value.jobsearch = {};
  db[dbName].value.jobsearch.sidemenu = {};
  db[dbName].value.jobApply = ['Hi'];

  console.log('Does databas exist?');
  if (localStorage.getItem(dbName) != 'undefined') {
    console.log('- Yes: loading database');
    val = JSON.parse(localStorage.getItem(dbName));

    if (val) { db[dbName].value = val; }
  }
  else {
    console.log('- No: Initializing first start');
    oplus.init();
  }
}

db.save = function() {
  console.log('- Saving database');
  localStorage.setItem(dbName,JSON.stringify(db[dbName].value));
  console.log(localStorage.getItem(dbName));
}

db.set = function (key,value) {
  db[dbName].value[key] = value;
  db.save();
}

db.get = function (value) {
  return db[dbName].value[value];
}