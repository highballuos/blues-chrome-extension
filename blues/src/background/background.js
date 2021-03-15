chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.bluesTextVal){
            // mock randomly detection 
            detectHateSpeech(request.bluesTextVal)
                .then(isHate => sendResponse({isHate}))
        }
    }
);

async function detectHateSpeech(text) {
    let isHate = await (Math.random() >= 0.5);
    return isHate;
}