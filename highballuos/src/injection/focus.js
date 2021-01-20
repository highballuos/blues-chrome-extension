/*
Focus 이벤트를 처리하는 Injection Script

event captureOptions는 다음의 블로그를 보고 결정 (https://amati.io/eventlisteneroptions-passive-true/)
bubbling 하되, 상위 객체로 이벤트가 전달되지 않도록 함 + 스크롤에 문제 없도록 사용.

Page가 load 될 때 이벤트를 등록하고 unload 될 때 이벤트를 제거.
*/

'use strict';

const TEXTAREA_TAG = "TEXTAREA";
const DIV_TAG = "DIV";
const HATE_SPEECH_DETECT_API = "https://main-multilingual-bert-korean-hate-speech-jeongukjae.endpoint.ainize.ai/v1/models/model:predict";

let currentFocusedElement;
let highballuosContainer;
let highballuosBtn;
let highballuosTimer;
let highballuosText

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
        eventListenerHelper(currentFocusedElement, eventTypes, onTextChange, false);
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
        appendNew(currentFocusedElement);
    }
};

// add events and elements to new target
const appendNew = (target) => {
    eventListenerHelper(target, eventTypes, onTextChange, true);

    highballuosContainer = document.createElement("div");
    highballuosContainer.className = "highballuos-container";
    copyLayout(target, highballuosContainer);
    
    highballuosBtn = document.createElement("div");
    highballuosBtn.className = "highballuos-btn";
    highballuosBtn.onclick = onClickHighballousBtn;

    highballuosContainer.appendChild(highballuosBtn);

    target.parentElement.appendChild(highballuosContainer);
}

// remove events and elements when target changed
const removePrev = (target) => {
    eventListenerHelper(target, eventTypes, onTextChange, false);
    target.parentElement.removeChild(highballuosContainer);
};

// our target is only type of [div, input, textarea]
const isTextElement = (element) => {
    switch(element.tagName) {
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

// input events function - other options[paste, change, keyup]
// request with debounce
const onTextChange = (event) => {
    if(highballuosTimer){
        clearTimeout(highballuosTimer);
    }
    highballuosTimer = setTimeout(detectHateSpeech, 700, event.target);
}

// request to hate speech detection api
const detectHateSpeech = (target) => {
    let txt = "";
    if(target.tagName == DIV_TAG){
        txt = target.innerText;
    } else {
        txt = target.value;
    }

    let postBody = {
        instances: [
            {
                "context": "",
                "comment": txt
            }
        ]
    }

    fetch(HATE_SPEECH_DETECT_API, {
        method : "POST",
        body : JSON.stringify(postBody),
        headers : {"content-type" : "application/json"}
    })
    .then(res => res.json())
    .then(resJson => console.log(resJson.predictions))
    .catch(err => console.log(err));
}


/*
TODO: 매번 나눌 것인가? 아니면 한번에 나눠서 다른 함수를 호출할 것인가 정하자
*/


// onclick func of highballuosBtn
// return transfered text to currentFocusedElement's value
const onClickHighballousBtn = () => {
    let reversedTxt = "";
    if(currentFocusedElement.tagName == DIV_TAG){
        reversedTxt = transferText(currentFocusedElement.innerText);
        currentFocusedElement.innerText = reversedTxt;
    } else {
        reversedTxt = transferText(currentFocusedElement.value);
        currentFocusedElement.value = reversedTxt;
    }
}

const changeTextareaText = (target, txt) => {
    target.value = txt;
}

const changeDivText = (target, txt) => {
    target.innerText = txt;
}

const transferText = (txt) => {
    return txt.split("").reverse().join("");
}
