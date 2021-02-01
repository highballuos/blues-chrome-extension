const BluesView = (function(){

    let instance;

    function BluesView(){
        if(instance){
            return instance;
        }
        this._target = null;
        this._container = _createContainer();

        this._btn = _createBtn();
        this._container.appendChild(this._btn);
        
        instance = this;
    }

    const _createContainer = () => {
        const container = document.createElement("blues_container");
        container.className = "highballuos-container";
        return container;
    }

    const _createBtn = () => {
        const btn = document.createElement("button");
        btn.className = "highballuos-btn";
        return btn;
    }

    const _copyLayout = (origin, target) => {
        const layout = origin.getBoundingClientRect();
        
        target.style.width = layout.width + "px";
        target.style.height = layout.height + "px";
        target.style.left = window.pageXOffset + layout.left + "px";
        target.style.top = window.pageYOffset + layout.top + "px";
    }

    BluesView.prototype = {
        // View Method
        display : function () {
            document.documentElement.appendChild(this._container);
        },
        remove : function(){
            document.documentElement.removeChild(this._container);
            this._target = null;
        },

        // Target Text Input View Method
        hasTarget : function(){
            if(this._target){
                return true;
            }
            return false;
        },
        setTarget : function(target){
            this._target = target;
            _copyLayout(this._target, this._container);
        },
        getTargetView : function(){
            return this._target;
        },
        addTargetHandler : function(eventType, handler){
            eventListenerHelper(this._target, eventType, handler, true);
        },
        removeTargetHandler : function(eventType, handler){
            if(this._target){
                eventListenerHelper(this._target, eventType, handler, false);
            }
        },
        getText : function(){
            if(this._target.tagName == DIV_TAG){
                txt = this._target.innerText;
            } else {
                txt = this._target.value;
            }
        },
        setText : function(txt){
            if(this._target.tagName == DIV_TAG){
                this._target.innerText = txt;
            } else {
                this._target.value = txt;
            }
        },

        // Container View Method
        getContainer : function() {
            return this._container;
        },
        
        // Button View Method
        getBtn : function() {
            return this._btn;
        },
        setBtnMode : function(mode){
            if(this._btn){
                this._btn.style.backgroundImage = BTN_IMAGES[mode];
            } else {
                console.log("button not exist");
            }
        },
        addBtnHandler : function(eventType, handler){
            if(this._btn){
                eventListenerHelper(this._btn, eventType, handler, true);
            } else {
                console.log("addBtnHandler fail : button not exist");
            }
        },
        removeBtnHandler : function(eventType, handler){
            if(this._btn){
                eventListenerHelper(this._btn, eventType, handler, false);
            } else {
                console.log("removeBtnHandler fail : button not exist");
            }
        }
    }
    return BluesView;
})();