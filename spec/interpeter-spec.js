var parser = require('../src/parser/parser.js');

// From http://stackoverflow.com/a/15516475/604041
function commandToString(cmd, args, cb) {
    var spawn = require('child_process').spawn;
    var command = spawn(cmd, args);
    var result = '';
    command.stdout.on('data', function(data) {
        result += data.toString();
    });
    command.on('close', function(code) {
        cb(result);
    });
}

function runSpecForScript(scriptName, expected) {
    it('correctly interprets ' + scriptName + '.script', function () {
        runs(function () {
            flag = false;
            commandToString('./mineral.js', ['scripts/' + scriptName + '.script'], function(result) {
                output = result;
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 'The test for ' + scriptName + ' timed out.', 1000);

        runs(function () {
            expect(output).toEqual(expected);
        });
    });
}

describe('Interpreter', function () {
    runSpecForScript("bignum", (2 * 123456789123456789) + "\n");
    runSpecForScript("fibo", "55\n");
    runSpecForScript("fibo_empty", "1836311903\n");
    runSpecForScript("fun", "1\nfoo\n");
    runSpecForScript("gcd", "3\n1\n5\n");
    runSpecForScript("hello", "hello world\n");
    runSpecForScript("while", "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\ndone !\n");
});