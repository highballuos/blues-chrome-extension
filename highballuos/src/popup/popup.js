'use strict';

let _showBlues = document.getElementById("show-blues");
let _bluesButton = document.getElementById("blues-button");
let _isBluesOn = "true";
// const eco_bulb_url = chrome.runtime.getURL("images/eco_bulb.json");

let animation = lottie.loadAnimation({
  container: _bluesButton,
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: chrome.runtime.getURL("images/eco_bulb.json")
});

init();
_bluesButton.onclick = onClickBlues;

function init(){
  chrome.storage.sync.get('isBluesOn', function(data) {
    _isBluesOn = !data.isBluesOn ? "true" : data.isBluesOn;
    
    if(_isBluesOn == "true"){
      turnON();
    } else {
      turnOFF();
    }
  });
}

function onClickBlues() {
  // change status
  notify2script(_isBluesOn == "true" ? "false" : "true");
}

function turnON(){
  _showBlues.innerText = "Styling On";
  animation.setDirection(1);
  animation.play();
  _bluesButton.style.filter = "none";
  _isBluesOn = "true";
}

function turnOFF(){
  _showBlues.innerText = "Styling Off";
  animation.setDirection(-1);
  animation.play();
  _bluesButton.style.filter = "grayscale(80%)";
  _isBluesOn = "false";
}

function notify2script(changedStatus){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.storage.sync.set({isBluesOn : changedStatus}, function() {
      if(changedStatus == "true"){
        turnON();
      } else {
        turnOFF();
      }
      sendChangedStatus(tabs, changedStatus);
    })
    
  });
  
}

function sendChangedStatus(tabs, changedStatus){
  chrome.tabs.sendMessage(tabs[0].id, {isBluesOn: changedStatus}, function(response) {
    console.log(response);
  });
}