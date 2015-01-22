var fs = require('fs');
var jade = require('jade');
var config = null;


var buildConfig = function(){
  config = JSON.parse(fs.readFileSync('./config.json', { encoding : 'utf8' }));
};


var build = function(){
  config.forEach(function(item){
    compileJadeFile('src/' + item.file + '.jade');
  });
};


var serve = function(){
  require('live-server').start(3000);

  fs.watch('./src', function(e, filename){
    compileJadeFile('src/' + filename);
  });

  fs.watch('./config.json', buildConfig);
};


var findDetailsForFile = function(filename){
  var details;
  var abbreviated = filename.replace('src/', '').replace('.jade', '');

  config.forEach(function(item){
    if(item.file == abbreviated)
      details = item;
  });

  return details;
};


var compileJadeFile = function(filename){
  var details = findDetailsForFile(filename);

  var jadeFile = fs.readFileSync(filename,
    { encoding : 'utf8' }
  );

  if(details && details.file){
    var prefix = '';
    if(details.file != 'index')
      prefix = './dest/';
    else
      details.pages = config;

    fs.writeFile(prefix + details.file + '.html',
      jade.compile(jadeFile, {
        pretty    : true,
        filename  : 'uhhhh.html'
      })(details)
    );
  }
};


buildConfig();
build();
process.argv.forEach(function(val, i){
  if(i == 2 && val == 'serve') serve();
});
