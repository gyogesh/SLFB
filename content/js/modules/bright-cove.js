/* Module - Special Offers - Starts */
Shangrila.brightIe = {

  instanceIE: {},

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    
    this.bindEvents();
  },

  bindEvents: function(){
    instanceIE = this;
    instanceIE.videoTwentyFivePercentageCompleted = false;
    instanceIE.videoFiftyPercentageCompleted = false;
    instanceIE.videoSeventyFivePercentageCompleted = false;
    //console.log(brightcove);
    brightcove.createExperiences();

    /*this.videoLoaded();
    this.videoReady();*/
  },

  videoLoaded: function(experienceID) {
    //console.log("loaded");
    instanceIE.player = brightcove.api.getExperience(experienceID);
    instanceIE.modVP = instanceIE.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    instanceIE.modExp = instanceIE.player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
    instanceIE.modCon = instanceIE.player.getModule(brightcove.api.modules.APIModules.CONTENT);
  },

  videoReady: function(evt) {
    //console.log("ready");
    instanceIE.modVP.getCurrentVideo(function(dto) {
        //console.log(dto);
    });
    instanceIE.modVP.addEventListener(brightcove.api.events.MediaEvent.BEGIN, instanceIE.videoEventFired);
    instanceIE.modVP.addEventListener(brightcove.api.events.MediaEvent.CHANGE, instanceIE.videoEventFired);
    instanceIE.modVP.addEventListener(brightcove.api.events.MediaEvent.COMPLETE, instanceIE.videoEventFired);
    instanceIE.modVP.addEventListener(brightcove.api.events.MediaEvent.ERROR, instanceIE.videoEventFired);
    instanceIE.modVP.addEventListener(brightcove.api.events.MediaEvent.PLAY, instanceIE.videoEventFired);
    instanceIE.modVP.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, instanceIE.videoEventFired);
    instanceIE.modVP.addEventListener(brightcove.api.events.MediaEvent.STOP, instanceIE.videoEventFired);
    //console.log(instanceIE);
  },

  videoEventFired: function(evt) {
    if (evt.type === "mediaProgress") {
        instanceIE.videoProgress(evt.position, evt.duration);
        _satellite.track("Video Views");
    } else {
        console.log(evt.type);
        if(evt.type == 'mediaPlay' || evt.type == 'mediaBegin') {
          _satellite.track("VideoView");
          console.log("VideoView");
        } else if (evt.type == 'mediaComplete') {
          _satellite.track("VideoCompletes");
          console.log('VideoCompletes');
        } if (evt.position) {
          _satellite.track("+ evt.position +");
          console.log(evt.position);
        }        
    }
  },

  videoProgress: function(position, duration) {
    var viewedPercentage = parseFloat((position / duration) * 100).toFixed(2);
    switch (true) {
      case (Math.floor(viewedPercentage) === 25 && !instanceIE.videoTwentyFivePercentageCompleted):
          console.log('25% completed');
          instanceIE.videoTwentyFivePercentageCompleted = true;
          _satellite.track("Video25");
          break;
      case (Math.floor(viewedPercentage) === 50 && !instanceIE.videoFiftyPercentageCompleted):
          sconsole.log('50% completed');
          instanceIE.videoFiftyPercentageCompleted = true;
          _satellite.track("Video50");
          break;
      case (Math.floor(viewedPercentage) === 75 && !instanceIE.videoSeventyFivePercentageCompleted):
          console.log('75% completed');
          instanceIE.videoSeventyFivePercentageCompleted = true;
          _satellite.track("Video75");
          break;
      default:

    }
  }

};

Shangrila.modules.push('brightIe');

/* Module - Special Offers - Ends */