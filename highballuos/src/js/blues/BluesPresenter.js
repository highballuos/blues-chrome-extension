const BluesPresenter = (function(){

    let instance;

    function BluesPresenter(){
        if(instance){
            return instance;
        }
        this._model = new BluesModel();
        this._view = new BluesView();
        this._timer = null;
        
        instance = this;
    }

    function _detectHateSpeech(){
        const text = this._view.getText();
        if(text == "") return;
        if(Math.random() >= 0.5){
            this._model.setStatus(BTN_MODE.HATE_MODE);
            this._view.setBtnMode(this._model.getStatus());
        } else {
            this._model.setStatus(BTN_MODE.NORMAL_MODE);
            this._view.setBtnMode(this._model.getStatus());
        }
    }

    function _onTextChange(){
        if(this._timer){
            clearTimeout(this._timer);
        }
        this._view.setBtnMode(BTN_MODE.LOADING_MODE);
        this._model.setText(this._view.getText());
        this._timer = setTimeout(_detectHateSpeech.bind(this), 700, this._view);
    }

    // our target is only type of [div, input, textarea]
    function _isTextElement(element){
        switch(element.tagName) {
            case TEXTAREA_TAG :
                if(element.rows == "1"){
                    return false;
                }
                return true;

            case DIV_TAG :
                return element.contentEditable == "true";
                
            default :
                return false;
        }
    }

    function _onFocusIn(event){
        event.stopPropagation();

        if(_isTextElement(event.path[0]) && event.path[0] !== this._view.getTargetView()){
            this._view.removeTargetHandler("input", _onTextChange);
            this._view.setTarget(event.path[0]);
            this._view.addTargetHandler("input", _onTextChange.bind(this));
            if(this._view.getText() != ""){
                this._model.setText(this._view.getText());
                _onTextChange.bind(this)();
            }
        }
    }


    BluesPresenter.prototype = {
        getView : function(){
            return this._view;
        },
        getTargetView : function(){
            return this._view.getTargetView();
        },
        on : function(){
            this._view.display();
            eventListenerHelper(document.body, "focusin", _onFocusIn.bind(this), true);
        },
        off : function(){
            eventListenerHelper(document.body, "focusin", _onFocusIn.bind(this), false);
            if(this._view.hasTarget()){
                this._view.removeTargetHandler("input", _onTextChange);
            }
            this._view.remove();
        }
    }
    
    return BluesPresenter;
})();