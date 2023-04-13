import aintaType from './ainta-type.js';
import { A_CLASS, FUNCTION, OPEN } from './constants.js';
import {
    buildResultPrefix,
    validateAgainstSchema,
    validateBooleanOption,
    validateSchemaOption,
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a function or class.
 *
 * If the first argument passed to `aintaFunction()` ain't a function or class,
 * it returns a short explanation of what went wrong.
 *
 * Else, if `options.schema` is set, but the function (assumed to be a class)
 * does not conform to that schema, an explanation is returned. `options.open`
 * determines whether static members not in `.schema` are allowed.
 * 
 * Otherwise, `aintaFunction()` returns `false`.
 * 
 * @TODO discuss static vs instance methods and properties
 * @TODO figure out best way to validate instance methods and properties
 *
 * @example
 * import { aintaFunction } from '@0bdx/ainta';
 * 
 * aintaFunction(function increment(n){ return n+1 });
 * // false
 * 
 * aintaFunction(1234);
 * // "A value is type 'number' not 'function'"
 *
 * aintaFunction(null, 'callback', { begin:'runCallback()' });
 * // "runCallback(): `callback` is null not type 'function'"
 *
 * aintaObject(class{ static staticNum = 123 }, 'Anon', { open:true });
 * // false
 *
 * aintaFunction(class{}, 'Anon', { schema:{ staticNum:{ types:['number']} } });
 * // "`Anon.staticNum` is missing"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 *    `options.open` determines whether properties not in `.schema` are allowed.
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaFunction(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `typeof value` is 'function'.
    // If not, bail out right away.
    let result = aintaType(value, identifier, { ...options, type:FUNCTION });
    if (result) return result;

    // If `options.open` or `.schema` are invalid, return a helpful result. Note
    // that setting these to `undefined` may be useful in some cases, so that
    // `{ schema:undefined }` acts the same way as `{}`, which is why we use
    // `options.schema !== void 0` instead of `"schema" in options`.
    const optionsOpen = options.open;
    const hasOpen = optionsOpen !== void 0;
    const optionsSchema = options.schema;
    const hasSchema = optionsSchema !== void 0;
    result = validateBooleanOption(OPEN, optionsOpen, hasOpen)
     || validateSchemaOption(optionsSchema, hasSchema);

    // If the validation above has failed, return an explanation.
    return result
        ? buildResultPrefix(options.begin, identifier, 'A class ') + result

        // Otherwise, check that the class conforms to `options.schema` if set.
        : validateAgainstSchema(value, options, hasSchema, A_CLASS, identifier);
}

/**
 * aintaFunction() unit tests.
 * 
 * @param {aintaFunction} f
 *    The `aintaFunction()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaFunctionTest(f) {
    const e2l = e => (e.stack.split('\n')[2].match(/([^\/]+\.js:\d+):\d+\)?$/)||[])[1];
    const equal = (actual, expected) => { if (actual === expected) return;
        try { throw Error() } catch(err) { throw Error(`actual:\n${actual}\n` +
            `!== expected:\n${expected}\n...at ${e2l(err)}\n`) } };

    /** @type {import('./options').Schema} */
    let schema;

    // Invalid `options.schema` produces a helpful result.
    equal(f(class{a='1'}, 'one', { begin:'{}', schema:null }),
        "{}: `one` cannot be validated, `options.schema` is null not type 'object'");
    // @ts-expect-error
    equal(f(class{a='2'}, 'two', { schema:Array(10) }),
        "`two` cannot be validated, `options.schema` is an array not type 'object'");
    // @ts-expect-error
    equal(f(class{a='3'}, '', { begin:'Three', schema:Symbol(1) }),
        "Three: A class cannot be validated, `options.schema` is type 'symbol' not 'object'");
    // @ts-expect-error
    equal(f(class{a='4'}, undefined, { schema:NaN }),
        "A class cannot be validated, `options.schema` is type 'number' not 'object'");

    // Invalid `options.schema.a` produces a helpful result.
    equal(f(class{a=1}, void 0, { schema:{ a:null } }),
        "A class cannot be validated, `options.schema.a` is null not type 'object'");
    // @ts-expect-error
    equal(f(class{a=2}, 'two', { begin:'A', schema:{ a:[] } }),
        "A: `two` cannot be validated, `options.schema.a` is an array not type 'object'");
    // @ts-expect-error
    equal(f(class{a=3}, '', { begin:'Three', schema:{ a:()=>({}) } }),
        "Three: A class cannot be validated, `options.schema.a` is type 'function' not 'object'");

    // If `options.schema.a.types` is not an array, it produces a helpful result.
    equal(f(class{a='1'}, 'one', { schema: { a:{ types:null } } }),
        "`one` cannot be validated, `options.schema.a.types` is null not an array");
    // @ts-expect-error
    equal(f(class{a='2'}, undefined, { schema: { a:{ types:{} } } }),
        "A class cannot be validated, `options.schema.a.types` is type 'object' not an array");

    // If `options.schema.a.types` contains no arrays, and is invalid, it produces a helpful result.
    equal(f(class{a='1'}, 'one', { schema: { a:{ types:['string',null,'bigint'] } } }),
        "`one` cannot be validated, `options.schema.a.types[1]` is null not type 'string'");
    // @ts-expect-error
    equal(f(class{a='2'}, 'two', { schema: { a:{ types:['string',true] } } }),
        "`two` cannot be validated, `options.schema.a.types[1]` is type 'boolean' not 'string'");
    // @ts-expect-error
    equal(f(class{a='3'}, 'three', { schema: { a:{ types:['string','BigInt','undefined'] } } }),
        "`three` cannot be validated, `options.schema.a.types[1]` 'BigInt' not known");

    // If `options.schema.a.types` contains only arrays, and is invalid, it produces a helpful result.
    equal(f(class{a='1'}, 'one', { schema: { a:{ types:[[],[null]] } } }),
        "`one` cannot be validated, `options.schema.a.types[1][0]` is null not type 'string'");
    // @ts-expect-error
    equal(f(class{a='2'}, undefined, { schema: { a:{ types:[[{}]] } } }),
        "A class cannot be validated, `options.schema.a.types[0][0]` is type 'object' not 'string'");
    // @ts-expect-error
    equal(f(class{a='3'}, 'three', { schema: { a:{ types:[['string',[],'bigint']] } } }),
        "`three` cannot be validated, `options.schema.a.types[0][1]` is an array not type 'string'");
    // @ts-expect-error
    equal(f(class{a='4'}, 'four', { schema: { a:{ types:[['string',true]] } } }),
        "`four` cannot be validated, `options.schema.a.types[0][1]` is type 'boolean' not 'string'");
    // @ts-expect-error
    equal(f(class{a='5'}, 'five', { schema: { a:{ types:[['boolean'],['number'],['bigint','string','undefined','']] } } }),
        "`five` cannot be validated, `options.schema.a.types[2][3]` '' not known");

    // If `options.schema.a.types` contains a mix of arrays and strings, and is invalid, it produces a helpful result.
    equal(f(class{a='1'}, 'one', { schema: { a:{ types:['string',[],null,'bigint'] } } }),
        "`one` cannot be validated, `options.schema.a.types[2]` is null not type 'string'");
    // @ts-expect-error
    equal(f(class{a='2'}, 'two', { schema: { a:{ types:[['string','number'],'undefined',true] } } }),
        "`two` cannot be validated, `options.schema.a.types[2]` is type 'boolean' not 'string'");
    // @ts-expect-error
    equal(f(class{a='3'}, 'three', { schema: { a:{ types:[['string'],'boolean',['Number']] } } }),
        "`three` cannot be validated, `options.schema.a.types[2][0]` 'Number' not known");

    // Typical usage without `options.open` or `.schema`.
    equal(f(()=>{}),
        false);
    equal(f(function increment(n){ return n+1 }, null, { begin:'Function Test' }),
        false);
    equal(f(Math.max, 'built in', {}),
        false);
    try { // might cause an eval error in browsers
        equal(f(Function("return 1"), 'Function("return 1")', { begin:'Function Test' }),
            false);
    } catch(e) {}
    equal(f(123),
        "A value is type 'number' not 'function'");
    equal(f(null, 'should_be_bool', { begin:'Function Test' }),
        "Function Test: `should_be_bool` is null not type 'function'");
    equal(f(void 0, null, { begin:'Function Test' }),
        "Function Test: A value is type 'undefined' not 'function'");
    equal(f([], 'arr'),
        "`arr` is an array not type 'function'");
    equal(f('true', void 0, { type:'function' }),
        "A value is type 'string' not 'function'");

    // Typical `options.open` usage.
    equal(f(class{}, '', { open:true }),
        false);
    equal(f(class{}, '', { open:false }),
        false);
    equal(f(Promise, 'The Promise object', { open:true }),
        false);
    equal(f(Promise, 'The Promise object', { open:false }),
        false);
    equal(f(class{ static unexpected=1 }, 'oops!', { open:true }),
        false);
    equal(f(class{ static unexpected=1 }, 'oops!', { open:false }),
        "`oops!.unexpected` is unexpected");
    equal(f(class{ static a=1; static b=2; static c=3 }, void 0, { begin:'Object Test', open:true }),
        false);
    equal(f(class{ static a=1; static b=2; static c=3 }, void 0, { begin:'Object Test', open:false }),
        "Object Test: `a of a class` is unexpected");
    // @TODO some kind of `Class` constructor

    // Minimal `options.schema` usage - an empty object.
    equal(f(class{}, '', { schema:{} }),
        false);
    equal(f(class{ static foo=true }, void 0, { schema:{} }),
        "`foo of a class` is unexpected");

    // Basic `options.schema` usage - static members must exist but can be any type.
    schema = { a:{}, b:{} };
    equal(f(class{}, null, { begin:'Any!', schema }),
        "Any!: `a of a class` is missing");
    equal(f(class{ static a=true }, 'two_props', { begin:'Any!', schema }),
        "Any!: `two_props.b` is missing");
    equal(f(class{ static a=({}).x }, '', { schema }),
        "`a of a class` is missing");
    equal(f(class{ static a=1; static b='' }, null, { begin:'Any!', schema  }),
        false);
    schema = { a:{ types:[] }, b:{ types:[] } };
    equal(f(class{}, null, { schema }),
        "`a of a class` is missing");
    equal(f(class{ static a=void 0 }, 'obj', { begin:'Undefined Test', schema }),
        "Undefined Test: `obj.a` is missing");
    equal(f(class{ static a=NaN }, 'two_props', { schema }),
        "`two_props.b` is missing");
    equal(f(class{ static a={}; static b=null }, null, { schema  }),
        false);

    // `options.schema` - where the described properties must not exist.
    schema = { a:{ types:['undefined'] }, b:{ types:['undefined'] } };
    equal(f(class{ static a=null }, '', { schema }),
        "`a of a class` is null, not the `options.types` 'undefined'");
    equal(f(class{ static a={}; static b='B!' }, '*', { begin:':', schema }),
        ":: `*.a` is type 'object', not the `options.types` 'undefined'");
    equal(f(class{ static b=1 }, '', { schema }),
        "`b of a class` is type 'number', not the `options.types` 'undefined'");
    equal(f(class{ static extra=99 }, '', { schema }),
        "`extra of a class` is unexpected");

    // `options.schema` - where any property can exist, except the described ones.
    schema = { a:{ types:['undefined'] }, b:{ types:['undefined'] } };
    equal(f(class{ static extra=99 }, '', { open:true, schema }),
        false);
    equal(f(class{ static extra=99; static a=123 }, '', { open:true, schema }),
        "`a of a class` is type 'number', not the `options.types` 'undefined'");

    // `options.schema` - both properties must exist and be non-arrays of one type.
    schema = { a:{ types:['boolean'] }, b:{ types:['object'] } };
    equal(f(class{}, 'obj', { begin:'Must exist', schema }),
        "Must exist: `obj.a` is type 'undefined', not the `options.types` 'boolean'");
    equal(f(class{ static a=false }, '', { schema }),
        "`b of a class` is type 'undefined', not the `options.types` 'object'");
    equal(f(class{ static a=[]; static b={} }, 'O', { schema }),
        "`O.a` is an array, not the `options.types` 'boolean'");
    equal(f(class{ static a=!0; static b=NaN }, '', { begin:'Bool and Obj', schema }),
        "Bool and Obj: `b of a class` is type 'number', not the `options.types` 'object'");
    equal(f(class{ static a=!0; static b=null }, '', { schema }),
        "`b of a class` is null not a regular object");
    equal(f(class{ static a=!0; static b=[] }, 'O', { begin:'Bool and Obj', schema }),
        "Bool and Obj: `O.b` is an array not a regular object");
    equal(f(class{ static a=!1; static b={}; static some=1 }, 'obj', { schema }),
        "`obj.some` is unexpected");
    equal(f(class{ static a=!1; static b=new Date(); static some=1; static more=Symbol('extras allowed') },
        '', { open:true, schema }),
        false);

    // @TODO add the remaining `schema` unit tests converted from aintaObjectTest()

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(parseInt, 'parseInt', { begin:'Function Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f(BigInt(1), 'BigInt(1)', { begin:'Function Test', foo:'bar' }),
        "Function Test: `BigInt(1)` is type 'bigint' not 'function'");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    const noop = () => {};
    // @ts-expect-error
    equal(f(noop, 'yes', { begin:['a','b','c'] }),
        false);
    // @ts-expect-error
    equal(f(NaN, 'num', { begin:['a','b','c'] }),
        "a,b,c: `num` is type 'number' not 'function'");

    // Invalid `options.lte` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(/123/.test, 'lte test', { lte:false }),
        false);
    // @ts-expect-error
    equal(f(/123/, 'lte test', { lte:false }),
        "`lte test` is type 'object' not 'function'");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(x=>false, 'no', { type:String }),
        false);
    // @ts-expect-error
    equal(f([], 'obj', { type:String }),
        "`obj` is an array not type 'function'");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(noop, 'noop', { type:'number' }),
        false);
    equal(f(99.999, 'Nearly one hundred', { type:'number' }),
        "`Nearly one hundred` is type 'number' not 'function'");
}
