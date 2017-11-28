/* Module - Bright Cove except IE8 and IE9 only - Starts */

Shangrila.bright = {

  instance: {},
  player: {},


  init: function() {
     //console.log('Init');
    this.root = Shangrila;  // root object with namespace Shangrila
    //console.log(instance);
    //console.log(player);
    
    
    //this.bindEvents();
   
  },

  bindEvents: function(){
    console.log('bindEvents');
    player = videojs('#myVideo13');
    instance = this;
    instance.videoTwentyFivePercentageCompleted = false;
    instance.videoFiftyPercentageCompleted = false;
    instance.videoSeventyFivePercentageCompleted = false;
    player.on('loadeddata', instance.videoLoaded);
    //player.on('loadedmetadata', instance.videoMetaDataLoaded);
    player.on('timeupdate', instance.videoProgress);
    player.on('ended', instance.videoCompleted);
    player.muted(false);
    //console.log(instance);
    this.closeBrightCoveVideo();
  },

  videoPlay: function(e) {
    //console.log('Video start');
      //console.log(Math.floor(player.currentTime()));
    },

  videoPause: function(e) {
    //console.log('Video Pause');
    console.log(Math.floor(player.currentTime()));
  },

  videoLoaded: function() {
    //console.log("loaded");
    _satellite.track("VideoView");
    console.log("VideoView");
  },

  videoMetaDataLoaded: function() {
    this.bindEvents();
    //console.log('MetaDataLoaded');
  },

  videoCompleted: function() {
    console.log('Completed');
      _satellite.track("VideoCompletes");
  },

  videoProgress: function() {
    var viewedPercentage = parseFloat((player.currentTime() / player.duration()) * 100).toFixed(2);
    switch (true) {
      case (Math.floor(viewedPercentage) === 25 && !instance.videoTwentyFivePercentageCompleted):
        console.log('25% completed');
        instance.videoTwentyFivePercentageCompleted = true;
        _satellite.track("Video25");
        break;
      case (Math.floor(viewedPercentage) === 50 && !instance.videoFiftyPercentageCompleted):
        console.log('50% completed');
        instance.videoFiftyPercentageCompleted = true;
        _satellite.track("Video50");
        break;
      case (Math.floor(viewedPercentage) === 75 && !instance.videoSeventyFivePercentageCompleted):
        console.log('75% completed');
        instance.videoSeventyFivePercentageCompleted = true;
        _satellite.track("Video75");
        break;
      default:

    }
  },

  closeBrightCoveVideo: function() {
    $('.close-btn').on('click', function() {
      videojs('#myVideo13').dispose();
      $('.brightcove-video').remove();
      //player = undefined;
      //console.log(player);

    });
  }

};

Shangrila.modules.push('bright');
