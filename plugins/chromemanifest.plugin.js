'use strict';

var path = require('path');
var fs = require('fs');
var lodash = require('lodash');
var mkdirp = require('mkdirp');

function ChromeManifestPlugin(options) {
  this.options = options;
};

ChromeManifestPlugin.prototype.apply = function(compiler) {
  var self = this;

  compiler.plugin('done', function(stats) {
    var manifestTpl = fs.readFileSync(path.join(stats.compilation.compiler.context, self.options.template));
    var manifest = lodash.template(manifestTpl)({chromeManifestPlugin: {options: self.options}});
    var manifestJson = JSON.parse(manifest);
    var icons = [manifestJson.icons['16'], manifestJson.icons['48'], manifestJson.icons['128']];
    icons.forEach(function(icon) {
      mkdirp.sync(path.dirname(path.join(stats.compilation.compiler.outputPath, icon)));
      fs.createReadStream(path.join(stats.compilation.compiler.context, icon))
        .pipe(fs.createWriteStream(path.join(stats.compilation.compiler.outputPath, icon)));
    });
    fs.writeFileSync(path.join(stats.compilation.compiler.outputPath, self.options.filename), manifest);
  });
};

module.exports = ChromeManifestPlugin;
