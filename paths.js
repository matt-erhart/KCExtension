/*
MAKE SURE THE MANIFEST HTML NAMES MATCH THE PUG HTML TEMPLATE NAMES
AND
THE JS FILES IN THE PUGS MATCH THE JsEntrys
*/

module.exports = {
    backgroundjs: {
        path: '../src/chromeBGProcess/backgroundEntry',
        description: 'entrypoint js file for chrome background processes',
        usedIn: 'webpack/dev.config.js'
    },
    app: {
        path: '../src/chromeUI/index',
        description: 'chrome UI javascript',
        usedIn: 'webpack/dev.config.js'
    },
    chromeButtonPopup: {
        path: '../src/chromeUI/chromeButtonPopup',
        description: 'UI from top right button click',
        usedIn: 'webpack/dev.config.js'
    },
    injectedContent: {
        path: '../src/injectedWebsiteContent/inject',
        description: 'code to injected into websites',
        usedIn: 'webpack/dev.config.js'
    },
    manifestDir: {
        path: 'src',
        description: 'where the manifest dev/prod files are. note theres no leading /',
        usedIn: 'scripts/task.js'
    },
    assetsDir: {
        path: 'src/assets',
        description: 'where images and other files go. note theres no leading /',
        usedIn: 'scripts/task.js'
    },
    htmlTemplatesDir: {
        path: 'src/htmlTemplates',
        description: 'templates that mainly just src the js files made by webpack. note theres no leading /',
        usedIn: 'scripts/task.js'
    }
}