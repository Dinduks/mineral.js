#!/usr/bin/env node

var fs = require('fs');

var fileName = process.argv[2];

if (fileName == undefined) {
    throw new Error("Please specify a Mineral script.");
}

fs.readFile(fileName, "utf8", function (error, data) {
    if (error) {
        throw new Error("Error while reading the file: " + error);
    }

    var peg = require("./parser/peg.js");
    var functions = peg.parse(data);

    if (functions.main === undefined) {
        throw new Error("No main function declared.");
    }

    interpret(functions.main, functions);
});
function interpret(expression, functions) {
    //console.log(expression);
    //console.log(functions);
    //
    switch (expression.type) {
        case 'fnDecl':
            interpretFnDecl(expression, functions);
            break;
        default:
            console.warn(("Unknown expression type: " + expression.type));
            break;
    }
}

var interpretFnDecl = function (expression, functions) {
    expression.body.forEach(function (expression) {
        interpret(expression, functions);
    });
};
