const bluesPresenter = new BluesPresenter();
bluesPresenter.on();

getIsBluesOn();

window.addEventListener("load", function(){
    window.addEventListener("focus", getIsBluesOn);
});


window.addEventListener("unload", function(){
    if(bluesPresenter.getIsTurnON()){
        bluesPresenter.off();
    }
    window.removeEventListener("focus", getIsBluesOn);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.isBluesOn){
            if(request.isBluesOn == "true"){
                if(!bluesPresenter.getIsTurnON()){
                    bluesPresenter.on();
                }
            } else {
                if(bluesPresenter.getIsTurnON()){
                    bluesPresenter.off();
                }
            }
            sendResponse({accepted: true});
        }
    }
);


function getIsBluesOn(){
    if(typeof chrome.app.isInstalled!=='undefined'){
        chrome.storage.sync.get('isBluesOn', function(data) {
            if(!data.isBluesOn || data.isBluesOn == "true"){
                if(!bluesPresenter.getIsTurnON()){
                    bluesPresenter.on();
                }
            } else {
                if(bluesPresenter.getIsTurnON()){
                    bluesPresenter.off();
                }   
            }
        });
    } 
}
