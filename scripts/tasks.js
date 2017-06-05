require('shelljs/global');
const paths = require('../paths')

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'webpack/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'webpack/replace/process-update.js',
    to: 'node_modules/webpack-hot-middleware/process-update.js'
  }];

  replaceTasks.forEach(task => cp(task.from, task.to));
};

exports.copyAssets = (type) => {
  const env = type === 'build' ? 'prod' : type;
  rm('-rf', type);
  mkdir(type);
  cp(`${paths.manifestDir.path}/manifest.${env}.json`, `${type}/manifest.json`);
  cp('-R', paths.assetsDir.path + '/*', type);
  exec(`pug -O "{ env: '${env}' }" -o ${type} ${paths.htmlTemplatesDir.path}`);
};
