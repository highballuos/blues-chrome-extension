const BluesPresenter = (function(){

    let instance;

    function BluesPresenter(){
        if(instance){
            return instance;
        }
        this._model = new BluesModel();
        this._view = new BluesView();
        this._timer = null;

        _addEventsOfBluesBtn.bind(this)();
        
        instance = this;
    }

    // --- Button Code ---

    function _addEventsOfBluesBtn() {
        this._view.addBtnHandler("mouseover", _onMouseoverBtn.bind(this));
        this._view.addBtnHandler("mouseout", _onMouseoutBtn.bind(this));
        this._view.addBtnHandler("click", _onClickBtn.bind(this));
    }

    function _removeEventsOfBluesBtn() {
        this._view.removeBtnHandler("mouseover", _onMouseoverBtn);
        this._view.removeBtnHandler("mouseout", _onMouseoutBtn);
        this._view.removeBtnHandler("click", _onClickBtn);
    }

    // click event func of Blues Button
    // if text's status == hate -> replace text to styled one
    function _onClickBtn(){
        if(this._model.getStatus() != BTN_MODE.HATE_MODE) return;
        this._model.setText(this._model.getStyledText());
        this._view.setText(this._model.getText());

        this._model.setStyledText("");
        this._model.setStatus(BTN_MODE.NORMAL_MODE);
        this._view.setBtnStatus(this._model.getStatus());
        this._view.setStyledTextDisplay(false);
    }

    // mouseover func of Blues Button
    // if text's status == hate -> display styled text view
    function _onMouseoverBtn() {
        if(this._model.getStatus() == BTN_MODE.HATE_MODE)
            this._view.setStyledTextDisplay(true);
    }

    // mouseout func of Blues Button
    // hide styled text view
    function _onMouseoutBtn() {
        this._view.setStyledTextDisplay(false);
    }

    // --- Text Code ---

    // on text change -> timer reset & hide styled text view & detect when text !empty
    function _onTextChange(){
        if(this._timer) clearTimeout(this._timer);

        const text = this._view.getText();
        this._view.setStyledTextDisplay(false);

        if(text == "") {
            this._view.setBtnStatus(BTN_MODE.NORMAL_MODE);
            return;
        }

        this._view.setBtnStatus(BTN_MODE.LOADING_MODE);
        this._model.setText(text);
        this._timer = setTimeout(_detectHateSpeech.bind(this), 1000); // debouncing 1000ms
    }
    
    // not completed need tensorflow js model of styling text
    function _stylingText(){
        this._model.setStyledText(this._model.getText().split("").reverse().join(""));
        this._view.setStyledText(this._model.getStyledText());
    }

    // not completed need tensorflow js model of detect hate speech
    function _detectHateSpeech(){
        chrome.runtime.sendMessage({bluesTextVal: this._model.getText()}, response => {
            if(response && response.isHate !== undefined){
                if(response.isHate){
                    _stylingText.bind(this)();
                    this._model.setStatus(BTN_MODE.HATE_MODE);
                    this._view.setBtnStatus(this._model.getStatus());
                } else {
                    this._model.setStatus(BTN_MODE.NORMAL_MODE);
                    this._view.setBtnStatus(this._model.getStatus());
                }
            } else {        // if something wrong..
                this._model.setStatus(BTN_MODE.NORMAL_MODE);
                this._view.setBtnStatus(this._model.getStatus());
            }
        });
    }
    
    // --- Target & Container Code ---

    // add Target Hander
    function _addEventsOfTarget() {
        eventListenerHelper(document.body, "focusin", _onFocusIn.bind(this), true);
        eventListenerHelper(window, "resize", _onResize.bind(this), true);
    }

    function _removeEventsOfTarget() {
        eventListenerHelper(document.body, "focusin", _onFocusIn.bind(this), false);
        eventListenerHelper(window, "resize", _onResize.bind(this), false);
    }

    // only textarea of line more than 1 && editable div
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

    // focusin event func of target textarea
    // if focused component is text area && target changed
    // -> remove exist target event handler
    // -> change target & add event handler
    function _onFocusIn(event){
        event.stopPropagation();

        if(_isTextElement(event.path[0]) && event.path[0] !== this._view.getTargetView()){
            this._view.removeTargetHandler("input", _onTextChange);
            
            this._view.setTarget(event.path[0]);
            this._view.setBtnStatus(BTN_MODE.NORMAL_MODE);
            this._view.addTargetHandler("input", _onTextChange.bind(this));
            const text = this._view.getText();
            this._model.setText(text ? text : "");

            if(text && text != ""){
                _onTextChange.bind(this)();
            }
        }
    }

    // resize event func of target textarea
    // if resize -> copy layout to Blues Container
    function _onResize(event){
        event.stopPropagation();
        if(this._view.getTargetView()){
            this._view.changePos()
        }
    }


    BluesPresenter.prototype = {
        on : function(){
            if(this._model.getIsTurnOn()) return;

            this._model.setIsTurnOn(true);
            _addEventsOfBluesBtn.bind(this)();
            _addEventsOfTarget.bind(this)();
            this._view.display();
        },
        off : function(){
            if(!this._model.getIsTurnOn()) return;

            this._model.setIsTurnOn(false);
            _removeEventsOfTarget.bind(this)();
            _removeEventsOfBluesBtn.bind(this)();

            if(this._view.hasTarget())
                this._view.removeTargetHandler("input", _onTextChange);
            
            this._view.remove();
        }
    }
    
    return BluesPresenter;
})();