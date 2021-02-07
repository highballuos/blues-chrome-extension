'use strict';

let showBlues = document.getElementById('show-blues');
let bluesButton = document.getElementById("blues-button");
let isBluesOn = "true";

chrome.storage.sync.get('isBluesOn', function(data) {

  isBluesOn = data.isBluesOn ? data.isBluesOn : "false";
  if(isBluesOn == "true"){
    turnON();
  } else {
    turnOFF();
  }
});

bluesButton.onclick = function(){
  notify2script(toggleStrBool(isBluesOn));
}

function toggleStrBool(strBool){
  return strBool == "true" ? "false" : "true";
}

function turnON(){
  showBlues.innerText = "Blues is Working!";
  bluesButton.innerText = "ON";
  bluesButton.style.backgroundColor = "blue";
  bluesButton.style.color = "white";
  isBluesOn = "true";
}

function turnOFF(){
  showBlues.innerText = "Blues is not Working..";
  bluesButton.innerText = "OFF";
  bluesButton.style.backgroundColor = "#aaaaaa";
  bluesButton.style.color = "red";
  isBluesOn = "false";
}

function notify2script(currentStatus){

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    chrome.tabs.sendMessage(tabs[0].id, {isBluesOn: currentStatus}, function(response) {
    
      if(response && response.accepted){
        chrome.storage.sync.set({isBluesOn : currentStatus}, function() {
          if(currentStatus == "true"){
            turnON();
          } else {
            turnOFF();
          }
        })
      } else {
        alert("message send fail. please check apps status");
      }
    });
  });
  
}