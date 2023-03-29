import aintaType from './ainta-type.js';
import { FUNCTION } from './constants.js';
import emptyOptions from './options.js';

/**
 * ### Validates a function.
 *
 * If the first argument passed to `aintaFunction()` ain't a function, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
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
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaFunction(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `value` is a function.
    return aintaType(value, identifier, { ...options, type:FUNCTION });
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
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Typical usage.
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
