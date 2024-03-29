import aintaFunction from './ainta-function.js';
import aintaNumber from './ainta-number.js';
import aintaObject from './ainta-object.js';
import aintaString from './ainta-string.js';
import {
    _BT_OPTIONS_DOT,
    _IS_NOT_,
    _NOT_,
    _NOT_A_REGULAR_,
    _NOT_AN_ARRAY,
    _OF_,
    A_DICTIONARY,
    AN_ARRAY,
    CANNOT_OPTIONS,
    FUNCTION,
    IS_,
    IS_AN_ARRAY,
    IS_NULL,
    IS_TYPE_,
    KEY,
    LEAST,
    MOST,
    NULL,
    NUMBER,
    OBJECT,
    ONE,
    PASS,
    STRING,
    THE_BT_OPT_TYPES_BT_,
    TYPE_,
    TYPES,
} from './constants.js';
import {
    buildResultPrefix,
    isArray,
    QO,
    quote,
    sanitise,
    saq,
    validateArrayOfTypesOption,
    validateBooleanOption,
    validateNumericOption,
    validateRxishOption,
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates that a value is a simple object of key/value pairs.
 *
 * A ‘dictionary’ is a JavaScript object with arbitrary key/value pairs. Often,
 * all the values will be of the same type - eg, Node.js's `process.env` object,
 * where every value is a string.
 *
 * If the first argument passed to `aintaDictionary()` ain't a dictionary, it
 * returns a short explanation of what went wrong.
 *
 * Else, if the dictionary fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.key` - if set, all keys must pass this `RexExp`-like object
 * - `options.least` - if set, there must be at least this number of properties
 * - `options.most` - if set, there must not be more than this number of properties
 * - `options.pass` - if set, each property is validated more deeply using `options`
 * - `options.types` - if set, all values must be one of these types
 *
 * Otherwise, `aintaDictionary()` returns `false`.
 *
 * @example
 * import { aintaDictionary } from '@0bdx/ainta';
 * 
 * aintaDictionary({ zero:0, one:1 }, 'all_num', { types:['number'] });
 * // false
 *
 * aintaDictionary([]);
 * // "A value is an array, not type 'object'"
 *
 * aintaDictionary(null, 'lookupTable', { begin:'processLUT()' });
 * // "processLUT(): `lookupTable` is null not a dictionary"
 *
 * aintaDictionary({ zero:0, one:'1' }, 'all_num', { types:['number'] });
 * // "`all_num[1]` is type 'string', not the `options.types` 'number'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaDictionary(
    value,
    identifier,
    options = emptyOptions,
) {
    // Check that `value` is a regular JavaScript object. If not, bail out.
    let result = value === null
        ? IS_NULL + _NOT_A_REGULAR_ + OBJECT
        : isArray(value)
            ? IS_AN_ARRAY + _NOT_A_REGULAR_ + OBJECT
            : typeof value !== OBJECT
                ? IS_TYPE_ + quote(typeof value) + _NOT_ + QO
                : ''
    ;
    if (result) return buildResultPrefix(options.begin, identifier) + result;

    // Will probably be needed several times, below.
    const entries = Object.entries(value);
    const length = entries.length;

    // If `options.key`, `.least`, `.most`, `.pass` or `.types` are invalid,
    // return a helpful result. Setting these to `undefined` may be useful in
    // some cases, so that `{ most:undefined }` acts the same way as `{}`, which
    // is why we use `options.key !== void 0` instead of `"key" in options`.
    const optionsKey = options.key;
    const hasKey = optionsKey !== void 0;
    const optionsLeast = options.least;
    const hasLeast = optionsLeast !== void 0;
    const optionsMost = options.most;
    const hasMost = optionsMost !== void 0;
    const optionsPass = options.pass;
    const hasPass = optionsPass !== void 0;
    const optionsTypes = options.types;
    const hasTypes = optionsTypes !== void 0;
    result =
        validateRxishOption(KEY, optionsKey, hasKey)
     || validateNumericOption(LEAST, optionsLeast, hasLeast, false, true)
     || validateNumericOption(MOST, optionsMost, hasMost, false, true)
     || validateBooleanOption(PASS, optionsPass, hasPass)
     || validateArrayOfTypesOption(TYPES, optionsTypes, hasTypes)

    // If `options.least` and `options.most` are both being used, but `least` is
    // more than `most`, return a helpful result.
     || (hasLeast && hasMost && optionsLeast > optionsMost
        ? CANNOT_OPTIONS + 'least` > `options.most`'

        // Check that the length is not less than `options.least`, if set.
        : hasLeast && optionsLeast > length
            ? 'has length ' + length + ' < `options.' + LEAST + '` ' + optionsLeast

            // Check that the length is not more than `options.most`, if set.
            : hasMost && optionsMost < length
                ? 'has length ' + length + ' > `options.' + MOST + '` ' + optionsMost
                : ''
    );

    // If any of the validation above has failed, return an explanation.
    return result
        ? buildResultPrefix(options.begin, identifier, 'A dictionary ') + result

        // Otherwise, check that every property conforms to `options.types`, if set.
        : validateEveryProperty(entries, length, options, hasKey, hasTypes, identifier);
}

function validateEveryProperty(entries, length, options, hasKey, hasTypes, identifier) {
    const { begin, key:optionsKey, pass, types } = options;

    // If no types are defined, the property can be any type, or even `undefined`.
    const definesTypes = hasTypes && types.length;

    // Step through each property in the `entries` array.
    for (let i=0; i<length; i++) {
        const [key, value] = entries[i];
        const type = typeof value;

        // If the key fails the RegExp `option.key`, return an explanation of the
        // problem. Note that `option.key` can also be an object with a `test()`.
        if (hasKey && !optionsKey.test(key)) {
            const safeKey = sanitise(key);
            return buildResultPrefix(
                begin,
                identifier && identifier + '.' + safeKey,
                '`' + safeKey + _OF_ + A_DICTIONARY + '` '
            ) + 'fails ' + (
                optionsKey instanceof RegExp
                    ? optionsKey
                    : 'custom test ' + FUNCTION
            );
        }

        // If the value's type is not included in `options.types`, return an
        // explanation of the problem.
        if (definesTypes && types.indexOf(type) === -1) {
            return buildResultPrefix(
                begin,
                identifier && identifier + '.' + key,
                '`' + key + _OF_ + A_DICTIONARY + '` '
            ) + IS_ + (
                value === null
                    ? NULL
                    : isArray(value)
                        ? AN_ARRAY
                        : TYPE_ + quote(type)
            ) + ',' + _NOT_ + (
                types.length === 1
                    ? THE_BT_OPT_TYPES_BT_ + quote(types[0])
                    : ONE + _OF_ + THE_BT_OPT_TYPES_BT_ + saq(types.join(':'))
            );
        }

        // The value's type is included in `options.types`, but if `options.pass`
        // is set to `true` the value may still be invalid.
        if (pass) {
            const valueIdentifier = identifier
                ? identifier + '.' + key
                : key + _OF_ + A_DICTIONARY
            let result;
            switch (type) {
                case FUNCTION:
                    result = aintaFunction(value, valueIdentifier, options);
                    if (result) return result;
                    break;
                case NUMBER:
                    result = aintaNumber(value, valueIdentifier, options);
                    if (result) return result;
                    break;
                case OBJECT:
                    if (value === null) break; // @TODO a bit hacky, revisit this
                    if (Array.isArray(value)) break; // @TODO a bit hacky, revisit this
                    result = aintaObject(value, valueIdentifier, options);
                    if (result) return result;
                    break;
                case STRING:
                    result = aintaString(value, valueIdentifier, options);
                    if (result) return result;
                    break;
            }
        }
    }

    return false;
}

/**
 * aintaDictionary() unit tests.
 * 
 * @param {aintaDictionary} f
 *    The `aintaDictionary()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaDictionaryTest(f) {
    const e2l = e => (e.stack.split('\n')[2].match(/([^\/]+\.js:\d+):\d+\)?$/)||[])[1];
    const equal = (actual, expected) => { if (actual === expected) return;
        try { throw Error() } catch(err) { throw Error(`actual:\n${actual}\n` +
            `!== expected:\n${expected}\n...at ${e2l(err)}\n`) } };

    // Invalid `options.key` produces a helpful result.
    equal(f({a:1}, 'one', { begin:'Least', key:null }),
        "Least: `one` cannot be validated, `options.key` is null not type 'object'");
    // @ts-expect-error
    equal(f({a:2}, undefined, { key:[], least:false }), // the `least` error is ignored
        "A dictionary cannot be validated, `options.key` is an array not type 'object'");
    // @ts-expect-error
    equal(f({a:3}, null, { begin:'Three', key:NaN }),
        "Three: A dictionary cannot be validated, `options.key` is type 'number' not 'object'");
    // @ts-expect-error
    equal(f({a:4}, 'nope', { key:{} }),
        "`nope` cannot be validated, `options.key.test` is type 'undefined' not 'function'");
    equal(f({a:5}, 'five', { key:{ test:null } }),
        "`five` cannot be validated, `options.key.test` is null not type 'function'");
    // @ts-expect-error
    equal(f({a:6}, '6', { begin:'six()', key:{ test:[] } }),
        "six(): `6` cannot be validated, `options.key.test` is an array not type 'function'");
    // @ts-expect-error
    equal(f({a:7}, '', { key:{ test:BigInt(7) } }),
        "A dictionary cannot be validated, `options.key.test` is type 'bigint' not 'function'");

    // Invalid `options.least` produces a helpful result.
    equal(f({a:1}, 'one', { begin:'Least', least:null }),
        "Least: `one` cannot be validated, `options.least` is null not type 'number'");
    // @ts-expect-error
    equal(f({a:2}, undefined, { least:[], most:{} }), // the `most` error is ignored
        "A dictionary cannot be validated, `options.least` is an array not type 'number'");
    // @ts-expect-error
    equal(f({a:3}, null, { begin:'Three', least:Symbol(3) }),
        "Three: A dictionary cannot be validated, `options.least` is type 'symbol' not 'number'");
    // @ts-expect-error
    equal(f({a:4}, 'nope', { least:NaN, types:true }), // the `types` error is ignored
        "`nope` cannot be validated, `options.least` is the special `NaN` value");
    equal(f({a:5}, '', { least:-1 }),
        "A dictionary cannot be validated, `options.least` is negative");

    // Invalid `options.most` produces a helpful result.
    equal(f({b:1}, 'one', { begin:'Most', most:null }),
        "Most: `one` cannot be validated, `options.most` is null not type 'number'");
    // @ts-expect-error
    equal(f({b:2}, undefined, { most:[], pass:123 }), // the `pass` error is ignored
        "A dictionary cannot be validated, `options.most` is an array not type 'number'");
    // @ts-expect-error
    equal(f({b:3}, null, { begin:'Three', most:{} }),
        "Three: A dictionary cannot be validated, `options.most` is type 'object' not 'number'");
    // @ts-expect-error
    equal(f({b:4}, 'nope', { most:NaN, types:0 }), // the `types` error is ignored
        "`nope` cannot be validated, `options.most` is the special `NaN` value");
    equal(f({b:5}, '', { begin:'Negative', most:-0.001 }),
        "Negative: A dictionary cannot be validated, `options.most` is negative");

    // Invalid combination of `options.least` and `.most` produces a helpful result.
    equal(f({c:5}, 'five', { least:1.001, most:1 }),
        "`five` cannot be validated, `options.least` > `options.most`");
    equal(f({c:6}, '', { begin:'impossible range', least:Infinity, most:9999999 }),
        "impossible range: A dictionary cannot be validated, `options.least` > `options.most`");

    // Invalid `options.pass` produces a helpful result.
    equal(f({d:1}, 'one', { begin:'Pass', pass:null }),
        "Pass: `one` cannot be validated, `options.pass` is null not type 'boolean'");
    // @ts-expect-error
    equal(f({d:2}, undefined, { pass:[], types:123 }), // the `types` error is ignored
        "A dictionary cannot be validated, `options.pass` is an array not type 'boolean'");
    // @ts-expect-error
    equal(f({d:3}, null, { begin:'Three', pass:0 }),
        "Three: A dictionary cannot be validated, `options.pass` is type 'number' not 'boolean'");

    // If `options.pass` is `true`, invalid options sent to `aintaNumber()` or
    // `aintaString()` can produce helpful results... but only if a value
    // actually triggers their use.
    equal(f({e:'1'}, 'one', { begin:'Pass', mod:0, pass:true }),
        false);
    equal(f({e:'2'}, 'two', { begin:'Pass', mod:0, pass:true, types:['number'] }),
        "Pass: `two.e` is type 'string', not the `options.types` 'number'");
    equal(f({e:'3',f:'3',g:3,h:'3'}, 'three', { begin:'Pass', mod:0, pass:true }),
        "Pass: `three.g` cannot be validated, `options.mod` is zero");
    equal(f({e:4}, 'four', { begin:'Pass', max:44, min:77, pass:true }),
        false);
    equal(f({e:5}, 'five', { begin:'Pass', max:44, min:77, pass:true, types:['string'] }),
        "Pass: `five.e` is type 'number', not the `options.types` 'string'");
    equal(f({e:6,f:'6'}, 'six', { begin:'Pass', max:44, min:77, pass:true }),
        "Pass: `six.f` cannot be validated, `options.max` < `options.min`");

    // Invalid `options.types` produces a helpful result.
    equal(f({f:1}, 'one', { types:null }),
        "`one` cannot be validated, `options.types` is null not an array");
    // @ts-expect-error
    equal(f({f:2}, undefined, { types:77 }),
        "A dictionary cannot be validated, `options.types` is type 'number' not an array");
    equal(f({f:3}, 'three', { types:['string',null,'bigint'] }),
        "`three` cannot be validated, `options.types[1]` is null not type 'string'");
    equal(f({f:4}, 'four', { types:['string','bigint',[]] }),
        "`four` cannot be validated, `options.types[2]` is an array not type 'string'");
    // @ts-expect-error
    equal(f({f:5}, 'five', { types:[123,'string','bigint'] }),
        "`five` cannot be validated, `options.types[0]` is type 'number' not 'string'");
    // @ts-expect-error
    equal(f({f:6}, 'six', { types:['string','bigint','Number','undefined'] }),
        "`six` cannot be validated, `options.types[2]` 'Number' not known");

    // Typical usage without `options.least`, `.most`, `.pass` or `.types`.
    equal(f({}),
        false);
    equal(f({ a:1, b:2, c:3 }, void 0, { begin:'Dictionary Test' }),
        false);
    equal(f(Object(), 'Constructor', {}),
        false);
    equal(f(JSON.parse('{"json":"ok!"}'), 'json', { begin:'Dictionary Test' }),
        false);
    equal(f(),
        "A value is type 'undefined' not 'object'");
    equal(f(null, 'lut', { begin:'Dictionary Test' }),
        "Dictionary Test: `lut` is null not a regular object");
    equal(f(void 0, null, { begin:'Dictionary Test' }),
        "Dictionary Test: A value is type 'undefined' not 'object'");
    equal(f(BigInt('111'), 'date'),
        "`date` is type 'bigint' not 'object'");
    equal(f(123, void 0, { type:'number' }),
        "A value is type 'number' not 'object'");

    // Typical `options.key` usage.
    equal(f({a:1,b:2,C:3}, null, { key:/^[a-z]$/ }),
        "`C of a dictionary` fails /^[a-z]$/");
    equal(f({a:1,bb:2,c:3}, 'dict', { key:/^[a-z]$/ }),
        "`dict.bb` fails /^[a-z]$/");
    equal(f({a:1,b:2,c:3}, 'ok_dict', { key:/^[a-z]$/ }),
        false);
    equal(f({}, 'empty_dict', { key:/^[a-z]$/ }),
        false);

    // Typical `options.least` usage.
    equal(f({a:1,b:2}, null, { least:3 }),
        "A dictionary has length 2 < `options.least` 3");
    equal(f({a:1,b:2,c:3}, null, { least:3 }),
        false);
    equal(f({}, 'empty_array,', { least:0 }),
        false);

    // Typical `options.most` usage.
    equal(f({a:1,b:2}, null, { most:1 }),
        "A dictionary has length 2 > `options.most` 1");
    equal(f({a:1}, null, { most:3 }),
        false);
    equal(f({a:1}, null, { most:0 }),
        "A dictionary has length 1 > `options.most` 0");
    equal(f({}, 'empty_array,', { most:0 }),
        false);

    // Using `options.least` and `options.most` together.
    equal(f({a:1,b:1,c:1,d:1,e:1,f:1}, null, { least:5, most:5 }),
        "A dictionary has length 6 > `options.most` 5");
    equal(f({a:1,b:1,c:1,d:1,e:1}, null, { least:5, most:5 }),
        false);
    equal(f({a:1,b:1,c:1,d:1}, null, { least:5, most:5 }),
        "A dictionary has length 4 < `options.least` 5");

    // Typical `options.pass` usage.
    equal(f({a:0,b:-Infinity,c:NaN}, 'numbers', { pass:true }),
        "`numbers.c` is the special `NaN` value not a regular number");
    equal(f({a:0,b:-Infinity,c:NaN}, 'numbers', { pass:false }),
        false);
    equal(f({a:0,b:-1,c:-10}, void 0, { begin:'Numbers', gte:0, pass:true }),
        "Numbers: `b of a dictionary` -1 is not gte 0");
    equal(f({a:0,b:1,c:10}, void 0, { begin:'Numbers', gte:0, pass:true }),
        false);
    equal(f({a:0,b:-10,c:100,d:11}, 'multiples_of_10', { begin:'Numbers', mod:10, pass:true }),
        "Numbers: `multiples_of_10.d` 11 is not divisible by 10");
    equal(f({a:0,b:-10,c:100,d:11}, 'multiples_of_10', { begin:'Numbers', mod:10, pass:false }),
        false);

    // Using `options.pass` to validate a dictionary of objects with a schema.
    // @TODO output better wording than `C of a dictionary.a`
    // @TODO differentiate wording from aintaFunction()
    equal(f({A:{a:0},B:{a:1},C:{a:'2'},D:{a:3}}, '', { begin:'obj.a is a number',
        pass:true, schema:{ a:{ types:['number']} }, types:['object'] }),
        "obj.a is a number: `C of a dictionary.a` is type 'string', not the `options.types` 'number'");
    equal(f({A:{a:0},B:[],C:{a:1},D:{a:2},E:null,F:{a:3}}, '', { begin:'the array and null are allowed',
        pass:true, schema:{ a:{ types:['number']} }, types:['object'] }),
        false);
    equal(f({A:{a:0},B:{a:1},C:{a:'2'},D:{a:3}}, '', { begin:'pass is false',
        pass:false, schema:{ a:{ types:['number']} }, types:['object'] }),
        false);

    // Using `options.pass` to validate a dictionary of classes with a schema.
    // @TODO output better wording than `C of a dictionary.a`
    // @TODO differentiate wording from aintaObject()
    equal(f({A:class A{static a=0},B:class{static a=1},C:class{static a='2'},D:class{static a=3}},
        '', { begin:'obj.a is a number',
        pass:true, schema:{ a:{ types:['number']} }, types:['function'] }),
        "obj.a is a number: `C of a dictionary.a` is type 'string', not the `options.types` 'number'");
    equal(f({A:class A{static a=0},B:class{static a=1},C:class{static a='2'},D:class{static a=3}},
        '', { begin:'pass is false',
        pass:false, schema:{ a:{ types:['number']} }, types:['function'] }),
        false);

    // Basic `options.types` usage - properties can be any type.
    const everyType = {a:{},b:null,c:[],d:Math,e:/a/,f:()=>0,g:1,h:NaN,i:'a',j:false,k:void 0,l:BigInt(1),m:Symbol('a')};
    equal(f(everyType, 'everyType', { begin:'Anything goes', types:[] }),
        false);

    // Typical `options.types` usage - properties must be of one type.
    equal(f({a:0,b:false,c:[],d:'three'}, `bool_lut`, { begin:' ', types:['boolean'] }),
        " : `bool_lut.a` is type 'number', not the `options.types` 'boolean'");
    equal(f({a:undefined,b:undefined,c:undefined,d:[]}, 'ok', { types:['undefined'] }),
        "`ok.d` is an array, not the `options.types` 'undefined'");
    equal(f({a:void 0,b:null}, '', { begin:'All undefined', types:['undefined'] }),
        "All undefined: `b of a dictionary` is null, not the `options.types` 'undefined'");
    equal(f({a:{},b:null,c:[],d:Math}, 'objs', { begin:'All objects', types:['object'] }),
        false);

    // Typical `options.types` usage - properties must be of two types.
    equal(f({a:'0',b:null}, 'bool_and_str_lut', { types:['boolean','string'] }),
        "`bool_and_str_lut.b` is null, not one of the `options.types` 'boolean:string'");
    equal(f({a:'0',b:false,c:[],d:'three'}, null, { types:['boolean','string'] }),
        "`c of a dictionary` is an array, not one of the `options.types` 'boolean:string'");
    equal(f({a:-0,b:NaN,c:Infinity,d:BigInt(77)}, void 0, { begin:'All numeric', types:['number','bigint'] }),
        false);

    // Using `options.pass` with an empty `options.types`.
    equal(f(everyType, '', {
        min:2, lte:0, pass:true, types:[] }),
        "`g of a dictionary` 1 is not lte 0");
    equal(f(everyType, 'everyType', {
        min:2, lte:1, pass:true, types:[] }),
        "`everyType.h` is the special `NaN` value not a regular number");
    equal(f(everyType, undefined, { begin: 'Every Type',
        min:2, pass:true, types:[] }),
        "Every Type: `h of a dictionary` is the special `NaN` value not a regular number");
    everyType.h = 2;
    equal(f(everyType, 'everyType', { begin: 'Every Type',
        min:2, pass:true, types:[] }),
        "Every Type: `everyType.i` 'a' is not min 2");
    equal(f(everyType, '', {
        min:1, pass:true, types:[] }),
        false);

    // Using `options.pass` and `options.types` together.
    equal(f({a:-1,b:'',c:0,d:77}, 'arr', { begin:'negative or non-empty str',
        lte:0, min:1, pass:true, types:['number','string'] }), // aintaString() uses min:1
        "negative or non-empty str: `arr.b` '' is not min 1");
    equal(f({a:-1,b:'a',c:0,d:77}, '', { begin:'negative or non-empty str',
        lte:0, min:1, pass:true, types:['number','string'] }), // aintaNumber() uses lte:0
        "negative or non-empty str: `d of a dictionary` 77 is not lte 0");
    equal(f({a:-1,b:'a',c:0,d:-77}, '', { begin:'negative or non-empty str',
        lte:0, min:1, pass:true, types:['number','string'] }),
        false);
    equal(f({a:-1,b:'',c:0,d:77}, '', { begin:'negative or non-empty str',
        lte:0, min:1, pass:false, types:['number','string'] }), // pass is false
        false);

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f({a:{b:{c:{}}}}, 'deeply-nested', { begin:'Dictionary Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f('{a:{b:{c:{}}}}', 'deeply-nested', { begin:'Dictionary Test', foo:'bar' }),
        "Dictionary Test: `deeply-nested` is type 'string' not 'object'");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(new Date(), undefined, { begin:77 }),
        false);
    // @ts-expect-error
    equal(f(Date, undefined, { begin:77 }),
        "77: A value is type 'function' not 'object'");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(new ArrayBuffer(8), undefined, { type:100 }),
        false);
    // @ts-expect-error
    equal(f(Symbol(99), undefined, { type:100 }),
        "A value is type 'symbol' not 'object'");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f({ key:'val' }, 'null', { type:'number' }),
        false);
    equal(f(NaN, 'not a number', { type:'number' }), // no mention of the special `NaN` value
        "`not a number` is type 'number' not 'object'");
}
