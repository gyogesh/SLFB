$(document).ready(function(){

  // queryStrip
  function queryStrip(string) {
    string = string.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + string + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ''));
  }

  // Show bootstrap modal on load
  // If the modal id="terms", you can show it on page load by appending `?modal=terms` to the URL
  var modalString = queryStrip('modal'),
      modalToShow = '#' + modalString;
  if (modalString !== '') {
    $(modalToShow).modal('show');
  }

  // Show bootstrap tooltip on load
  // If the tooltip id="artistName", you can show it on page load by appending `?tooltip=artistName to the URL
  var tooltipString = queryStrip('tooltip'),
      tooltipToShow = '#' + tooltipString;
  if (tooltipString !== '') {
    $(tooltipToShow).tooltip('show');
  }

  // Show bootstrap popover on load
  // If the popover id="moreInfo", you can show it on page load by appending `?popover=moreInfo` to the URL
  var popoverString = queryStrip('popover'),
      popoverToShow = '#' + popoverString;
  if (popoverString !== '') {
    $(popoverToShow).popover('show');
  }

  // Show bootstrap tab on load
  // If the tab id="friendRequests", you can show it on page load by appending `?tab=friendRequests` to the URL
  var tabString = queryStrip('tab');
  if (tabString !== '') {
    $('.nav-tabs a[href=#' + tabString + ']').tab('show');
  }
});
