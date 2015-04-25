var Scope = require('./scope.js');

var evalFn = function (fnName, args, functions) {
    if (fnName == 'print') {
        if (args.length == 0) console.log('null');
        else                  console.log(args.join(','));
        return;
    }

    var fnDecl = functions[fnName];
    if (fnDecl == undefined) {
        console.log("Function '" + fnName + "' is undefined.");
        process.exit();
    }

    var fnArguments = {};
    for (var i = 0; i < args.length; i++) {
        fnArguments[fnDecl.args[i]] = args[i];
    }

    if (fnDecl == null) throw new Error("No function " + fnName);
    return eval({type: 'body', value: fnDecl.body}, functions, new Scope(null, fnArguments));
};

var eval = function (expression, functions, env) {
    switch (expression.type) {
        case 'body':
            return evalBody(expression, functions, env);
        case 'fnCall':
            return evalFnCall(expression, functions, env);
        case 'string':
            return evalString(expression, functions);
        case 'integer':
            return evalInteger(expression, functions);
        case 'binOp':
            return evalBinOp(expression, functions, env);
        case 'varAssignment':
            return evalVarAssignation(expression, functions, env);
        case 'varAccess':
            return evalVarAccess(expression, functions, env);
        case 'if':
            return evalIf(expression, functions, env);
        case 'while':
            return evalWhile(expression, functions, env);
        default:
            console.warn(("Unknown expression type: " + expression.type));
            break;
    }
};

function evalIf(if_, functions, env) {
    var cond = eval(if_.cond, functions, env);
    if (cond == 0 || cond == false) {
        return eval(if_.falsePart, functions, new Scope(env));
    } else {
        return eval(if_.truePart, functions, new Scope(env));
    }
}

function evalWhile(while_, functions, env) {
    while (eval(while_.cond, functions, env) != false) {
        eval({type: 'body', value: while_.body}, functions, new Scope(env));
    }

    return null;
}

function evalBody(body, functions, env) {
    var result;
    body.value.forEach(function (expression) {
        result = eval(expression, functions, env);
    });
    return result;
}

function evalFnCall(fnCall, functions, env) {
    var args = fnCall.args.map(function (arg) {
        return eval(arg, functions, env);
    });

    return evalFn(fnCall.target, args, functions);
}

function evalString(expression, functions) {
    return expression.value;
}

function evalInteger(expression, functions) {
    return expression.value;
}

function evalBinOp(expression, functions, env) {
    switch (expression.op) {
        case '+':
            return eval(expression.left, functions, env) + eval(expression.right, functions, env);
        case '-':
            return eval(expression.left, functions, env) - eval(expression.right, functions, env);
        case '*':
            return eval(expression.left, functions, env) * eval(expression.right, functions, env);
        case '/':
            return eval(expression.left, functions, env) / eval(expression.right, functions, env);
        case '>':
            return eval(expression.left, functions, env) > eval(expression.right, functions, env);
        case '<':
            return eval(expression.left, functions, env) < eval(expression.right, functions, env);
        case '==':
            return eval(expression.left, functions, env) == eval(expression.right, functions, env);
        case '!=':
            return eval(expression.left, functions, env) != eval(expression.right, functions, env);
        default:
            throw new Error("Unrecognized operation.");
    }
}

function evalVarAssignation(expression, functions, env) {
    env.setValue(expression.varName, eval(expression.e, functions, env), true);
}

function evalVarAccess(expression, functions, env) {
    if (env.getValue(expression.varName) == undefined) {
        console.log("Variable '" + expression.varName + "' is undefined.");
        process.exit();
    }
    return env.getValue(expression.varName);
}

exports.eval = eval;
exports.evalFn = evalFn;
