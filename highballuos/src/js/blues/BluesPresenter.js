const BluesPresenter = (function(){

    let instance;

    function BluesPresenter(){
        if(instance){
            return instance;
        }
        this._model = new BluesModel();
        this._view = new BluesView();
        this._timer = null;
        this._isTurnON = true;

        _addMouseEventOnBtn.bind(this)();
        
        instance = this;
    }


    function _detectHateSpeech(){
        // const text = this._model.getText();
        if(Math.random() >= 0.5){
            this._model.setStatus(BTN_MODE.HATE_MODE);
            this._view.setBtnMode(this._model.getStatus());
            _stylingText.bind(this)();
        } else {
            this._model.setStatus(BTN_MODE.NORMAL_MODE);
            this._view.setBtnMode(this._model.getStatus());
        }
    }

    function _stylingText(){
        this._model.setStyledText(this._model.getText().split("").reverse().join(""));
        this._view.setStyledText(this._model.getStyledText());
    }

    function _onTextChange(){
        if(this._timer){
            clearTimeout(this._timer);
        }
        const text = this._view.getText();
        this._model.setStyledText("");
        this._view.setStyledText(this._model.getStyledText());
        if(text == ""){
            return;
        }

        this._view.setBtnMode(BTN_MODE.LOADING_MODE);
        this._model.setText(text);
        // debouncing 1000ms
        this._timer = setTimeout(_detectHateSpeech.bind(this), 1000);
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
            this._view.setBtnMode(BTN_MODE.NORMAL_MODE);
            this._view.addTargetHandler("input", _onTextChange.bind(this));
            const text = this._view.getText();
            if(text && text != ""){
                this._model.setText(this._view.getText());
                _onTextChange.bind(this)();
            }
        }
    }

    function _onResize(event){
        event.stopPropagation();
        if(this._view.getTargetView()){
            this._view.changePos()
        }
    }

    function _onClickBtn(){
        this._model.setText(this._model.getStyledText());
        this._view.setText(this._model.getText());

        this._model.setStyledText("");
        this._model.setStatus(BTN_MODE.NORMAL_MODE);
        this._view.setBtnMode(this._model.getStatus());
        this._view.setStyledTextDisplay(false);
    }

    function _addMouseEventOnBtn(){
        this._view.addBtnHandler("mouseover", function(){
            if(this._model.getStatus() == BTN_MODE.HATE_MODE)
                this._view.setStyledTextDisplay(true);
        }.bind(this));
        this._view.addBtnHandler("mouseout", function(){
            this._view.setStyledTextDisplay(false);
        }.bind(this));
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
            _addMouseEventOnBtn.bind(this)();
            eventListenerHelper(document.body, "focusin", _onFocusIn.bind(this), true);
            eventListenerHelper(window, "resize", _onResize.bind(this), true);
            this._view.addBtnHandler("click", _onClickBtn.bind(this));
        },
        off : function(){
            eventListenerHelper(document.body, "focusin", _onFocusIn.bind(this), false);
            eventListenerHelper(window, "resize", _onResize.bind(this), false);
            if(this._view.hasTarget()){
                this._view.removeTargetHandler("input", _onTextChange);
            }
            this._view.remove();
        },
        getIsTurnON : function(){
            return this._isTurnON;
        },
        setIsTurnON : function(isTurnON){
            this._isTurnON = isTurnON;
        }
    }
    
    return BluesPresenter;
})();