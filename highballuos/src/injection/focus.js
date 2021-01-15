/*
event captureOptions는 다음의 블로그를 보고 결정 (https://amati.io/eventlisteneroptions-passive-true/)
bubbling 하되, 상위 객체로 이벤트가 전달되지 않도록 함 + 스크롤에 문제 없도록 사용
*/

'use strict';

let currentFocusedElement;

function onFocusIn(event){
    event.stopPropagation();
    console.log(event);

};

function onFocusOut(event){
    event.stopPropagation();
    console.log(event);
};

document.addEventListener("focusin", onFocusIn, {
    capture : false,
    once : false,
    passive : true
});

document.addEventListener("focusout", onFocusOut, {
    capture : false,
    once : false,
    passive : true
})