var program = require('commander');
var moment = require('moment');
var replace = require('replace-in-file');
var version = require("./package.json").version;

program
  .option('-p, --project <name>', 'Name of the project');

program.parse(process.argv);

var builderOptions = program.opts();
var nameProject = builderOptions.project;

var buildVersion = moment().format('[.]YYMMDD[.]HHmm');
var options = {
  files: `projects/${nameProject}/src/environments/environment.prod.ts`,
  from: /version: '.*'/g,
  to: "version: '" + version + buildVersion + "'",
  allowEmptyPaths: false
};

try {
  var changedFiles = replace.sync(options);
  console.log('Build version set: ', buildVersion);
  for (var i = 0; i < changedFiles.length; i++) {
    console.log('Changed Files: ', changedFiles[i].file);
    console.log('Changed: ', changedFiles[i].hasChanged);
  }
} catch (error) {
  console.error('Error occurred:', error);
}
