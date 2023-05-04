import { isArray } from './helpers.js';
import emptyOptions from './options.js';

/** Any one of `ainta`'s validation functions.
 * @typedef {Function} Ainta
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */

/**
 * ### Narrows any number of `ainta` functions, and aggregates their results.
 *
 * This helper:
 * 1. Narrows (applies shared options to) multiple `ainta` functions
 * 2. Aggregates the strings returned by those functions
 *
 * In the example below, `narrowAintas()` is used to narrow `aintaInteger()`
 * into `aInteger()`, and then capture its validation results:
 * - `begin:'bothNatural()'` sets a prefix, added to all explanations
 * - `gte:0` checks that the value is not negative
 * - `lte:1000` and `lte:50` specify different maximum values for each argument
 * - `if (results.length)` checks whether there were any problems
 *
 * @example
 * import narrowAintas, { aintaInteger } from '@0bdx/ainta';
 *
 * function bothNatural(a, b) {
 *     const [ results, aInteger ] = narrowAintas(
 *         { begin:'bothNatural()', gte:0 },
 *         aintaInteger
 *     );
 *     aInteger(a, 'a', { lte:1000 });
 *     aInteger(b, 'b', { lte:50 });
 *     if (results.length) return results;
 *     return "`a` and `b` are both natural numbers, in range!";
 * }
 *
 * bothNatural(-5, 0.25);
 * // [ "bothNatural(): `a` is -5 not gte 0",
 * //   "bothNatural(): `b` is 0.25 not an integer" ]
 *
 * bothNatural(99, 200);
 * // [ "bothNatural(): `b` is 200 not lte 50" ]
 *
 * bothNatural(12, 3);
 * // "`a` and `b` are both natural numbers, in range!"
 *
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @param {...(Ainta|Ainta[])} aintas
 *    Any number of `ainta` functions, to apply `options` to.
 *    - An array of `ainta` functions is treated as an 'OR' list
 * @returns {[string[], ...Ainta[]]}
 *    The first item of the returned array will contain aggregated results. The
 *    remaining items are the passed-in functions, with `options` applied.
 */
export default function narrowAintas(
    options = emptyOptions,
    ...aintas
) {
    // Create an empty array, which the passed-in functions can add messages to.
    const results = [];

    // `results` becomes the first item of the returned array. The remaining
    // items are all functions with `options` applied to them.
    return [
        results,
        ...aintas.map(ainta =>
            isArray(ainta)
                ? ainta.length === 1 // only one function in an 'OR' list
                    ? narrowSingleAinta(options, ainta[0], results)
                    : narrowOrListOfAintas(options, ainta, results)
                : narrowSingleAinta(options, ainta, results)
        ),
    ];
}

/** ### Narrows a single validation function.
 * @private
 *
 * @param {import('./options').Options} options
 *    Optional plain object containing optional configuration (default is `{}`)
 * @param {Ainta} ainta
 *    A single function to apply `options` to.
 * @param {string[]} results
 *    Stores a message for each invalid value that the function finds.
 *    Note that this array may be shared with other `BoundBadCheck` functions.
 * @return {Ainta}
 *    A new validation function, which has been narrowed and is ready to use.
 */
const narrowSingleAinta = (options, ainta, results) =>
    (value, identifier, overrideOptions) => {
        const result =
            ainta(value, identifier, { ...options, ...overrideOptions });
        if (result) results.push(result);
        return result;
    }

/** ### Narrows an 'OR' list of validation functions.
 * @private
 *
 * @param {import('./options').Options} options
 *    Optional plain object containing optional configuration (default is `{}`)
 * @param {Ainta[]} aintaList
 *    An 'OR' list of functions to apply `options` to.
 * @param {string[]} results
 *    Stores a message for each invalid value that the function finds.
 *    Note that this array may be shared with other `BoundBadCheck` functions.
 * @return {Ainta}
 *    A new validation function, which has been narrowed and is ready to use.
 */
const narrowOrListOfAintas = (options, aintaList, results) =>
    (value, identifier, overrideOptions) => {

        // Run each validator in turn. If any of them return `false`, the value
        // is valid, so return `false`. Otherwise, the value is not valid, so
        // store the result strings from every validator.
        const orResults = [];
        for (const ainta of aintaList) {
            const orResult =
                ainta(value, identifier, { ...options, ...overrideOptions });
            if (orResult)
                orResults.push(orResult);
            else
                return false; // valid, according to one of the 'OR' functions
        }

        // It's very common for all of the 'OR' results to begin with the same
        // string. To keep the final summary result succinct, find the character
        // position at which 'OR' results diverge.
        let pos = 0;
        const len = orResults.length;
        outer: while (true) {
            // Get the character at the current position of the 0th `orResult`.
            // Finish the `while` loop if this is the end of the 0th `orResult`.
            const char0 = orResults[0][pos];
            if (!char0) break outer;

            // Step through each `orResult`, but skip 0th.
            for (let i=1; i<len; i++)
                // Finish the `while` loop if this character doesn't match. That
                // could be because the end of this `orResult` has been reached.
                if (orResults[i][pos] !== char0) break outer;

            // The character at this position is the same in every `orResult`.
            pos++;
        }

        // In some common cases, the summary will read more naturally if certain
        // strings are preserved. @TODO preserve more strings
        pos = pos >= 2 && orResults[0].slice(pos-2, pos) === " '" ? pos - 2 : pos;

        // Build a condensed summary of the 'OR' results.
        const result =
            orResults[0] + // the whole of the 0th 'OR' result
            '; or ' + // delimiter
            orResults
                .slice(1) // the 1st 'OR' result onwards
                .map(r => r.slice(pos).trim()) // the non-matching characters
                .join('; or '); // delimiter

        // Record the condensed summary in the shared `results` array, and also
        // return it.
        results.push(result);
        return result;
    }

/**
 * narrowAintas() unit tests.
 * 
 * @param {narrowAintas} f
 *    The `narrowAintas()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function narrowAintasTest(f) {
    const e2l = e => e.stack.split('\n')[2].match(/([^\/]+\.js:\d+):\d+\)?$/)[1];
    const equal = (actual, expected) => { if (actual === expected) return;
        try { throw Error() } catch(err) { throw Error(`actual:\n${actual}\n` +
            `!== expected:\n${expected}\n...at ${e2l(err)}\n`) } };
    const toStr = value => JSON.stringify(value);

    /** @type Ainta */
    const alwaysValid = (_value, _identifier, _options) => false;

    /** @type Ainta */
    const alwaysInvalid = (value, identifier, options) =>
        `${options.begin}: \`${identifier}\` '${value}' ${options.type}`;

    /** @type Ainta */
    const aintaA = (value, identifier, options) =>
        value !== 'A' && `${options.begin}: \`${identifier}\` '${value}' not 'A'`;

    /** @type Ainta */
    const aintaB = (value, identifier, options) =>
        value !== 'B' && `${options.begin}: \`${identifier}\` '${value}' not 'B'`;

    /** @type Ainta */
    const aintaC = (value, identifier, options) =>
        value !== 'C' && `${options.begin}: \`${identifier}\` '${value}' not 'C'`;

    // Should work as expected if the `options` object is empty.
    {
        const [ results, aValid, aInvalid ] = f({}, alwaysValid, alwaysInvalid);
        equal(JSON.stringify(results), '[]');
        const result1 = aValid('VALUE_1', 'IDT_1', { begin:'BEGIN_1', type:'number' });
        equal(result1, false);
        equal(JSON.stringify(results), '[]');
        const result2 = aInvalid('VALUE_2', 'IDT_2', { begin:'BEGIN_2', type:'bigint' });
        equal(result2, "BEGIN_2: `IDT_2` 'VALUE_2' bigint");
        equal(JSON.stringify(results), '["BEGIN_2: `IDT_2` \'VALUE_2\' bigint"]');
    }

    // Should work as expected if the `options` object uses `begin` and `type`.
    {
        const [ results, aValid, aInvalid ] =
            f({ begin:'BEGIN', type:'string' }, alwaysValid, alwaysInvalid);
        equal(JSON.stringify(results), '[]');
        const result1 = aValid('VALUE_1', 'IDT_1', {});
        equal(result1, false);
        equal(JSON.stringify(results), '[]');
        const result2 = aInvalid('VALUE_2', 'IDT_2', {});
        equal(result2, "BEGIN: `IDT_2` 'VALUE_2' string");
        equal(JSON.stringify(results), '["BEGIN: `IDT_2` \'VALUE_2\' string"]');
        const result3 = aInvalid('VALUE_3', 'IDT_3', { begin:'BEGIN_3' });
        equal(result3, "BEGIN_3: `IDT_3` 'VALUE_3' string");
        equal(JSON.stringify(results),
            '["BEGIN: `IDT_2` \'VALUE_2\' string",' +
            '"BEGIN_3: `IDT_3` \'VALUE_3\' string"]'
        );
        const result4 = aInvalid('VALUE_4', 'IDT_4', { type:'boolean' });
        equal(result4, "BEGIN: `IDT_4` 'VALUE_4' boolean");
        equal(JSON.stringify(results),
            '["BEGIN: `IDT_2` \'VALUE_2\' string",' +
            '"BEGIN_3: `IDT_3` \'VALUE_3\' string",' +
            '"BEGIN: `IDT_4` \'VALUE_4\' boolean"]'
        );
    }

    // Should work as expected if one of the arguments is a 'OR' list of functions.
    {
        const [ results, aAorBorC ] = f({ begin:'BEGIN' }, [ aintaA, aintaB, aintaC ]);
        equal(toStr(results), '[]');
        const result1 = aAorBorC('A', 'IDT_A');
        equal(result1, false);
        equal(toStr(results), '[]');
        const result2 = aAorBorC('B', 'IDT_B');
        equal(result2, false);
        equal(toStr(results), '[]');
        const result3 = aAorBorC('C', 'IDT_C');
        equal(result3, false);
        equal(toStr(results), '[]');
        const result4 = aAorBorC('D', 'IDT_D');
        equal(result4, "BEGIN: `IDT_D` 'D' not 'A'; or 'B'; or 'C'");
        equal(toStr(results), toStr(["BEGIN: `IDT_D` 'D' not 'A'; or 'B'; or 'C'"]));
    }
}
