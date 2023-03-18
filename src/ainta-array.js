import {
    _IS_NOT_,
    _NOT_,
    _NOT_AN_ARRAY,
    CANNOT_OPTIONS,
    FUNCTION,
    IS_NULL,
    IS_TYPE_,
    LEAST,
    MAX,
    MIN,
    MOST,
    PASS,
    TYPES,
} from './constants.js';
import {
    buildResultPrefix,
    isArray,
    quote,
    validateArrayOfStringsOption,
    validateBooleanOption,
    validateNumericOption,
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates a value using JavaScript's native `Array.isArray()`.
 *
 * If the first argument passed to `aintaArray()` ain't an array, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the array fails any of the following conditions, it also returns an
 * explanation of what went wrong:
 * - `options.least` - if set, there must be at least this number of items
 * - `options.most` - if set, there must not be more than this number of items
 * - `options.pass` - if set, each item is validated more deeply using `options`
 * - `options.types` - if set, all items must be one of these types
 * 
 * Otherwise, `aintaArray()` returns `false`.
 * 
 * @example
 * import { aintaArray } from '@0bdx/ainta';
 * 
 * aintaArray([1, 2, 3]);
 * // false
 *
 * aintaArray({});
 * // "A value is type 'object' not an array"
 *
 * aintaArray(null, 'list', { begin:'processList()' });
 * // "processList(): `list` is null not an array"
 *
 * aintaArray([1, true, 'ok'], 'num_or_str', { types:['number','string'] });
 * // "`num_or_str[1]` is type 'boolean' not 'number:string'"
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
export default function aintaArray(
    value,
    identifier,
    options = emptyOptions,
) {
    // Check that `value` is an array. If not, bail out right away.
    if (!isArray(value))
        return buildResultPrefix(options.begin, identifier) + (
            value === null
                ? IS_NULL
                : IS_TYPE_ + quote(typeof value)
        ) + _NOT_AN_ARRAY;

    // If `options.least`, `.most`, `.pass` or `.types` are invalid, return a
    // helpful result. Note that setting these to `undefined` may be useful in
    // some cases, so that `{ most:undefined }` acts the same way as `{}`, which
    // is why we use `options.most !== undefined` instead of `"most" in options`.
    const optionsLeast = options.least;
    const hasLeast = optionsLeast !== void 0;
    const optionsMost = options.most;
    const hasMost = optionsMost !== void 0;
    const optionsPass = options.pass;
    const hasPass = optionsPass !== void 0;
    const optionsTypes = options.types;
    const hasTypes = optionsTypes !== void 0;
    const result =
        validateNumericOption(LEAST, optionsLeast, hasLeast, false, true)
     || validateNumericOption(MOST, optionsMost, hasMost, false, true)
     || validateBooleanOption(PASS, optionsPass, hasPass)
     || validateArrayOfStringsOption(TYPES, optionsTypes, hasTypes, true)

    // If `options.least` and `options.most` are both being used, but `least` is
    // more than `most`, return a helpful result.
    || (hasLeast && hasMost && optionsLeast > optionsMost
        ? CANNOT_OPTIONS + 'least` > `options.most`'

        // Check that the length is not less than `options.least`, if set.
        : hasLeast && optionsLeast > value.length
            ? ' has length ' + value.length + ' > `options.' + LEAST + '` ' + optionsLeast

            // Check that the length is not more than `options.most`, if set.
            : hasMost && optionsMost < value.length
                ? ' has length ' + value.length + ' > `options.' + MOST + '` ' + optionsMost
                : ''
    );

    return result
        ? buildResultPrefix(options.begin, identifier, 'an array') + result
        : false;
}

/**
 * aintaArray() unit tests.
 * 
 * @param {aintaArray} f
 *    The `aintaArray()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaArrayTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    // Typical usage without `options.least`, `.most`, `.pass` or `.types`.
    equal(f([]),
        false);
    equal(f([1, 2, 3], void 0, { begin:'Array Test' }),
        false);
    equal(f(Array(3), '3 empty slots', {}),
        false);
    equal(f('a|b|c'.split('|'), 'list', { begin:'Array Test' }),
        false);
    equal(f(),
        "A value is type 'undefined' not an array");
    equal(f(null, 'list', { begin:'Array Test' }),
        "Array Test: `list` is null not an array");
    equal(f(void 0, null, { begin:'Array Test' }),
        "Array Test: A value is type 'undefined' not an array");
    equal(f({ length:1, push(){}, pop(){} }, 'pseudo-array'),
        "`pseudo-array` is type 'object' not an array");
    equal(f(123, void 0, { type:'number' }),
        "A value is type 'number' not an array");

    // Typical `options.least` usage.
    equal(f([1,2], null, { least:3 }),
        "an array has length 2 > `options.least` 3");
    equal(f([1,2,3], null, { least:3 }),
        false);
    equal(f([], 'empty_array,', { least:0 }),
        false);

    // Extra `options` values cause TS errors, but do not prevent normal use.
    // @ts-expect-error
    equal(f([[[[]]]], 'deeply-nested', { begin:'Array Test', foo:'bar' }),
        false);
    // @ts-expect-error
    equal(f('[[[[]]]]', 'deeply-nested', { begin:'Array Test', foo:'bar' }),
        "Array Test: `deeply-nested` is type 'string' not an array");

    // Invalid `options.begin` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(Array(0), undefined, { begin:77 }),
        false);
    // @ts-expect-error
    equal(f(Array.constructor, undefined, { begin:77 }),
        "77: A value is type 'function' not an array");

    // Invalid `options.gte` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f(''.split(','), null, { gte:[] }),
        false);
    // @ts-expect-error
    equal(f(/123/, null, { gte:[] }),
        "A value is type 'object' not an array");

    // Invalid `options.type` is a TS error, but does not prevent normal use.
    // @ts-expect-error
    equal(f([], undefined, { type:100 }),
        false);
    // @ts-expect-error
    equal(f(new ArrayBuffer(8), undefined, { type:100 }),
        "A value is type 'object' not an array");

    // In fact, `options.type` is ignored, even if it's a valid type.
    equal(f(new Array(3), 'null', { type:'number' }),
        false);
    equal(f(NaN, 'not a number', { type:'number' }), // no mention of the special `NaN` value
        "`not a number` is type 'number' not an array");
}
