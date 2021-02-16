'use strict';

let _showBlues = document.getElementById('show-blues');
let _bluesButton = document.getElementById("blues-button");
let _isBluesOn = "true";

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
  _showBlues.innerText = "Blues is Working!";
  _bluesButton.innerText = "ON";
  _bluesButton.style.backgroundColor = "blue";
  _bluesButton.style.color = "white";
  _isBluesOn = "true";
}

function turnOFF(){
  _showBlues.innerText = "Blues is not Working..";
  _bluesButton.innerText = "OFF";
  _bluesButton.style.backgroundColor = "#aaaaaa";
  _bluesButton.style.color = "red";
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