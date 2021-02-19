const BluesView = (function(){

    let instance;

    function BluesView(){
        if(instance){
            return instance;
        }
        this._target = null;
        this._container = _createElement("blues_container", "blues-container");

        this._textarea = _createElement("div", "blues-textarea");
        this._btn = _createElement("div", "blues-btn");
        this._textarea.appendChild(this._btn);
        this._container.appendChild(this._textarea);

        this._hideContainer = _createElement("blues_hide_container", "blues-hide-container");
        this._hideTextbox = _createElement("div", "blues-hide-textbox");
        this._hideContainer.appendChild(this._hideTextbox);
        this._container.appendChild(this._hideContainer);

        this.setStyledText();
        
        instance = this;
    }

    function _createElement(tagName, className){
        const element = document.createElement(tagName);
        element.className = className;
        return element;
    }

    BluesView.prototype = {
        // View Method
        display : function () {
            document.documentElement.appendChild(this._container);
        },
        remove : function(){
            if(this._container){
                document.documentElement.removeChild(this._container);
            }
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
            this.changePos();
        },
        changePos : function(){
            const layout = this._target.getBoundingClientRect();

            this._textarea.style.width = layout.width + "px";
            this._textarea.style.height = layout.height + "px";
            this._container.style.left = window.pageXOffset + layout.left + "px";
            this._container.style.top = window.pageYOffset + layout.top + "px";
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
                return this._target.innerText;
            } else {
                return this._target.value;
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
        },

        // Hide Styled Text View
        setStyledText : function(txt){
            if(txt && txt != ""){
                this._hideTextbox.innerText = txt;
            } else {
                this._hideTextbox.innerText = "대체할 텍스트가 없습니다.";
            }
        },

        setStyledTextDisplay : function(isDisplay){
            this._hideContainer.style.display = isDisplay ? "block" : "none";
        }
    }
    return BluesView;
})();