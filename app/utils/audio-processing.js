import Ember from 'ember';

export default {
  getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
      values += array[i];
    }

    average = values / length;
    return average;
  },
  drawSpectrum(array,ctx) {
    for ( var i = 0; i < (array.length); i++ ){
      var value = array[i];
      ctx.fillRect(i*5,325-value,3,325);
    }
  },
  getGradiant(ctx) {
    var gradient = ctx.createLinearGradient(0,0,0,300);
    gradient.addColorStop(1,'#000000');
    gradient.addColorStop(0.75,'#ff0000');
    gradient.addColorStop(0.25,'#ffff00');
    gradient.addColorStop(0,'#ffffff');
  },
  spectrumAnalyser(context,source,ctx) {
    var processor = context.createScriptProcessor(2048,1,1);
    processor.connect(context.destination);
    //Set up analyser
    var analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 512;
    //connect shit together
    source.connect(analyser);
    analyser.connect(processor);
    processor.onaudioprocess = function() {

      // get the average for the first channel
      var array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);

      // clear the current state
      ctx.clearRect(0, 0, 1000, 325);

      // set the fill style
      ctx.fillStyle=getGradiant(ctx);
      drawSpectrum(array,ctx);
    };
  },
  volumeMeter(context,source,ctx) {
    var analyser = context.createAnalyser(),
      javascriptNode = context.createScriptProcessor(2048,1,1);
    source.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(context.destination);

    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;
    javascriptNode.onaudioprocess = function() {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var average = getAverageVolume(array);

      // clear the current state
      ctx.clearRect(0, 0, 60, 130);

      // set the fill style
      ctx.fillStyle='green';

      // create the meters
      ctx.fillRect(0,130-average,25,130);
      //ctx.fillRect(10,10,100,100);
    };
  },
};