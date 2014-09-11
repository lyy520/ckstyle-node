var doFix = require('./helper').doFix;

exports.doTest = function() {
    var result = doFix('.test {width:100px; display:none;}', '')
    var fixer = result[0]
    var msg = result[1]
    
    styleSheet = fixer.getStyleSheet()
    equal(len(styleSheet.getRuleSets()), 1, 'one ruleset')
    ruleSet = styleSheet.getRuleSets()[0]
    equal(ruleSet.selector, '.test', 'it is the selector that i need')

    rules = ruleSet.getRules()
    equal(rules[0].name, 'display', 'first element is display now')
    equal(rules[1].name, 'width', 'second element is width')

    equal(rules[0].value, 'none', 'first element value is ok')
    equal(rules[1].value, '100px', 'second element value is ok')
}
