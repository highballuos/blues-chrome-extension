const BluesModel = (function(){

    let instance;

    function BluesModel(){
        if(instance){
            return instance;
        }
        this._text = "";
        this._styledText = "";
        this._status = 0;

        instance = this;
    }

    BluesModel.prototype = {
        setText : function(txt){
            this._text = txt;
        },
        getText : function(){
            return this._text;
        },
        setStyledText : function(txt){
            this._styledText = txt;
        },
        getStyledText : function(){
            return this._styledText;
        },
        setStatus : function(status){
            this._status = status;
        },
        getStatus : function(){
            return this._status;
        },
        clear : function(){
            this._text = "";
            this._styledText = "대체 텍스트";
            this._status = 0;
        }
    }
    return BluesModel;
})();