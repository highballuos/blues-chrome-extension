import * as tf from "@tensorflow/tfjs";

const DetectTFModel = (function(){

    let instance;

    function DetectTFModel(){
        if(instance){
            return instance;
        }
        console.log("constructure");
        this._model = _initTF();
        console.log("init success");
        instance = this;
    }

    async function _initTF() {
        console.log("init tf");
        let model = await tf.loadGraphModel("./models/model.json");
        
        let inputText = "야 이 씨발놈아";
        console.log(inputText);
        let inputTensor = inputText.split("\n").map(value => ([...value.split(" ")]));
        console.log(inputTensor);
        let inputLengths = inputTensor.map(t => t.length);
        console.log(inputLengths);
        let maxLength = Math.max(...inputLengths);
        console.log(maxLength);
        inputTensor = inputTensor.map(t => [...t, ...Array(maxLength - t.length).fill(0)]);
        console.log(inputTensor);
        inputTensor = tf.tensor2d(inputTensor, [inputTensor.length, maxLength], dtype = "int64");
        let output = await (model.predict(inputTensor).argMax(-1).array());
        console.log(output);
        return model;
    }

    async function _detectHateSpeech(inputText){
        console.log("_detectHateSpeech");
        inputText = inputText.replace(/ +/g, ' ')
        console.log(inputText);
        let inputTensor = inputText.split("\n").map(value => ([...value.split("")]));
        console.log(inputTensor);
        let inputLengths = inputTensor.map(t => t.length);
        console.log(inputLengths);
        let maxLength = Math.max(...inputLengths);
        console.log(maxLength);
        inputTensor = inputTensor.map(t => [...t, ...Array(maxLength - t.length).fill(0)]);
        console.log(inputTensor);
        inputTensor = tf.tensor2d(inputTensor, [inputTensor.length, maxLength], dtype = 'string');
        

        // console.log("inputTensor3");

        // let inputTensor = tf.tensor([inputText])

        output = await (model.predict(inputTensor));

        console.log("predict success");
        return output;
    }

    DetectTFModel.prototype = {
        detect : _detectHateSpeech.bind(this)
    }
    return DetectTFModel;
})();
console.log(1);
const detectTFModel = new DetectTFModel();
console.log(detectTFModel.detect("안녕하세요"));