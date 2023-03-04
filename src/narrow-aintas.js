import emptyOptions from './options.js';

/** Any one of @0bdx/ainta's validation functions.
 * @typedef {function(any, string?, import('./options').Options?):string|false} Ainta */

/**
 * ### Narrows multiple validation functions, and aggregates their results.
 *
 * @example
 *     import narrowAintas, { aintaInteger } from '@0bdx/ainta';
 *
 *     function bothInts(a, b) {
 *         const [ results, naInteger ] = narrowAintas(
 *             { begin:'bothInts()', gte:0 }, aintaInteger);
 *         naInteger(a, 'a', { lte:1000 });
 *         naInteger(b, 'b', { lte:50 });
 *         if (results.length) return results;
 *         return "a and b are both integers, and both in range!";
 *     }
 *
 *     bothInts(1, 99);
 *     // [ "bothInts(): `b` is 99 which is greater than 50" ]
 *
 *     bothInts(0.25);
 *     // [ "bothInts(): `a` is 0.25 not an integer",
 *     //   "bothInts(): `b` is type 'undefined' not 'number'" ]
 *
 *     bothInts(12, 3);
 *     // "a and b are both integers, and both in range!"
 *
 * @param {import('./options').Options} [options={}]
 *    Optional plain object containing optional configuration (default is `{}`)
 * @param {...Ainta} aintas
 *    Any number of functions, to apply `options` to.
 * @returns {[string[], ...Ainta[]]}
 *    The first item of the returned array is `results`. The remaining items
 *    are the passed-in functions, with `options` applied to them.
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
        ...aintas.map(ainta => narrowAinta(options, ainta, results)),
    ];
}

/**
 * ### Narrows a single validation function.
 *
 * @param {import('./options').Options} options
 *    Optional plain object containing optional configuration (default is `{}`)
 * @param {Ainta} ainta
 *    A function to apply `options` to.
 * @param {string[]} results
 *    Stores a message for each invalid value that the function finds.
 *    Note that this array may be shared with other `BoundBadCheck` functions.
 * @return {Ainta}
 *    A new validation function, which has been narrowed and is ready to use.
 */
const narrowAinta = (options, ainta, results) =>
    (value, identifier, overrideOptions) => {
        const result =
            ainta(value, identifier, { ...options, ...overrideOptions });
        if (result) results.push(result);
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
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    /** @type Ainta */
    const aintaMock1 = (_value, _identifier, _options) => false;

    /** @type Ainta */
    const aintaMock2 = (value, identifier, options) =>
        `${options.begin}: \`${identifier}\` '${value}' ${options.type}`;

    // The narrowAintas() options object is empty.
    {
        const [ results, naMock1, naMock2 ] = f({}, aintaMock1, aintaMock2);
        equal(JSON.stringify(results), '[]');
        const result1 = naMock1('VALUE_1', 'IDT_1', { begin:'BEGIN_1', type:'number' });
        equal(result1, false);
        equal(JSON.stringify(results), '[]');
        const result2 = naMock2('VALUE_2', 'IDT_2', { begin:'BEGIN_2', type:'bigint' });
        equal(result2, "BEGIN_2: `IDT_2` 'VALUE_2' bigint");
        equal(JSON.stringify(results), '["BEGIN_2: `IDT_2` \'VALUE_2\' bigint"]');
    }

    // The narrowAintas() options object uses `begin` and `type`.
    {
        const [ results, naMock1, naMock2 ] =
            f({ begin:'BEGIN', type:'string' }, aintaMock1, aintaMock2);
        equal(JSON.stringify(results), '[]');
        const result1 = naMock1('VALUE_1', 'IDT_1', {});
        equal(result1, false);
        equal(JSON.stringify(results), '[]');
        const result2 = naMock2('VALUE_2', 'IDT_2', {});
        equal(result2, "BEGIN: `IDT_2` 'VALUE_2' string");
        equal(JSON.stringify(results), '["BEGIN: `IDT_2` \'VALUE_2\' string"]');
        const result3 = naMock2('VALUE_3', 'IDT_3', { begin:'BEGIN_3' });
        equal(result3, "BEGIN_3: `IDT_3` 'VALUE_3' string");
        equal(JSON.stringify(results),
            '["BEGIN: `IDT_2` \'VALUE_2\' string",' +
            '"BEGIN_3: `IDT_3` \'VALUE_3\' string"]'
        );
        const result4 = naMock2('VALUE_4', 'IDT_4', { type:'boolean' });
        equal(result4, "BEGIN: `IDT_4` 'VALUE_4' boolean");
        equal(JSON.stringify(results),
            '["BEGIN: `IDT_2` \'VALUE_2\' string",' +
            '"BEGIN_3: `IDT_3` \'VALUE_3\' string",' +
            '"BEGIN: `IDT_4` \'VALUE_4\' boolean"]'
        );
    }
}
