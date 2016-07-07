/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {});

  //Jquery UI
  app.import(app.bowerDirectory + '/jquery-ui/ui/core.js');
  app.import(app.bowerDirectory + '/jquery-ui/ui/widget.js');
  app.import(app.bowerDirectory + '/jquery-ui/ui/mouse.js');
  app.import(app.bowerDirectory + '/jquery-ui/ui/slider.js');
  app.import(app.bowerDirectory + '/jquery-ui/themes/base/jquery-ui.min.css');

  //Perfect scrollbar
  app.import(app.bowerDirectory + '/perfect-scrollbar/js/perfect-scrollbar.min.js');
  app.import(app.bowerDirectory + '/perfect-scrollbar/css/perfect-scrollbar.min.css');

  //Jquery DataTables
  app.import(app.bowerDirectory + '/datatables.net/js/jquery.dataTables.min.js');

  return app.toTree();
};
