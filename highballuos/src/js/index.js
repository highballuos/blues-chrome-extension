const bluesPresenter = new BluesPresenter();

chrome.storage.sync.get('isBluesOn', function(data) {
    if(data.isBluesOn && data.isBluesOn == "true"){
        console.log(data.isBluesOn);
        if(!bluesPresenter.getIsTurnON()){
            bluesPresenter.setIsTurnON(true);
            bluesPresenter.on();
        }
    } else {
        if(bluesPresenter.getIsTurnON()){
            bluesPresenter.setIsTurnON(false);
            bluesPresenter.off();
        }   
    }
});

window.addEventListener("load", function(){
    console.log("on");
    if(bluesPresenter.getIsTurnON()){
        bluesPresenter.on();
    }
});
window.addEventListener("unload", function(){
    console.log("off");
    if(bluesPresenter.getIsTurnON()){
        bluesPresenter.off();
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(sender.tab && request.isBluesOn){
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if(request.isBluesOn == "true"){
                if(!bluesPresenter.getIsTurnON()){
                    bluesPresenter.on();
                    bluesPresenter.setIsTurnON(true);
                }
            } else {
                if(bluesPresenter.getIsTurnON()){
                    bluesPresenter.off();
                    bluesPresenter.setIsTurnON(false);
                }
            }
            sendResponse({accepted: true});
        }
    }
);