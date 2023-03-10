import {
    IS_AN_ARRAY,
    IS_NULL,
    IS_TYPE,
    NOT,
    STRING,
} from './constants.js';
import {
    buildResultPrefix,
    isArray,
    isRecognisedType,
    quote,
    sanitise
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a value using JavaScript's native `typeof`.
 *
 * If the `typeof` the first argument passed to `aintaType()` ain't
 * `option.type`, it returns a short explanation of what went wrong. Otherwise
 * it returns `false`.
 *
 * Due to the way `typeof` works, these are all valid, so return `false`:
 * - `aintaType(null, { type:'object' })`
 * - `aintaType([99], { type:'object' })`
 * - `aintaType(NaN, { type:'number' })`
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
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaType(
    value,
    identifier,
    options = emptyOptions,
) {
    // Process the happy path as quickly as possible.
    const type = typeof value;
    if (type === options.type) return false;

    // Build the first part of an explanation.
    const prefix = buildResultPrefix(options.begin, identifier);

    // If `options.type` is invalid, produce a helpful result.
    const badOptionsType = prefix + 'cannot be validated, `options.type` ';
    const notType = NOT + 'type ';
    const qs = quote(STRING);
    if (options.type === void 0)
        return `${badOptionsType}is${NOT}set`;
    if (options.type === null)
        return badOptionsType + IS_NULL + notType + qs;
    if (isArray(options.type))
        return badOptionsType + IS_AN_ARRAY + notType + qs;
    if (typeof options.type !== STRING)
        return badOptionsType + IS_TYPE + quote(typeof options.type) + NOT + qs;
    if (!isRecognisedType(options.type))
        return badOptionsType + quote(sanitise(options.type)) + NOT + 'known';

    // Otherwise, generate an explanation of what went wrong.
    return prefix + (
        value === null
            ? IS_NULL + notType
            : isArray(value)
                ? IS_AN_ARRAY + notType
                : IS_TYPE + quote(type) + NOT
        ) + quote(options.type)
    ;
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
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Undefined `options.type` produces a helpful result.
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
    equal(f(null, 'noway', { begin:'noType', type:void 0 }),
        "noType: `noway` cannot be validated, `options.type` is not set");

    // Invalid `options.type` produces a helpful result.
    equal(f(0.5, 'half', { type:null }),
        "`half` cannot be validated, `options.type` is null not type 'string'");
    // @ts-expect-error
    equal(f(undefined, '-', { type:[] }),
        "`-` cannot be validated, `options.type` is an array not type 'string'");
    // @ts-expect-error
    equal(f(false, 'X', { type:{} }),
        "`X` cannot be validated, `options.type` is type 'object' not 'string'");
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
        "`o` cannot be validated, `options.type` '%5Cpotentially%5C$%22insecu...o%20long'%60' not known");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(String(1), 'String(1)', { foo:'bar', type:'string' }),
        false);
    // @ts-expect-error
    equal(f(null, 'NULL', { type:'boolean', zub:123 }),
        "`NULL` is null not type 'boolean'");

    // options.type is 'bigint'.
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

    // options.type is 'boolean'.
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

    // options.type is 'function'.
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

    // options.type is 'number'.
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

    // options.type is 'object'.
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

    // options.type is 'string'.
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

    // options.type is 'symbol'.
    equal(f(Symbol(55), 'fiftyFive', { begin:'Symbol Test', type:'symbol' }),
        false);
    equal(f(null, 'NULL', { begin:'Symbol Test', type:'symbol' }),
        "Symbol Test: `NULL` is null not type 'symbol'");
    equal(f(Array(2), '`Array(2)`', { begin:'Symbol Test', type:'symbol' }),
        "Symbol Test: ``Array(2)`` is an array not type 'symbol'");
    equal(f({}.nope, undefined, { type:'symbol' }),
        "A value is type 'undefined' not 'symbol'");

    // options.type is 'undefined'.
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
}
