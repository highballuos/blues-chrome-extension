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

// without px notation.. ignored
const copyLayout = (targetElement, newElement) => { 
    newElement.style.width = targetElement.offsetWidth + "px";
    newElement.style.height = targetElement.offsetHeight + "px";
    
    newElement.style.left = targetElement.offsetLeft + "px";;
    newElement.style.top = targetElement.offsetTop + "px";
    console.log(targetElement.offsetTop);
    console.log(newElement.style.top);
}

const onFocusIn = (event) => {
    event.stopPropagation();

    if(isTextElement(event.path[0]) && currentFocusedElement != event.path[0]){
        if(currentFocusedElement) {
            removePrev(currentFocusedElement);
        }

        currentFocusedElement = event.path[0];

        highballuosContainer = document.createElement("div");
        highballuosContainer.className = "highballuos-container";
        copyLayout(event.path[0], highballuosContainer);
        
        highballuosBtn = document.createElement("div");
        highballuosBtn.className = "highballuos-btn";
        highballuosBtn.style.backgroundImage = `url(${loadingImage})`;

        highballuosContainer.appendChild(highballuosBtn);

        currentFocusedElement.parentElement.appendChild(highballuosContainer);
    }
};

const removePrev = (target) => {
    target.parentElement.removeChild(highballuosContainer);
};

window.onload = () => {
    document.body.addEventListener("focusin", onFocusIn, {
        capture : false,
        once : false,
        passive : true
    });
};

window.onunload = () => {
    document.body.removeEventListener("focusin", onFocusIn);
}

