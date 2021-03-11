import * as tf from "../node_modules/@tensorflow/tfjs";

const DetectTFModel = (function(){

    let instance;

    function DetectTFModel(){
        if(instance){
            return instance;
        }
        console.log("constructure");
        this._model = tf.loadGraphModel("../../models/detect/model.json");
        console.log("init success");
        instance = this;
    }

    async function _initTF() {
        console.log("init tf");
        return await tf.loadGraphModel("../../models/detect/model.json");
    }

    async function _detectHateSpeech(inputText){
        console.log("_detectHateSpeech");
        inputText = inputText.replace(/ +/g, ' ')
        console.log("inputText");
        let inputTensor = inputText.split("\n").map(value => ([...value.split("")]));
        console.log("inputTensor");
        let inputLengths = inputTensor.map(t => t.length);
        console.log("inputLengths");
        let maxLength = Math.max(...inputLengths);
        console.log("maxLength");
        inputTensor = inputTensor.map(t => [...t, ...Array(maxLength - t.length).fill(0)]);
        console.log("inputTensor2");
        inputTensor = tf.tensor2d(inputTensor, [inputTensor.length, maxLength], dtype = 'int64');
        console.log("inputTensor3");

        output = await (model.predict(inputTensor).argMax(-1).array());
        console.log("predict success");
    }

    DetectTFModel.prototype = {
        detect : _detectHateSpeech.bind(this)
    }
    return DetectTFModel;
})();

// const detectTFModel = new DetectTFModel();

DetectTFModel.detect("이 씨발롬아");