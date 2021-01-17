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

let currentFocusedElement;
let highballuosBtn;

const isInput = (element) => {
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

const onFocusIn = (event) => {
    event.stopPropagation();

    if(isInput(event.path[0])){
        currentFocusedElement = event.path[0];
        console.log(currentFocusedElement);
        highballuosBtn = document.createElement("div");
        highballuosBtn.className = "rel-right-bottom";
        currentFocusedElement.parentElement.appendChild(highballuosBtn);
    }
};

const onFocusOut = (event) => {
    event.stopPropagation();
    if(isInput(event.path[0])){
        currentFocusedElement = event.path[0];
        console.log(currentFocusedElement);
        currentFocusedElement.parentElement.removeChild(highballuosBtn);
    }
};

window.onload = () => {
    document.body.addEventListener("focusin", onFocusIn, {
        capture : false,
        once : false,
        passive : true
    });
    
    document.body.addEventListener("focusout", onFocusOut, {
        capture : false,
        once : false,
        passive : true
    });
};

window.onunload = () => {
    document.body.removeEventListener("focusin", onFocusIn);
    
    document.body.addEventListener("focusout", onFocusOut);
}

