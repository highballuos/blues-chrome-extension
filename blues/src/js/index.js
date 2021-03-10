const bluesPresenter = new BluesPresenter();
bluesPresenter.on();

getIsBluesOn();

window.addEventListener("load", function(){
    window.addEventListener("focus", getIsBluesOn);
});

window.addEventListener("unload", function(){
    bluesPresenter.off();
    window.removeEventListener("focus", getIsBluesOn);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.isBluesOn){
            if(request.isBluesOn == "true"){
                    bluesPresenter.on();
            } else {
                    bluesPresenter.off();
            }
            sendResponse({accepted: true});
        }
    }
);


function getIsBluesOn(){
    chrome.storage.sync.get('isBluesOn', function(data) {
        if(!data.isBluesOn || data.isBluesOn == "true"){
            bluesPresenter.on();
        } else {
            bluesPresenter.off();
        }
    });
}
