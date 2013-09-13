var isPage = {
  findWorkHome: function () {
    if ($('a[href="/find-work-home/"]').size() > 0) {
      return true;
    }
    return false;
  },
  jobApply: function () {
    if (document.URL.match(/job\/[0-9]+\/apply\//)) {
      return true;
    }
    return false;
  }
}