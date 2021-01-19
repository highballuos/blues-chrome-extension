/*
Focus 이벤트를 처리하는 Injection Script

event captureOptions는 다음의 블로그를 보고 결정 (https://amati.io/eventlisteneroptions-passive-true/)
bubbling 하되, 상위 객체로 이벤트가 전달되지 않도록 함 + 스크롤에 문제 없도록 사용.

Page가 load 될 때 이벤트를 등록하고 unload 될 때 이벤트를 제거.
*/

'use strict';

const INPUT_TAG = "INPUT";
const TEXTAREA_TAG = "TEXTAREA";
const DIV_TAG = "DIV";

let loadingImage = "https://visualpharm.com/assets/512/Evil-595b40b65ba036ed117d403d.svg";

let currentFocusedElement;
let highballuosContainer;
let highballuosBtn;

let highballuosTxt;
const eventTypes = ["input"];


// window load unload event listeners -> use to catch focusing event
window.onload = () => {
    document.body.addEventListener("focusin", onFocusIn, {
        capture : false,
        once : false,
        passive : true
    });
};

window.onunload = () => {
    if(currentFocusedElement){
        eventListenerHelper(currentFocusedElement, eventTypes, onValueChange, false);
    }
    document.body.removeEventListener("focusin", onFocusIn);
}

// focusin event function
const onFocusIn = (event) => {
    event.stopPropagation();

    if(isTextElement(event.path[0]) && currentFocusedElement != event.path[0]){
        if(currentFocusedElement) {
            removePrev(currentFocusedElement);
        }

        currentFocusedElement = event.path[0];
        addNew(currentFocusedElement);
    }
};

// add events and elements to new target
const addNew = (target) => {
    eventListenerHelper(target, eventTypes, onValueChange, true);

    highballuosContainer = document.createElement("div");
    highballuosContainer.className = "highballuos-container";
    copyLayout(target, highballuosContainer);
    
    highballuosBtn = document.createElement("div");
    highballuosBtn.className = "highballuos-btn";
    highballuosBtn.style.backgroundImage = `url(${loadingImage})`;

    highballuosContainer.appendChild(highballuosBtn);

    target.parentElement.appendChild(highballuosContainer);
}

// remove events and elements when target changed
const removePrev = (target) => {
    eventListenerHelper(target, eventTypes, onValueChange, false);
    target.parentElement.removeChild(highballuosContainer);
};

// our target is only type of [div, input, textarea]
const isTextElement = (element) => {
    switch(element.tagName) {
        case INPUT_TAG :

        case TEXTAREA_TAG :
            return true;

        case DIV_TAG :
            return element.contentEditable == "true";
            
        default :
            return false;
    }
}

// copy target's layout and paste to our container
// without px notation.. ignored
const copyLayout = (targetElement, newElement) => { 
    newElement.style.width = targetElement.offsetWidth + "px";
    newElement.style.height = targetElement.offsetHeight + "px";
    
    newElement.style.left = targetElement.offsetLeft + "px";
    newElement.style.top = targetElement.offsetTop + "px";
}

// event listener helper
// add multiple listener to one target
// judge add or remove by isAdd
const eventListenerHelper = (target, events, handler, isAdd = true) => {
    if(!(events instanceof Array)){
        throw "Error in addEventListenerHelper : events is not array";
    }

    if(isAdd){
        for(let i=0; i<events.length; i++){
            target.addEventListener(events[i], handler, {
                capture : false,
                once : false,
                passive : true
            });
        }
    } else {
        for(let i=0; i<events.length; i++){
            target.removeEventListener(events[i], handler);
        }
    }
    
}

// input, change, keyup, paste events function
// get target's text and assign to highballuosTxt
const onValueChange = (event) => {
    if(event.target.tagName == DIV_TAG){
        highballuosTxt = event.target.innerText;
    } else {
        highballuosTxt = event.target.value;
    }
    console.log(highballuosTxt);
}











