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
  drawSpectrum(array,ctx,height,width) {
    var maxHeight = 255;
    // clear the current state

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < (array.length); i++) {
        var value = array[i],
          heightPercentage = value / maxHeight,
          p = height * heightPercentage;
        ctx.fillRect(i, height - p, 1, height);
      }
    }
    draw();
  },
  getGradiant(ctx,height) {
    var gradient = ctx.createLinearGradient(0,0,0,height);
    gradient.addColorStop(1,'#36393B');
    gradient.addColorStop(0,'#8D989D');
    return gradient;
  },
  spectrumAnalyser(context,source,canvas) {
    var ctx = canvas.getContext('2d'),
      width = 128,
      height =  30;
    var processor = context.createScriptProcessor(2048,1,1);
    processor.connect(context.destination);
    //Set up analyser
    var analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 256;
    var array =  new Uint8Array(analyser.frequencyBinCount);
    //connect shit together
    source.connect(analyser);
    analyser.connect(processor);
    var self = this;
    ctx.fillStyle = this.getGradiant(ctx,height);
    processor.onaudioprocess = function() {
      // get the average for the first channel
      analyser.getByteFrequencyData(array);
      //2179
      // set the fill style
      self.drawSpectrum(array,ctx,height,width);
    };
    return processor;
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
