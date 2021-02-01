const eventOptions = {
    capture : false,
    once : false,
    passive : true
};

// event listener helper
// add multiple listener to one target
// judge add or remove by isAdd
const eventListenerHelper = (target, events, handler, isAdd = true) => {
    if(events instanceof Array){
        if(isAdd){
            for(let i=0; i<events.length; i++){
                target.addEventListener(events[i], handler, eventOptions);
            }
        } else {
            for(let i=0; i<events.length; i++){
                target.removeEventListener(events[i], handler);
            }
        }
    } else {
        if(isAdd){
            for(let i=0; i<events.length; i++){
                target.addEventListener(events, handler, eventOptions);
            }
        } else {
            for(let i=0; i<events.length; i++){
                target.removeEventListener(events, handler);
            }
        }
    }

    
}