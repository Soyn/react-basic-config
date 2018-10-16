const templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
};
const escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
const escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};
const escapeChar = function (match) {
    return '\\' + escapes[match];
};
const template = (text, settings, oldSettings) => {
    if(!settings && oldSettings) settings = oldSettings;
    settings = Object.assign({}, templateSettings, settings);

    const matcher = RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    let index = 0;
    let source = "__p+='";
    text.replace(matcher, (match, escape, interpolate, evaluate, offset) => {
        source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
        index = offset + match.length;

        if(escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':__t"
        } else if(interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if(evaluate){
            source += "';\n +" + evaluate + "\n__p+=";
        }
        return match;
    });
    source += "';\n";

    if(!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments, '');};\n" +
        source + 'return __p;\n';
    let render;
    try {
        render = new Function(settings.variable || 'obj', source);
    } catch(e) {
        e.source = source;
        throw e;
    }

    const template = function (data) {
        return render.call(this, data);
    }

    const argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';
    return template;
}

const text = 'console.log("hello {{name}}")';
const compiled = template(text, {
    interpolate: /{{([\s\S]+?)}}/g
});

const data = {
    name: 'world',
}
eval(compiled(data));

