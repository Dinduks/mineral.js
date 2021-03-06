var peg = require('../src/parser/peg.js');

describe('Parser', function () {
    it('returns a map of functions', function () {
        var r = peg.parse('fn(foo:\nbar())');
        expect(r).toEqual(jasmine.any(Object));
    });

    describe('fnDecl', function () {
        it('contains the name and the body info', function () {
            var r1 = peg.parse("fn(foo:\nbar()\n3\n'hello')");
            expect(r1.foo.name).toEqual('foo');
            expect(r1.foo.body.length).toEqual(3);

            var r2 = peg.parse("fn(foo a:\n'hello')");
            expect(r2.foo.args.length).toEqual(1);
            expect(r2.foo.args[0]).toEqual('a');

            var r3 = peg.parse("fn(foo a, b:\n'hello')");
            expect(r3.foo.args.length).toEqual(2);
            expect(r3.foo.args[0]).toEqual('a');
            expect(r3.foo.args[1]).toEqual('b');
        });
    });

    describe("fnCall", function () {
        it("contains the type and the target", function () {
            var r = peg.parse("fn(foo:\nbar(42, 'hello'))");
            expect(r.foo.body[0].type).toEqual('fnCall');
            expect(r.foo.body[0].target).toEqual('bar');
        });
        it("contains the arguments info", function () {
            var r1 = peg.parse("fn(foo:\nbar(42, 'hello'))");
            expect(r1.foo.body[0].args).toEqual(jasmine.any(Array));
            expect(r1.foo.body[0].args[0]).toEqual(jasmine.any(Object));
            expect(r1.foo.body[0].args[1]).toEqual(jasmine.any(Object));

            var r2 = peg.parse("fn(foo:\nbar(42))");
            expect(r2.foo.body[0].args).toEqual(jasmine.any(Array));
            expect(r2.foo.body[0].args[0]).toEqual(jasmine.any(Object));

            var r3 = peg.parse("fn(foo:\nbar())");
            expect(r3.foo.body[0].args).toEqual(jasmine.any(Array));
            expect(r3.foo.body[0].args[0]).toBeUndefined();
        });
    });

    describe('integer', function () {
        it('contains the type and the value', function () {
            var r = peg.parse('fn(foo:\n42)');
            expect(r.foo.body[0].type).toEqual('integer');
            expect(r.foo.body[0].value).toEqual(42);
        });
    });

    describe('string', function () {
        it('contains the type and the value', function () {
            var r = peg.parse("fn(foo:\n'hello world')");
            expect(r.foo.body[0].type).toEqual('string');
            expect(r.foo.body[0].value).toEqual('hello world');
        });
    });

    describe('varAssignment', function () {
        it('contains the type, the var name as well as the expr', function () {
            var r = peg.parse("fn(foo:\na = 1)");
            expect(r.foo.body[0].type).toEqual('varAssignment');
            expect(r.foo.body[0].varName).toEqual('a');
            expect(r.foo.body[0].e.type).toEqual('integer');
        });
    });

    describe('varAccess', function () {
        it('contains the type ans the var name', function () {
            var r = peg.parse("fn(foo:\na)");
            expect(r.foo.body[0].type).toEqual('varAccess');
            expect(r.foo.body[0].varName).toEqual('a');
        });
    });
});
