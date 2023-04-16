import aintaType from './ainta-type.js';
import { BOOLEAN, IS, _IS_NOT_IN_ } from './constants.js';
import { buildResultPrefix, saq, validateArrayOption } from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a boolean.
 *
 * If the first argument passed to `aintaBoolean()` ain't a boolean, it returns
 * a short explanation of what went wrong.
 * 
 * Else, if the first argument fails the following condition, it also returns
 * an explanation of what went wrong:
 * - `options.is` - if set, this is an array that may contain `true` or `false`
 * 
 * Otherwise, `aintaBoolean()` returns `false`.
 *
 * @example
 * import { aintaBoolean } from '@0bdx/ainta';
 * 
 * aintaBoolean(true);
 * // false
 *
 * aintaBoolean(1234);
 * // "A value is type 'number' not 'boolean'"
 *
 * aintaBoolean(null, 'isDone', { begin:'doThings()' });
 * // "doThings(): `isDone` is null not type 'boolean'"
 *
 * aintaBoolean(false. 'shouldBeAffirmative', { is:[ true ] });
 * // "`shouldBeAffirmative` false is not in 'true'"
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
export default function aintaBoolean(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `typeof value` is 'boolean'.
    // If not, bail out right away.
    let result = aintaType(value, identifier, { ...options, type:BOOLEAN });
    if (result) return result;

    // If `options.is` is invalid, return a helpful result. Note that setting
    // this to `undefined` may be useful in some cases, so that
    // `{ is:undefined }` acts the same way as `{}`, which is why we use
    // `options.is !== void 0` instead of `"is" in options`.
    const optionsIs = options.is;
    const hasIs = optionsIs !== void 0;
    result =
        validateArrayOption(IS, optionsIs, hasIs, [BOOLEAN])

    // Check that `value` exists in the `options.is` array, if set.
     || (hasIs && optionsIs.indexOf(value) == -1
        ? value + _IS_NOT_IN_ + saq(optionsIs.join(':'))
        : ''
    );

    return result
        ? buildResultPrefix(options.begin, identifier) + result
        : false;
}

/**
 * aintaBoolean() unit tests.
 * 
 * @param {aintaBoolean} f
 *    The `aintaBoolean()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaBooleanTest(f) {
    const e2l = e => (e.stack.split('\n')[2].match(/([^\/]+\.js:\d+):\d+\)?$/)||[])[1];
    const equal = (actual, expected) => { if (actual === expected) return;
        try { throw Error() } catch(err) { throw Error(`actual:\n${actual}\n` +
            `!== expected:\n${expected}\n...at ${e2l(err)}\n`) } };

    // Invalid `options.is` produces a helpful result.
    equal(f(true, 'one', { begin:'Is', is:null }),
        "Is: `one` cannot be validated, `options.is` is null not an array");
    // @ts-expect-error
    equal(f(false, undefined, { is:'nope' }),
        "A value cannot be validated, `options.is` is type 'string' not an array");
    equal(f(false, 'three', { is:[] }),
        "`three` cannot be validated, `options.is` is empty");
    equal(f(true, 'four', { is:['true',"strings don't count"] }),
        "`four` cannot be validated, `options.is` contains nothing of type 'boolean'");
    equal(f(false, 'five', { is:[123,0b100] }),
        "`five` cannot be validated, `options.is` contains nothing of type 'boolean'");

    // Typical usage.
    equal(f(true),
        false);
    equal(f(true, null, { begin:'Boolean Test' }),
        false);
    equal(f(false, 'flag', {}),
        false);
    equal(f(Boolean(0), 'Boolean(0)', { begin:'Boolean Test' }),
        false);
    equal(f(123),
        "A value is type 'number' not 'boolean'");
    equal(f(null, 'should_be_bool', { begin:'Boolean Test' }),
        "Boolean Test: `should_be_bool` is null not type 'boolean'");
    equal(f(void 0, null, { begin:'Boolean Test' }),
        "Boolean Test: A value is type 'undefined' not 'boolean'");
    equal(f([], 'arr'),
        "`arr` is an array not type 'boolean'");
    equal(f('true', void 0, { type:'boolean' }),
        "A value is type 'string' not 'boolean'");

    // Typical `options.is` usage.
    equal(f(true, null, { is:[3,'false',true] }),
        false);
    equal(f(false, null, { is:[3,'false',true] }),
        "A value false is not in '3:false:true'"); // @TODO it's unclear what the problem really is - improve readability
    equal(f(false, 'negatory', { is:[false] }),
        false);
    equal(f(false, 'negatory', { is:[true,'false'] }),
        "`negatory` false is not in 'true:false'"); // @TODO it's unclear what the problem really is - improve readability
    equal(f(true, 'repeat values', { begin:'Boolean Test', is:[true,true] }),
        false);
    equal(f(false, 'repeat values', { begin:'Boolean Test', is:[true,true] }),
        "Boolean Test: `repeat values` false is not in 'true:true'");
    equal(f(true, null, { begin:'neverFails()', is:[true,false]}),
        false);
    equal(f(false, null, { begin:'neverFails()', is:[true,false]}),
        false);
    equal(f(true, 'too many items to log', { is:Array(10).fill(0).map(_=>false) }),
        "`too many items to log` true is not in 'false:false:false:fal...se:false'");

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f(Boolean(1), 'Boolean(1)', { begin:'Boolean Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f(BigInt(1), 'BigInt(1)', { begin:'Boolean Test', foo:'bar' }),
        "Boolean Test: `BigInt(1)` is type 'bigint' not 'boolean'");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(true, 'yes', { begin:['a','b','c'] }),
        false);
    // @ts-expect-error
    equal(f(NaN, 'num', { begin:['a','b','c'] }),
        "a,b,c: `num` is type 'number' not 'boolean'");

    // Invalid `options.lte` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(!0, 'lte test', { lte:false }),
        false);
    // @ts-expect-error
    equal(f(/123/.test, 'lte test', { lte:false }),
        "`lte test` is type 'function' not 'boolean'");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(false, 'no', { type:String }),
        false);
    // @ts-expect-error
    equal(f([], 'obj', { type:String }),
        "`obj` is an array not type 'boolean'");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(Boolean(0), 'Boolean(0)', { type:'number' }),
        false);
    equal(f(99.999, 'Nearly one hundred', { type:'number' }),
        "`Nearly one hundred` is type 'number' not 'boolean'");
}
