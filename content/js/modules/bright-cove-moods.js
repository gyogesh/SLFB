/* Module - Special Offers - Starts */
Shangrila.moodsBrightCove = {

  instanceMood: {},

  init: function() {
    this.root = Shangrila;  // root object with namespace Shangrila
    
    this.bindEvents();
  },

  bindEvents: function(){
    instanceMood = this;
    instanceMood.android = ( navigator.userAgent.match(/Android/g) ? true : false );
    instanceMood.iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
  },

  videoLoaded: function(experienceID) {
    //console.log("loaded");

    instanceMood.player = brightcove.api.getExperience(experienceID);
    instanceMood.APIModules = brightcove.api.modules.APIModules;

    instanceMood.modVP = instanceMood.player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    instanceMood.modExp = instanceMood.player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
  },

  videoReady1: function(evt) {
    instanceMood.videoPlayer = instanceMood.player.getModule(instanceMood.APIModules.VIDEO_PLAYER);
    instanceMood.videoPlayer.play();

    if (instanceMood.iOS || instanceMood.android) { 
      instanceMood.videoPlayer.addEventListener(brightcove.api.events.MediaEvent.STOP, instanceMood.onStop);
    }
    else {
      instanceMood.videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, instanceMood.onProgress);
    }
  },

  onProgress : function(evt) {
    if ( (evt.duration - evt.position) < 0.25 ) {
       instanceMood.videoPlayer.seek(0);
     }
  },
  
  onStop : function(evt) {
    instanceMood.videoPlayer.play();
  }

};

Shangrila.modules.push('moodsBrightCove');

/* Module - Special Offers - Ends */