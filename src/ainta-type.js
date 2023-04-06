import {
    _NOT_,
    _NOT_TYPE_,
    _OF_,
    AN_ARRAY,
    CANNOT_OPTIONS,
    IS_AN_ARRAY,
    IS_NOT_,
    IS_NOT_AN_ARRAY,
    IS_NULL,
    IS_TYPE_,
    STRING,
    TYPE,
} from './constants.js';
import {
    buildResultPrefix,
    isArray,
    isRecognisedType,
    QS,
    quote,
    sanitise,
    validateArrayOfStringsOption
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a value using JavaScript's native `typeof`.
 *
 * If the `typeof` the first argument passed to `aintaType()` ain't
 * `option.type`, it returns a short explanation of what went wrong. Otherwise
 * it returns `false`.
 *
 * Due to the way `typeof` works, these cases are all valid, so return `false`:
 * - `aintaType(null, { type:'object' })`
 * - `aintaType([99], { type:'object' })`
 * - `aintaType(NaN, { type:'number' })`
 * 
 * To avoid returning `false` in these cases, use these functions instead:
 * - `aintaObject(null)`
 * - `aintaObject([99])`
 * - `aintaNumber(NaN)`
 *
 * @example
 * import { aintaType } from '@0bdx/ainta';
 * 
 * aintaType(0.5, 'half', { type:'number' });
 * // false
 *
 * aintaType(n => n / 2, 'half', { type:'number' });
 * // "`half` is type 'function' not 'number'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if `options.type` is invalid.
 */
export default function aintaType(
    value,
    identifier,
    options = emptyOptions,
) {
    const optionsType = options.type;

    // Process the basic happy path as quickly as possible, where `options.type`
    // is a string.
    const type = typeof value;
    if (type === optionsType) return false;

    // Build the first part of an explanation.
    const prefix = buildResultPrefix(options.begin, identifier);

    // If `options.type` is missing or invalid, return a helpful result.
    const optionsTypeExists = TYPE in options;
    const optionsTypeIsArray = optionsTypeExists && isArray(optionsType);
    if (optionsTypeExists && optionsTypeIsArray) {
        const result = validateArrayOfStringsOption(TYPE, optionsType, true, true);
        if (result) return prefix + result;
    } else {
        const result = !optionsTypeExists
            ? IS_NOT_ + 'set'
            : optionsType === null
                ? IS_NULL + _NOT_TYPE_ + QS
                : typeof optionsType !== STRING
                    ? IS_TYPE_ + quote(typeof optionsType) + _NOT_ + QS
                    : !isRecognisedType(optionsType)
                        ? quote(sanitise(optionsType)) + _NOT_ + 'known'
                        : '';
        if (result) return prefix + CANNOT_OPTIONS + TYPE + '` ' + result;
    }

    // If `options.type` is a string, generate an explanation of what went wrong.
    if (!optionsTypeIsArray)
        return prefix + (
            value === null
                ? IS_NULL + _NOT_TYPE_
                : isArray(value)
                    ? IS_AN_ARRAY + _NOT_TYPE_
                    : IS_TYPE_ + quote(type) + _NOT_
            ) + quote(optionsType);

    // `options.type` is an array, so `value` should also be an array.
    if (!isArray(value)) return prefix + IS_NOT_AN_ARRAY;

    // In the special case where `options.type` is an empty array, `value` is
    // allowed to contain any type of items. Equally, if `value` is an empty
    // array, it cannot contain any invalid items.
    const optionsTypeLength = optionsType.length;
    const valueLength = value.length;
    if (!optionsTypeLength) return false;

    // Validate `value` against the `options.type` array.
    for (let i=0; i<valueLength; i++) {
        const item = value[i];
        let valid = false;
        for (let j=0; j<optionsTypeLength; j++) {
            if (typeof item === optionsType[j]) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            const SQI = '[' + i + ']';
            return buildResultPrefix(
                options.begin,
                identifier && identifier + SQI,
                '`' + SQI + _OF_ + AN_ARRAY + '` '
            ) + (
                item === null
                    ? IS_NULL + _NOT_TYPE_
                    : isArray(item)
                        ? IS_AN_ARRAY + _NOT_TYPE_
                        : IS_TYPE_ + quote(typeof item) + _NOT_
                ) + quote(optionsType.join(':'));
        }
    }

    return false;
}

/**
 * aintaType() unit tests.
 * 
 * @param {aintaType} f
 *    The `aintaType()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaTypeTest(f) {
    const e2l = e => e.stack.split('\n')[2].match(/([^\/]+\.js:\d+):\d+\)?$/)[1];
    const equal = (actual, expected) => { if (actual === expected) return;
        try { throw Error() } catch(err) { throw Error(`actual:\n${actual}\n` +
            `!== expected:\n${expected}\n...at ${e2l(err)}\n`) } };

    // Produces a helpful result when `options.type` is not set.
    equal(f(),
        "A value cannot be validated, `options.type` is not set");
    equal(f(123),
        "A value cannot be validated, `options.type` is not set");
    equal(f(true, ''),
        "A value cannot be validated, `options.type` is not set");
    equal(f({}, 'noWay'),
        "`noWay` cannot be validated, `options.type` is not set");
    equal(f('str', '', { begin:'noType' }),
        "noType: A value cannot be validated, `options.type` is not set");

    // If `options.type` is not an array, and invalid, it produces a helpful result.
    equal(f(null, 'v', { type:void 0 }),
        "`v` cannot be validated, `options.type` is type 'undefined' not 'string'");
    equal(f(0.5, 'half', { type:null }),
        "`half` cannot be validated, `options.type` is null not type 'string'");
    // @ts-expect-error
    equal(f(undefined, '-', { type:{} }),
        "`-` cannot be validated, `options.type` is type 'object' not 'string'");
    // @ts-expect-error
    equal(f(false, 'X', { type:NaN }), // no mention of the special `NaN` value
        "`X` cannot be validated, `options.type` is type 'number' not 'string'");
    // @ts-expect-error
    equal(f(0.25, null, { begin:'bad()', type:'nope' }),
        "bad(): A value cannot be validated, `options.type` 'nope' not known");
    // @ts-expect-error
    equal(f([], 'arr', { type:'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890' }),
        "`arr` cannot be validated, `options.type` 'ABCDEFGHIJKLMNOPQRSTU...34567890' not known");
    // @ts-expect-error
    equal(f(null, '/', { type:'<potentially>${insecure}' }),
        "`/` cannot be validated, `options.type` '%3Cpotentially%3E$%7Binsecure%7D' not known");
    // @ts-expect-error
    equal(f({}, 'o', { type:'\\potentially\\$"insecure";and also `\'too long\'`' }),
        "`o` cannot be validated, `options.type` '%5Cpotentially%5C$%22insecu...o long'%60' not known");

    // If `options.type` is an array, and invalid, it produces a helpful result.
    equal(f(null, 'v', { type:[void 0] }),
        "`v` cannot be validated, `options.type[0]` is type 'undefined' not 'string'");
    equal(f(0.5, 'half', { type:['number',null] }),
        "`half` cannot be validated, `options.type[1]` is null not type 'string'");
    // @ts-expect-error
    equal(f(undefined, '-', { type:['boolean','boolean',{},'nope'] }), // @TODO maybe duplicates are invalid?
        "`-` cannot be validated, `options.type[2]` is type 'object' not 'string'");
    // @ts-expect-error
    equal(f(false, 'X', { type:[NaN] }), // no mention of the special `NaN` value
        "`X` cannot be validated, `options.type[0]` is type 'number' not 'string'");
    // @ts-expect-error
    equal(f(0.25, null, { begin:'bad()', type:[''] }),
        "bad(): A value cannot be validated, `options.type[0]` '' not known");
    // @ts-expect-error
    equal(f([], 'arr', { type:['ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'] }),
        "`arr` cannot be validated, `options.type[0]` 'ABCDEFGHIJKLMNOPQRSTU...34567890' not known");
    // @ts-expect-error
    equal(f(null, '/', { type:['<potentially>${insecure}'] }),
        "`/` cannot be validated, `options.type[0]` '%3Cpotentially%3E$%7Binsecure%7D' not known");
    // @ts-expect-error
    equal(f({}, 'o', { type:['\\potentially\\$"insecure";and also `\'too long\'`'] }),
        "`o` cannot be validated, `options.type[0]` '%5Cpotentially%5C$%22insecu...o long'%60' not known");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(String(1), 'String(1)', { foo:'bar', type:'string' }),
        false);
    // @ts-expect-error
    equal(f(null, 'NULL', { type:'boolean', zub:123 }),
        "`NULL` is null not type 'boolean'");

    // `options.type` is [].
    equal(f([], 'empty', { type:[] }),
        false);
    equal(f([BigInt(0),true,_=>_,NaN,1,{},[],null,'','a',Symbol(1),,void 0], 'kitchen sink', { type:[] }),
        false);

    // `options.type` is 'bigint'.
    equal(f(BigInt(123), 'hugeNum', { begin:'BigInt Test', type:'bigint' }),
        false);
    equal(f(null, 'NULL', { begin:'BigInt Test', type:'bigint' }),
        "BigInt Test: `NULL` is null not type 'bigint'");
    equal(f([[0,1],[1,0]], 'matrix', { type:'bigint' }),
        "`matrix` is an array not type 'bigint'");
    equal(f(123, '', { begin:'BigInt Test', type:'bigint' }),
        "BigInt Test: A value is type 'number' not 'bigint'");
    equal(f(BigInt, void 0, { type:'bigint' }),
        "A value is type 'function' not 'bigint'");

    // `options.type` is ['bigint'].
    equal(f([], 'empty', { type:['bigint'] }),
        false);
    equal(f([BigInt(0),BigInt(1)], 'hugeNum', { type:['bigint'] }),
        false);
    equal(f(null, 'NULL', { begin:'BigInt Array Test', type:['bigint'] }),
        "BigInt Array Test: `NULL` is not an array");
    equal(f([null], 'NULL', { begin:'BigInt Array Test', type:['bigint'] }),
        "BigInt Array Test: `NULL[0]` is null not type 'bigint'");
    equal(f([[0,1],[1,0]], 'matrix', { type:['bigint'] }),
        "`matrix[0]` is an array not type 'bigint'");
    equal(f([BigInt(123),456], '', { begin:'BigInt Array Test', type:['bigint'] }),
        "BigInt Array Test: `[1] of an array` is type 'number' not 'bigint'");
    equal(f([BigInt(123),BigInt(456),BigInt,BigInt(789)], void 0, { type:['bigint'] }),
        "`[2] of an array` is type 'function' not 'bigint'");
    equal(f([,BigInt(123)], 'empty slot', { type:['bigint'] }),
        "`empty slot[0]` is type 'undefined' not 'bigint'");

    // `options.type` is ['bigint','undefined'].
    equal(f([], 'empty', { type:['bigint','undefined'] }),
        false);
    equal(f([void 0,undefined], '2 undefined', { type:['bigint','undefined'] }),
        false);
    equal(f(Array(3), '3 empty slots', { type:['bigint','undefined'] }),
        false);
    equal(f([BigInt(0),BigInt(1)], '2 bigints', { type:['bigint','undefined'] }),
        false);
    equal(f([,BigInt(0),void 0,,BigInt(1),undefined], 'mix', { type:['bigint','undefined'] }),
        false);
    equal(f([void 0,33,undefined], '', { type:['bigint','undefined'] }),
        "`[1] of an array` is type 'number' not 'bigint:undefined'");
    equal(f([BigInt(0),BigInt(1),null], '2 bigints and null', { begin:'OK', type:['bigint','undefined'] }),
        "OK: `2 bigints and null[2]` is null not type 'bigint:undefined'");
    equal(f([,BigInt(0),void 0,,BigInt(1),[],undefined], void 0, { begin:'Mix', type:['bigint','undefined'] }),
        "Mix: `[5] of an array` is an array not type 'bigint:undefined'");

    // `options.type` is 'boolean'.
    equal(f(true, null, { begin:'Boolean Test', type:'boolean' }),
        false);
    equal(f(false, 'flag', { type:'boolean' }),
        false);
    equal(f(Boolean(1), 'Boolean(1)', { begin:'Boolean Test', type:'boolean' }),
        false);
    equal(f(null, 'nullish', { begin:'Boolean Test', type:'boolean' }),
        "Boolean Test: `nullish` is null not type 'boolean'");
    equal(f(void 0, null, { begin:'Boolean Test', type:'boolean' }),
        "Boolean Test: A value is type 'undefined' not 'boolean'");
    equal(f([], 'arr', { type:'boolean' }),
        "`arr` is an array not type 'boolean'");
    equal(f('true', void 0, { type:'boolean' }),
        "A value is type 'string' not 'boolean'");

    // `options.type` is 'function'.
    equal(f(()=>{}, 'noop', { begin:'Function Test', type:'function' }),
        false);
    equal(f(parseInt, void 0, { begin:'Function Test', type:'function' }),
        false);
    equal(f(Function, 'Function', { begin:'Function Test', type:'function' }),
        false);
    equal(f(Function("a","return a+1"), 'constructor', { type:'function' }),
        false);
    equal(f(class A {}, 'class A {}', { type:'function' }),
        false);
    equal(f((()=>null)(), '', { begin:'Function Test', type:'function' }),
        "Function Test: A value is null not type 'function'");
    equal(f([()=>0,()=>1], 'list-of-fns', { type:'function' }),
        "`list-of-fns` is an array not type 'function'");
    equal(f(JSON, 'JSON', { begin:'Function Test', type:'function' }),
        "Function Test: `JSON` is type 'object' not 'function'");

    // `options.type` is 'number'.
    equal(f(99, 'red balloons', { begin:'Number Test', type:'number' }),
        false);
    equal(f(NaN, 'NaN', { type:'number' }),
        false);
    equal(f(-Infinity, 'minusInfinity', { begin:'Number Test', type:'number' }),
        false);
    equal(f(function (n) { return n / 2 }, 'half', { type:'number' }),
        "`half` is type 'function' not 'number'");
    equal(f(n => n / 2, 'half', { begin:'arrow fn', type:'number' }),
        "arrow fn: `half` is type 'function' not 'number'");
    equal(f(null, undefined, { type:'number' }),
        "A value is null not type 'number'");
    equal(f([[],1,true], 'allsorts', { type:'number' }),
        "`allsorts` is an array not type 'number'");
    equal(f(BigInt(0), 'big zero', { begin:'Number Test', type:'number' }),
        "Number Test: `big zero` is type 'bigint' not 'number'");

    // `options.type` is ['bigint','number'].
    equal(f([], 'empty', { type:['bigint','number'] }),
        false);
    equal(f([NaN,-Infinity,9e9], 'three numbers', { type:['bigint','number'] }),
        false);
    equal(f([BigInt(0),BigInt(1)], 'two bigints', { type:['bigint','number'] }),
        false);
    equal(f([BigInt(0),55.55,BigInt('1'),Infinity], 'mix', { type:['bigint','number'] }),
        false);
    equal(f([33,,44,,55], '', { type:['bigint','number'] }),
        "`[1] of an array` is type 'undefined' not 'bigint:number'");
    equal(f([BigInt('1111'),null,BigInt(0)], 'two bigints and null', { begin:'OK', type:['bigint','number'] }),
        "OK: `two bigints and null[1]` is null not type 'bigint:number'");
    equal(f([1111,BigInt('0'),0b1111,BigInt(1),[],false], '', { begin:'Mix', type:['bigint','number'] }),
        "Mix: `[4] of an array` is an array not type 'bigint:number'");

    // `options.type` is ['bigint','number','undefined'].
    equal(f([], 'empty', { type:['bigint','number','undefined'] }),
        false);
    equal(f([NaN,-Infinity,9e9], 'three numbers', { type:['bigint','number','undefined'] }),
        false);
    equal(f([BigInt(0),BigInt(1)], 'two bigints', { type:['bigint','number','undefined'] }),
        false);
    equal(f([void 0,undefined], '2 undefined', { type:['bigint','number','undefined'] }),
        false);
    equal(f(Array(3), '3 empty slots', { type:['bigint','number','undefined'] }),
        false);
    equal(f([,,BigInt(0),void 0,55.55,BigInt('1'),undefined,,,,Infinity], 'mix', { type:['bigint','number','undefined'] }),
        false);
    equal(f([33,,44,,55,,'66'], '', { type:['bigint','number','undefined'] }),
        "`[6] of an array` is type 'string' not 'bigint:number:undefined'");
    equal(f([BigInt('1111'),null,BigInt(0)], 'two bigints and null', { begin:'OK', type:['bigint','number','undefined'] }),
        "OK: `two bigints and null[1]` is null not type 'bigint:number:undefined'");
    equal(f([1111,BigInt('0'),0b1111,BigInt(1),[],false], '', { begin:'Mix', type:['bigint','number','undefined'] }),
        "Mix: `[4] of an array` is an array not type 'bigint:number:undefined'");

    // `options.type` is 'object'.
    equal(f({}, 'plain', {type:'object' }),
        false);
    equal(f(null, '', { begin:'Object Test', type:'object' }),
        false);
    equal(f([[0,1],[1,0]], 'matrix', { type:'object' }),
        false);
    equal(f(arguments, 'args', { type:'object' }),
        false);
    equal(f(Symbol(1), 'sym', { begin:'Object Test', type:'object' }),
        "Object Test: `sym` is type 'symbol' not 'object'");

    // `options.type` is 'string'.
    equal(f('', 'empty', { begin:'String Test', type:'string' }),
        false);
    equal(f('foo', 'literal "foo"', { begin:'String Test', type:'string' }),
        false);
    equal(f(String(99), 'String(99)', { begin:'String Test', type:'string' }),
        false);
    equal(f(null, '', { type:'string' }),
        "A value is null not type 'string'");
    equal(f(['x','y','z'], 'letters', { begin:'String Test', type:'string' }),
        "String Test: `letters` is an array not type 'string'");
    equal(f(true, 'boolTrue', { begin:'', type:'string' }),
        "`boolTrue` is type 'boolean' not 'string'");

    // `options.type` is 'symbol'.
    equal(f(Symbol(55), 'fiftyFive', { begin:'Symbol Test', type:'symbol' }),
        false);
    equal(f(Symbol(), 'empty', { type:'symbol' }),
        false);
    equal(f(null, 'NULL', { begin:'Symbol Test', type:'symbol' }),
        "Symbol Test: `NULL` is null not type 'symbol'");
    equal(f(Array(2), '`Array(2)`', { begin:'Symbol Test', type:'symbol' }),
        "Symbol Test: ``Array(2)`` is an array not type 'symbol'");
    equal(f({}.nope, undefined, { type:'symbol' }),
        "A value is type 'undefined' not 'symbol'");

    // `options.type` is 'undefined'.
    equal(f(void 0, 'voidZero', { begin:'Undefined Test', type:'undefined' }),
        false);
    equal(f({}.nope, 'no such property', { begin:null, type:'undefined' }),
        false);
    equal(f(undefined, 'keyword', { type:'undefined' }),
        false);
    equal(f(null, 'NULL', { begin:'Undefined Test', type:'undefined' }),
        "Undefined Test: `NULL` is null not type 'undefined'");
    equal(f([], 'emptyArray', { begin:null, type:'undefined' }),
        "`emptyArray` is an array not type 'undefined'");
    // @ts-expect-error
    equal(f(Math, 0, { begin:'Undefined Test', type:'undefined' }),
        "Undefined Test: A value is type 'object' not 'undefined'");

    // `options.type` is ['boolean','function','object','string','symbol'].
    equal(f([], 'empty', { type:['boolean','function','object','string','symbol'] }),
        false);
    equal(f([false,Math.min,/abc/,'',Symbol(),[],null], 'mix', { type:['boolean','function','object','string','symbol'] }),
        false);
    equal(f([false,Math.min,/abc/,'',Symbol(),1], 'has num', { type:['boolean','function','object','string','symbol'] }),
        "`has num[5]` is type 'number' not 'boolean:function:object:string:symbol'");
    equal(f([false,Math.min,void 0], '', { begin:'Has undef', type:['boolean','function','object','string','symbol'] }),
        "Has undef: `[2] of an array` is type 'undefined' not 'boolean:function:object:string:symbol'");
    equal(f([BigInt('123')], 'has_bigint', { begin:'Lots', type:['boolean','function','object','string','symbol'] }),
        "Lots: `has_bigint[0]` is type 'bigint' not 'boolean:function:object:string:symbol'");
    equal(f([null,/a/,/b/.test,...Array(3)], '', { type:['boolean','function','object','string','symbol'] }),
        "`[3] of an array` is type 'undefined' not 'boolean:function:object:string:symbol'");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(false, 'falsey boolean', { type:'boolean', unexpectedProperty:1 }),
        false);
    // @ts-expect-error
    equal(f(null, 'other falsey', { type:'boolean', unexpectedProperty:1 }),
        "`other falsey` is null not type 'boolean'");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(Symbol('ok'), void 0, { begin:true, type:'symbol' }),
        false);
    // @ts-expect-error
    equal(f({}, void 0, { begin:true, type:'symbol' }),
        "true: A value is type 'object' not 'symbol'");

    // Invalid `options.gte` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(BigInt('4444'), null, { gte:Symbol('-'), type:'bigint' }),
        false);
    // @ts-expect-error
    equal(f(123, null, { gte:Symbol('-'), type:'bigint' }),
        "A value is type 'number' not 'bigint'");

    // Invalid `options.lte` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(!1, 'lte test', { lte:'!!!!', type:'boolean' }),
        false);
    // @ts-expect-error
    equal(f(BigInt(99), 'lte test', { lte:'!!!!', type:'boolean' }),
        "`lte test` is type 'bigint' not 'boolean'");

    // Invalid `options.mod` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(NaN, void 0, { begin:'mod test', mod:'123', type:'number' }),
        false);
    // @ts-expect-error
    equal(f(null, void 0, { begin:'mod test', mod:'123', type:'number' }),
        "mod test: A value is null not type 'number'");

    // In fact, `options.gte`, `.lte` and `.mod` are ignored, even if valid.
    equal(f(BigInt('10'), null, { gte:20, type:'bigint' }),
        false);
    equal(f(10, null, { lte:10, type:'number' }),
        false);
    equal(f(Math.PI, null, { mod:7, type:'number' }),
        false);
}
