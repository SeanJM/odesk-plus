$(function(){
  function buildNav(){
    var nav = $('<nav id="nav"></nav>');
    var statusline = $('<div class="statusline"><div class="frame"><div id="logoNotice"><div class="noticeGroup"></div></div><div class="accountGroup"></div></div></div>');
    /* Account Group */
    var accountGroup = $('<div class="accountGroup"></div>');
    var picContainer = $('<div class="picContainer"></div>');
    var userNameContainer = $('<div class="userNameContainer"></div>');
    var userSettingsContainer = $('<div class="userSettingsContainer"></div>');
    /* Construct Account Group */
    accountGroup.append(picContainer);
    accountGroup.append(userNameContainer);
    accountGroup.append(userSettingsContainer);
    /* Append Account Group to Status Line */
    statusline.find('.accountGroup').append(accountGroup);
    /* > Account Group */
    var tabs = $('<div class="tabs"><div class="frame"></div></div>');
    var menu = $('<div class="menu"><div class="frame"></div></div>');
    nav.append(statusline);
    nav.append(tabs);
    nav.append(menu);
    return nav;
  }
  function NewformatTopNav(){
    var nav = buildNav();
    /* Fetch elements */
    var logo = $('a.oLogo:first');
    var noticeGroup = nav.find('.noticeGroup');
    /*userGlobal.find('> .notifications').appendTo(noticeGroup).find('a.notifications').addClass('sprite');
    userGlobal.find('> .inbox').appendTo(noticeGroup).find('a.link-icon').addClass('sprite');
    userGlobal.find('> .inbox-count').appendTo(noticeGroup);
    userGlobal.find('> .help').appendTo(noticeGroup).find('a.link-icon').addClass('sprite');*/
  }
  function OldformatTopNav(nav){
  	/* Add ID for simplifying CSS and Javascript scope */
    $('.navigation.v2').attr('id','nav');
  	/*$('nav.oPageCentered').attr('id','nav');*/
  	/* Remove div container with no classes or attributes */
  	$('.navigation.v2 .main > div > div').unwrap();
  	/* Add a general container in the top */
  	$('.navigation.v2 .main .top.clearfix').children().wrapAll('<div class="frame"></div>');
  	var logoNotice = $('<div id="logoNotice"></div>');
  	var topFrame = $('.navigation.v2 .main .top .frame');
    topFrame.prepend(logoNotice);
    var noticeGroup = $('<div class="noticeGroup"></div>');
  	var accountGroup = $('<div class="accountGroup"></div>');
    var userNameContainer = $('<div class="userNameContainer"></div>');
    var userSettingsContainer = $('<div class="userSettingsContainer"></div>');
    var profilePicture = $('<div class="picContainer"></div>');
    noticeGroup.appendTo(logoNotice);
    userNameContainer.appendTo(accountGroup);
  	accountGroup.appendTo(topFrame);
    accountGroup.prepend(profilePicture);
    accountGroup.append(userSettingsContainer);
    /* Append to Top Nav */
  	var userGlobal = $('.navigation.v2 .main .top-nav .user_global');
    userGlobal.find('> .notifications').appendTo(noticeGroup).find('a.notifications').addClass('sprite');
  	userGlobal.find('> .inbox').appendTo(noticeGroup).find('a.link-icon').addClass('sprite');
  	userGlobal.find('> .inbox-count').appendTo(noticeGroup);
  	userGlobal.find('> .help').appendTo(noticeGroup).find('a.link-icon').addClass('sprite');
    userGlobal.find('.dropdown.username').appendTo(userNameContainer);
    userGlobal.find('.dropdown.settings').appendTo(userSettingsContainer);
    userSettingsContainer.find('a.link-icon').addClass('sprite');

    var username = accountGroup.find('.dropdown.username');
    var usernameLabel = username.find('.label').text();
    username.find('.label').attr('username',usernameLabel);

    /* Get the fullname from the profile */
    var fullName = username.find('.label');
    var fullNameUrl = '/find-work-home #contractorsBox b';
    fullName.load(fullNameUrl);

    /* Get the profile picture */
    var pictureURL = '/find-work-home #contractorsBox img';
    profilePicture.load(pictureURL);

  	$('.navigation.v2 .main .top .frame .oLogo').addClass('sprite').appendTo(logoNotice).fadeIn();
  	$('#simple-company-selector').hide();
    var bottomNav = $('#nav').find('.top-nav');
    bottomNav.children().wrapAll('<div class="frame"></div>');
    var nav = $('#nav .level_2');
    nav.children().wrapAll('<div class="frame"></div>');
    nav.find('.bg').remove();
    nav.find('.current > div').remove();
    nav.find('.content ul').unwrap();
    /* Get Number of Job Applications */
  }
  /* If is new nav do this */
  /* If is old nav do that */
  if ($('nav').size() <= 0) {
    OldformatTopNav();
  }
  if ($('nav').size() > 0) {
    NewformatTopNav();
  }
});