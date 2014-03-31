var CustomAudio = function(id, options) {

    this.audioElement = document.getElementById(id);
    this.audioElement.style.display = 'none';
    this.audioElement.removeAttribute('controls');

    this.createUI();
    this.bindEvents();
};

CustomAudio.prototype.createUI = function() {
    var container =  document.createElement('div');
    container.className = 'custom-audio';

    var volumeStatus = document.createElement('div');
    volumeStatus.className = 'volumne-status';

    var volumeMeter = document.createElement('div');
    volumeMeter.className = 'volumne-meter';
    volumeMeter.appendChild(volumeStatus);

    var audioProgress = document.createElement('div');
    audioProgress.className = 'audio-progress';

    var audioSlider = document.createElement('div');
    audioSlider.className = 'audio-slider';
    audioSlider.appendChild(audioProgress);

    var audioTime = document.createElement('div');
    audioTime.className = 'audio-time';

    var playPauseButton = document.createElement('div');
    playPauseButton.className = 'play-pause';
    playPauseButton.innerHTML = 'play';

    container.appendChild(playPauseButton);
    container.appendChild(audioSlider);
    container.appendChild(audioTime);

    this.audioElement.parentNode.insertBefore(container, this.audioElement.nextSibling);

    this.ui = {};
    this.ui.volumeMeter = volumeMeter;
    this.ui.volumeStatus = volumeStatus;
    this.ui.audioTime = audioTime;
    this.ui.audioSlider = audioSlider;
    this.ui.audioProgress = audioProgress;
    this.ui.playPauseButton = playPauseButton;
};

CustomAudio.prototype.bindEvents = function() {
    this.audioElement.addEventListener('timeupdate', this.updateTime.bind(this));
    this.ui.playPauseButton.addEventListener('click', this.playPause.bind(this));
    this.ui.audioSlider.addEventListener('click', this.setAudioPosition.bind(this));
};

CustomAudio.prototype.play = function() {
    //Plays the song defined in the audio tag.
    this.audioElement.play();

    //Calculates the starting percentage of the song.
    // var percentageOfVolume = this.audioElement.volume / 1;
    // var percentageOfVolumeMeter = this.ui.volumeMeter.offsetWidth * percentageOfVolume;

    // //Fills out the volume status bar.
    // this.ui.volumeMeter.style.width = Math.round(percentageOfVolumeSlider) + "px";

    this.ui.playPauseButton.classList.add('pause');
    this.ui.playPauseButton.classList.remove('play');
    this.ui.playPauseButton.innerHTML = 'pause';
};

CustomAudio.prototype.pause = function() {
    this.audioElement.pause();
};

//Does a switch of the play/pause with one button.
CustomAudio.prototype.playPause = function() {
    //Checks to see if the song is paused, if it is, play it from where it left off otherwise pause it.
    if (this.audioElement.paused){
        this.audioElement.play();
        this.ui.playPauseButton.classList.add('pause');
        this.ui.playPauseButton.classList.remove('play');
        this.ui.playPauseButton.innerHTML = 'pause';
    } else {
        this.audioElement.pause();
        this.ui.playPauseButton.classList.remove('pause');
        this.ui.playPauseButton.classList.add('play');
        this.ui.playPauseButton.innerHTML = 'play';
    }
};

//Updates the current time function so it reflects where the user is in the song.
//This function is called whenever the time is updated.  This keeps the visual in sync with the actual time.
CustomAudio.prototype.updateTime = function() {
    var currentSeconds = (Math.floor(this.audioElement.currentTime % 60) < 10 ? '0' : '') + Math.floor(this.audioElement.currentTime % 60);
    var currentMinutes = Math.floor(this.audioElement.currentTime / 60);
    //Sets the current song location compared to the song duration.
    this.ui.audioTime.innerHTML = currentMinutes + ":" + currentSeconds + ' / ' + Math.floor(this.audioElement.duration / 60) + ":" + (Math.floor(this.audioElement.duration % 60) < 10 ? '0' : '') + Math.floor(this.audioElement.duration % 60);

    //Fills out the slider with the appropriate position.
    var percentageOfAudio = (this.audioElement.currentTime/this.audioElement.duration);
    var percentageOfSlider = this.ui.audioSlider.offsetWidth * percentageOfAudio;

    //Updates the track progress div.
    this.ui.audioProgress.style.width = Math.round(percentageOfSlider) + "px";
};

CustomAudio.prototype.volumeUpdate = function(number) {
    //Updates the volume of the track to a certain number.
    this.audioElement.volume = number / 100;
};

//Changes the volume up or down a specific number
CustomAudio.prototype.changeVolume = function(number, direction){
    //Checks to see if the volume is at zero, if so it doesn't go any further.
    if(this.audioElement.volume >= 0 && direction == "down"){
        this.audioElement.volume = this.audioElement.volume - (number / 100);
    }
    //Checks to see if the volume is at one, if so it doesn't go any higher.
    if(this.audioElement.volume <= 1 && direction == "up"){
        this.audioElement.volume = this.audioElement.volume + (number / 100);
    }

    //Finds the percentage of the volume and sets the volume meter accordingly.
    var percentageOfVolume = this.audioElement.volume / 1;
    var percentageOfVolumeSlider = this.ui.volumeMeter.offsetWidth * percentageOfVolume;

    this.ui.volumeStatus.style.width = Math.round(percentageOfVolumeSlider) + "px";
};

//Sets the location of the song based off of the percentage of the slider clicked.
CustomAudio.prototype.setLocation = function(percentage) {
    this.audioElement.currentTime = this.audioElement.duration * percentage;
};

/*
Gets the percentage of the click on the slider to set the song position accordingly.
Source for Object event and offset: http://website-engineering.blogspot.com/2011/04/get-x-y-coordinates-relative-to-div-on.html
*/
CustomAudio.prototype.setAudioPosition = function(e) {
    console.log(e, 'e');
    console.log(obj, 'obj');
    //Gets the offset from the left so it gets the exact location.
    var audioSliderWidth = obj.offsetWidth;
    var evtobj = window.event ? event : e;
    clickLocation =  evtobj.layerX - obj.offsetLeft;
console.log(evtobj);
    var percentage = (clickLocation/audioSliderWidth);
    //Sets the song location with the percentage.
    this.setLocation(percentage);
};

//Set's volume as a percentage of total volume based off of user click.
CustomAudio.prototype.setVolume = function(percentage){
    this.audioElement.volume =  percentage;

    var percentageOfVolume = this.audioElement.volume / 1;
    var percentageOfVolumeSlider = this.ui.volumeMeter.offsetWidth * percentageOfVolume;

    this.ui.volumeStatus.style.width = Math.round(percentageOfVolumeSlider) + "px";
};

//Set's new volume id based off of the click on the volume bar.
CustomAudio.prototype.setNewVolume = function(obj, e){
    var volumeSliderWidth = obj.offsetWidth;
    var evtobj = window.event ? event: e;
    clickLocation = evtobj.layerX - obj.offsetLeft;

    var percentage = (clickLocation/volumeSliderWidth);
    this.setVolume(percentage);
};

//Stop song by setting the current time to 0 and pausing the song.
CustomAudio.prototype.stopAudio = function(){
    this.audioElement.currentTime = 0;
    this.audioElement.pause();
};