var B = require('./BinaryRule')

var basic = {
    'ie6' : B.IE6,
    'ie7' : B.IE7,
    'ie8' : B.IE8,
    'ie9' : B.IE9PLUS,
    'ie10': B.IE9PLUS,
    'chrome' : B.CHROME,
    'firefox' : B.FIREFOX,
    'opera' : B.OPERA,
    'safari' : B.SAFARI,
    'std' : B.STD | B.NONEIE
}

var mapping = {
    'ie' : B.ALLIE,
    'ie9plus' : B.IE9PLUS,
    'std' : B.STD | B.NONEIE
}

for(var prop in basic) {
    mapping[prop] = basic[prop]
}

var keys = Object.keys(mapping);
var tmp = [];
keys.forEach(function(k) {
    if (k != 'webkit' && k != 'ie9plus') {
        tmp.push(k);
    }
})
var allBrowsers = tmp.join(',');

function analyse(text) {
    if (!text || text == '' || text=='none' || text == 'false')
        return null
    if (text == 'all')
        text = allBrowsers
    text = text.toLowerCase()
    var splited = text.split(',')
    var browsers = {}

    splited.forEach(function(s) {
        if (mapping[s]) {
            browsers[s] = mapping[s] | B.STD;
        }
    })
    return browsers
}

function whatIs(code) {
    var result = [];
    for(var prop in basic) {
        if (basic[prop] & code) {
            result.push(prop);
        }
    }
    return result.join(',')
}


exports.analyse = analyse
exports.whatIs = whatIs

// if (!module.parent) {
//     console.log(analyse('ie6,std'))
//     console.log(whatIs(B.FIREFOX))
// }