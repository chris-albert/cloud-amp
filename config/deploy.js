/* jshint node: true */

module.exports = function(deployTarget) {
  console.log(process.env['S3_ACCESS_KEY']);
  var ENV = {
    build: {

    },
    'revision-data': {
      type: 'git-commit'
    },
    's3-index': {
      accessKeyId: process.env['S3_ACCESS_KEY'],
      secretAccessKey: process.env['S3_SECRET_ACCESS_KEY'],
      bucket: "cloudamp.io",
      region: "us-west-1",
      allowOverwrite: true
    },
    's3': {
      accessKeyId: process.env['S3_ACCESS_KEY'],
      secretAccessKey: process.env['S3_SECRET_ACCESS_KEY'],
      bucket: "cloudamp.io",
      region: "us-west-1"
    }
  };

  return ENV;
};
