/**
 * https://www.npmjs.com/package/@0bdx/ainta
 * @version 0.0.2
 * @license Copyright (c) 2023 0bdx <0@0bdx.com> (0bdx.com)
 * SPDX-License-Identifier: MIT
 */
/**
 * ### Strings used by many `ainta` functions.
 * @private
 * 
 * Using constants this way helps avoid typos, and can help reduce the size of
 * minified code.
 */

/** @constant {string} ARRAY The literal string "array" */
const ARRAY = 'array';

/** @constant {string} BIGINT The literal string "bigint" */
const BIGINT = 'bigint';

/** @constant {string} BOOLEAN The literal string "boolean" */
const BOOLEAN = 'boolean';

/** @constant {string} FUNCTION The literal string "function" */
const FUNCTION = 'function';

/** @constant {string} NULL The literal string "null" */
const NULL = 'null';

/** @constant {string} NUMBER The literal string "number" */
const NUMBER = 'number';

/** @constant {string} OBJECT The literal string "object" */
const OBJECT = 'object';

/** @constant {string} STRING The literal string "string" */
const STRING = 'string';

/** @constant {string} SYMBOL The literal string "symbol" */
const SYMBOL = 'symbol';

/** @constant {string} UNDEFINED The literal string "undefined" */
const UNDEFINED = 'undefined';

/** @constant {string} ENUM The literal string "enum" */
const ENUM = 'enum';

/** @constant {string} GTE The literal string "gte" */
const GTE = 'gte';

/** @constant {string} LTE The literal string "lte" */
const LTE = 'lte';

/** @constant {string} MAX The literal string "max" */
const MAX = 'max';

/** @constant {string} MIN The literal string "min" */
const MIN = 'min';

/** @constant {string} MOD The literal string "mod" */
const MOD = 'mod';

/** @constant {string} TYPE The literal string "type" */
const TYPE = 'type';

/** @constant {string} AN_ The literal string "an " */
const AN_ = 'an ';

/** @constant {string} IS_ The literal string "is " */
const IS_ = 'is ';

/** @constant {string} _NOT_ The literal string " not " */
const _NOT_ = ' not ';

/** @constant {string} CANNOT_OPTIONS The literal string "cannot be validated, `options." */
const CANNOT_OPTIONS = 'cannot be validated, `options.';

/** @constant {string} TYPE_ The literal string "type " */
const TYPE_ = TYPE + ' ';

/** @constant {string} IS_AN_ARRAY The literal string "is an array" */
const IS_AN_ARRAY = IS_ + AN_ + ARRAY;

/** @constant {string} IS_NULL The literal string "is null" */
const IS_NULL = IS_ + NULL;

/** @constant {string} IS_NAN The literal string "is the special `NaN` value" */
const IS_NAN = IS_ + 'the special `NaN` value';

/** @constant {string} IS_TYPE_ The literal string "is type" */
const IS_TYPE_ = IS_ + TYPE_;

/** @constant {string} _IS_NOT_ The literal string " is not " */
const _IS_NOT_ = ' is' + _NOT_;

/** @constant {string} _NOT_AN_ARRAY The literal string " not an array" */
const _NOT_AN_ARRAY = _NOT_ + AN_ + ARRAY;

/** @constant {string} _NOT_TYPE_ The literal string " not type " */
const _NOT_TYPE_ = _NOT_ + TYPE_;

/**
 * ### Utilities used by many `ainta` functions.
 * @private
 * 
 * Reduces code duplication, and helps reduce the size of minified code.
 */

/**
 * ### Builds the first part of an explanation.
 * @private
 *
 * @param {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation.
 */
const buildResultPrefix = (begin, identifier) => {

    // Wrap `identifier` in backticks, to make the explanation clearer.
    // If `identifier` was not set, fall back to the default, "A value".
    const ident = identifier ? `\`${identifier}\` ` : 'A value ';

    // If `begin` was set, start the prefix with it followed by ": ".
    // Either way, finish the prefix with the normalised identifier.
    return (begin ? begin + ': ' : '') + ident;
};

/**
 * ### JavaScript's built-in `Array.isArray()`, for smaller minified files.
 * @private
 */
const isArray = Array.isArray;

/**
 * ### Recognises a `typeof` string.
 * @private
 *
 * @param {string} type
 *    One of the strings that JavaScript's `typeof` produces, eg "boolean".
 * @returns {boolean}
 *    Returns true if `type` is a recognised `typeof` string.
 */
const isRecognisedType = type => [
    BIGINT,
    BOOLEAN,
    FUNCTION,
    NUMBER,
    OBJECT,
    STRING,
    SYMBOL,
    UNDEFINED,
].indexOf(type) !== -1;

/**
 * ### Wraps a string in single-quotes.
 * @private
 *
 * @param {string} [text]
 *    Text to wrap in single quotes.
 */
const quote = text => "'" + text + "'";

/** @constant {string} QN The literal string "'number'" */
const QN = quote(NUMBER);

/** @constant {string} QF The literal string "'function'" */
const QF = quote(FUNCTION);

/** @constant {string} QO The literal string "'object'" */
const QO = quote(OBJECT);

/** @constant {string} QS The literal string "'string'" */
const QS = quote(STRING);

/**
 * ### Truncates a string to 32 characters, and then uri-encodes it.
 * @private
 *
 * @param {string} [text]
 *    Text to sanitise.
 */
const sanitise = text =>
    encodeURI(text.length <= 32 ? text
        : `${text.slice(0, 21)}...${text.slice(-8)}`).replace(/%20/g, ' ');

/**
 * ### Sanitises a string, and then wraps it in single-quotes.
 * 
 * Makes .min.js files smaller, and source code more readable.
 * 
 * @private
 *
 * @param {string} [text]
 *    Text to sanitise and quote.
 */
const saq = text => quote(sanitise(text));

/**
 * ### Validates an option which should be an array of unique strings.
 * @private
 *
 * @param {any} val
 *    The value of the option, which must be an array of strings to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 * @returns {undefined|string}
 *    Returns undefined if `val` is valid, or an explanation if not.
 */
const validateArrayOfStringsOption = (val, has) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_AN_ARRAY
            : !isArray(val)
                ? IS_TYPE_ + quote(typeof val) + _NOT_AN_ARRAY
                : !val.length
                    ? 'is empty'
                    : '';
        if (result) return CANNOT_OPTIONS + ENUM + '` ' + result;
        for (let i=0, l=val.length; i<l; i++) {
            const item = val[i];
            const result = item === null
            ? IS_NULL + _NOT_TYPE_ + QS
            : isArray(item)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QS
                : typeof item !== STRING
                    ? IS_TYPE_ + quote(typeof item) + _NOT_ + QS
                    : '';
            if (result) return CANNOT_OPTIONS + ENUM + '[' + i + ']` ' + result;
        }
    }
};

/**
 * ### Validates an option which should be a number, eg `options.gte`.
 * @private
 *
 * @param {string} key
 *    The name of the option to validate, eg "gte".
 * @param {any} val
 *    The value of the option, which must be a number to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 * @param {boolean} [notZero]
 *    An optional flag which, if set to `true`, prevents `val` from being zero.
 * @param {boolean} [notNegative]
 *    An optional flag which, if set to `true`, prevents `val` from being -ve.
 * @returns {undefined|string}
 *    Returns undefined if `val` is valid, or an explanation if not.
 */
const validateNumericOption = (key, val, has, notZero, notNegative) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_TYPE_ + QN
            : isArray(val)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QN
                : typeof val !== NUMBER
                    ? IS_TYPE_ + quote(typeof val) + _NOT_ + QN
                    : isNaN(val)
                        ? IS_NAN
                        : notZero && !val
                            ? 'is zero'
                            : notNegative && val < 0
                                ? 'is negative'
                                : '';
        if (result) return CANNOT_OPTIONS + key + '` ' + result;
    }    
};

/**
 * ### Validates an option which should be an object with a `test()` function.
 * @private
 *
 * @param {any} val
 *    The value of the option, which must be an object to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 */
const validateRxishOption = (val, has) => {
    if (has) {
        let result = val === null
            ? IS_NULL + _NOT_TYPE_ + QO
            : isArray(val)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QO
                : typeof val !== OBJECT
                    ? IS_TYPE_ + quote(typeof val) + _NOT_ + QO
                    : '';
        if (result) return CANNOT_OPTIONS + 'rx` ' + result;
        const fn = val.test;
        result = fn === null
            ? IS_NULL + _NOT_TYPE_ + QF
            : isArray(fn)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QF
                : typeof fn !== FUNCTION
                    ? IS_TYPE_ + quote(typeof fn) + _NOT_ + QF
                    : '';
        if (result) return CANNOT_OPTIONS + 'rx.test` ' + result;
    }    
};

/**
 * ### A configuration object, used by all `ainta` functions.
 * 
 * Each option is actually optional, so an empty object `{}` is perfectly valid.
 * 
 * Different options are used by different `ainta` functions. For example:
 * - `options.before` is used all the `ainta` functions
 * - `options.enum` is only used by `aintaString()` and `aintaArray()`
 * - `options.gte` is only used by `aintaNumber()`
 *
 * @typedef {Object} Options
 * @property {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @property {string[]} [enum]
 *    Optional array of strings. TODO discuss
 * @property {number} [gte]
 *    Optional minimum value. Short for 'Greater Than or Equal'.
 * @property {number} [lte]
 *    Optional maximum value. Short for 'Less Than or Equal'.
 * @property {number} [max]
 *    Optional maximum length of a string. TODO or array?
 * @property {number} [min]
 *    Optional minimum length of a string. TODO or array?
 * @property {number} [mod]
 *    Optional modulo which `value` must divide into without a remainder.
 * @property {Rxish} [rx]
 *    Optional object with a `test()` function. Typically a JavaScript `RegExp`.
 * @property {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} [type]
 *    Optional JavaScript type to expect, eg "boolean" or "undefined".
 */

/**
 * ### An object with a `test()` function. Typically a JavaScript `RegExp`.
 * 
 * @typedef {Object} Rxish
 * @property {function(string):boolean} test
 *    The test function, which takes a string and returns `true` if it passes
 *    and `false` if it fails.
 */

/**
 * ### An empty object with the `Options` type, used by all `ainta` functions.
 * 
 * Using an empty `{}` is really a way to export the `Options` type, and avoid a
 * "File '.../ainta/src/options.js' is not a module. ts(2306)" error.
 * 
 * @type Options
 */
const emptyOptions = {};

/**
 * ### Validates a value using JavaScript's native `Array.isArray()`.
 *
 * If the first argument passed to `aintaArray()` ain't an array, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
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
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaArray(
    value,
    identifier,
    options = emptyOptions,
) {
    // Process the happy path as quickly as possible.
    if (isArray(value)) return false;

    // Generate an explanation of what went wrong.
    return buildResultPrefix(options.begin, identifier) + (
        value === null
            ? IS_NULL
            : IS_TYPE_ + quote(typeof value)
        ) + _NOT_AN_ARRAY
    ;
}

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
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if `options.type` is invalid.
 */
function aintaType(
    value,
    identifier,
    options = emptyOptions,
) {
    // Process the happy path as quickly as possible.
    const type = typeof value;
    if (type === options.type) return false;

    // Build the first part of an explanation.
    const prefix = buildResultPrefix(options.begin, identifier);

    // If `options.type` is invalid, return a helpful result.
    const badOptionsType = prefix + CANNOT_OPTIONS + TYPE + '` ';
    if (!(TYPE in options))
        return `${badOptionsType}is${_NOT_}set`;
    const optionsType = options.type;
    if (optionsType === null)
        return badOptionsType + IS_NULL + _NOT_TYPE_ + QS;
    if (isArray(optionsType))
        return badOptionsType + IS_AN_ARRAY + _NOT_TYPE_ + QS;
    if (typeof optionsType !== STRING)
        return badOptionsType + IS_TYPE_ + quote(typeof optionsType) + _NOT_ + QS;
    if (!isRecognisedType(optionsType))
        return badOptionsType + quote(sanitise(optionsType)) + _NOT_ + 'known';

    // Otherwise, generate an explanation of what went wrong.
    return prefix + (
        value === null
            ? IS_NULL + _NOT_TYPE_
            : isArray(value)
                ? IS_AN_ARRAY + _NOT_TYPE_
                : IS_TYPE_ + quote(type) + _NOT_
        ) + quote(optionsType)
    ;
}

/**
 * ### Validates a boolean.
 *
 * If the first argument passed to `aintaBoolean()` ain't a boolean, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
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
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaBoolean(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `value` is a boolean.
    return aintaType(value, identifier, { ...options, type:BOOLEAN });
}

/**
 * ### Validates that a value is exactly `null`.
 *
 * If the first argument passed to `aintaNull()` ain't a `null`, it returns
 * a short explanation of what went wrong. Otherwise it returns `false`.
 *
 * @example
 * import { aintaNull } from '@0bdx/ainta';
 * 
 * aintaNull(null);
 * // false
 *
 * aintaNull();
 * // "A value is type 'undefined' not null"
 *
 * aintaNull(false, 'x', { begin:'expectNull()' });
 * // "expectNull(): `x` is type 'boolean' not null"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaNull(
    value,
    identifier,
    options = emptyOptions,
) {
    // Process the happy path as quickly as possible.
    if (value === null) return false;

    // Generate an explanation of what went wrong.
    return buildResultPrefix(options.begin, identifier) + (
        isArray(value)
            ? IS_AN_ARRAY
            : IS_TYPE_ + quote(typeof value)
        ) + _NOT_ + NULL
    ;
}

/**
 * ### Validates a number.
 *
 * If the first argument passed to `aintaNumber()` ain't a number, it returns
 * a short explanation of what went wrong.
 * 
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.gte` - if set, the value must be Greater Than or Equal to this
 * - `options.lte` - if set, the value must be Less Than or Equal to this
 * - `options.mod` - if set, the value must be divisible by this
 * 
 * Otherwise, `aintaNumber()` returns `false`.
 * 
 * `aintaNumber()` differs from `aintaType(..., { type:'number' })`, in that it
 * doesn't consider `NaN` to be a number.
 *
 * @example
 * import { aintaNumber } from '@0bdx/ainta';
 * 
 * aintaNumber(-Infinity);
 * // false
 *
 * aintaNumber(NaN);
 * // "A value is the special `NaN` value"
 *
 * aintaNumber('99', 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'string' not 'number'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if any of the `options` it uses are invalid.
 */
function aintaNumber(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `typeof value` is 'number'.
    // If not, bail out right away.
    let result = aintaType(value, identifier, { ...options, type:NUMBER });
    if (result) return result;

    // If `options.gte`, `.lte` or `.mod` are invalid, return a helpful result.
    // Note that setting these to `undefined` may be useful in some cases, so
    // that `{ gte:undefined }` acts the same way as `{}`, which is why we use
    // `options.gte !== undefined` instead of `"gte" in options`.
    const optionsGte = options.gte;
    const hasGte = optionsGte !== void 0;
    const optionsLte = options.lte;
    const hasLte = optionsLte !== void 0;
    const optionsMod = options.mod;
    const hasMod = optionsMod !== void 0;
    result = validateNumericOption(GTE, optionsGte, hasGte)
     || validateNumericOption(LTE, optionsLte, hasLte)
     || validateNumericOption(MOD, optionsMod, hasMod, true)

    // If `options.gte` and `options.lte` are both being used, but `gte` is
    // greater than `lte`, return a helpful result.
     || (hasGte && hasLte && optionsGte > optionsLte
        ? CANNOT_OPTIONS + 'gte` > `options.lte`'

        // `aintaNumber()` differs from `aintaType(..., { type:'number' })`,
        // in that it doesn't consider `NaN` to be a number. At this point,
        // `typeof value` is 'number' but it could be `NaN`, so use `isNaN()`
        // to check. Note that `Number.isNaN()` is not necessary in this case.
        : isNaN(value)
            ? IS_NAN

            // Compare `value` with the 'Greater Than or Equal' option, if set.
            : hasGte && optionsGte > value
                ? value + _IS_NOT_ + GTE + ' ' + optionsGte

                // Compare `value` with the 'Less Than or Equal' option, if set.
                : hasLte && optionsLte < value
                    ? value + _IS_NOT_ + LTE + ' ' + optionsLte

                    // Test if `value` divides by the modulo option, if set.
                    : hasMod && (value % optionsMod)
                        ? value + ' is not divisible by ' + optionsMod
                        : ''
    );

    return result
        ? buildResultPrefix(options.begin, identifier) + result
        : false;
}

/**
 * ### Validates a string.
 *
 * If the first argument passed to `aintaString()` ain't a string, it returns
 * a short explanation of what went wrong.
 * 
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.enum` - if set, this is an array of valid strings
 * - `options.max` - if set, this is the maximum allowed string length
 * - `options.min` - if set, this is the minimum allowed string length
 * - `options.rx` - if set, this is an object which has a `test()` function
 * 
 * Otherwise, `aintaString()` returns `false`.
 *
 * @example
 * import { aintaString } from '@0bdx/ainta';
 * 
 * aintaString("Ok!");
 * // false
 *
 * aintaString(["N","o","p","e"]);
 * // "A value is an array not type 'string'"
 *
 * aintaString(99, 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'number' not 'string'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if any of the `options` it uses are invalid.
 */
function aintaString(
    value,
    identifier,
    options = emptyOptions,
) {
    // Use aintaType() to check whether `typeof value` is 'string'.
    // If not, bail out right away.
    let result = aintaType(value, identifier, { ...options, type:STRING });
    if (result) return result;

    // If `options.enum`, `.max`, `.min` or `.rx` are invalid, return a
    // helpful result. Note that setting these to `undefined` may be useful in
    // some cases, so that `{ max:undefined }` acts the same way as `{}`, which
    // is why we use `options.max !== undefined` instead of `"max" in options`.
    const optionsEnum = options.enum;
    const hasEnum = optionsEnum !== void 0;
    const optionsMax = options.max;
    const hasMax = optionsMax !== void 0;
    const optionsMin = options.min;
    const hasMin = optionsMin !== void 0;
    const optionsRx = options.rx;
    const hasRx = optionsRx !== void 0;
    result = validateArrayOfStringsOption(optionsEnum, hasEnum)
     || validateNumericOption(MAX, optionsMax, hasMax, false, true)
     || validateNumericOption(MIN, optionsMin, hasMin, false, true)
     || validateRxishOption(optionsRx, hasRx)

    // If `options.max` and `options.min` are both being used, but `max` is less
    // than `min`, return a helpful result.
     || (hasMax && hasMin && optionsMax < optionsMin
        ? CANNOT_OPTIONS + 'max` < `options.min`'

        // Check that `value` exists in the `options.enum` array, if set.
        : hasEnum && optionsEnum.indexOf(value) == -1
            ? saq(value) + ' is not in ' + saq(optionsEnum.join(':'))

            // Check that `value` is not longer than `options.max`, if set.
            : hasMax && optionsMax < value.length
                ? saq(value) + _IS_NOT_ + MAX + ' ' + optionsMax

                // Check that `value` is not shorter than `options.max`, if set.
                : hasMin && optionsMin > value.length
                    ? saq(value) + _IS_NOT_ + MIN + ' ' + optionsMin

                    // Test if `value` passes the RegExp option, if set.
                    : hasRx && !optionsRx.test(value)
                        ? saq(value) + ' fails '
                            + (optionsRx instanceof RegExp
                                ? optionsRx
                                : 'custom test ' + FUNCTION)
                        : ''
    );

    return result
        ? buildResultPrefix(options.begin, identifier) + result
        : false;
}

/** Any one of `ainta`'s validation functions.
 * @typedef {function(any, string?, Options?):string|false} Ainta */

/**
 * ### Narrows any number of `ainta` functions, and aggregates their results.
 *
 * This helper:
 * 1. Narrows (applies shared options to) multiple `ainta` functions
 * 2. Aggregates the strings returned by those functions
 *
 * In the example below, `narrowAintas()` is used to narrow `aintaInteger()`
 * into `naInteger()`, and then capture its validation results:
 * - `begin:'bothNatural()'` sets a prefix, added to all explanations
 * - `gte:0` checks that the value is not negative
 * - `lte:1000` and `lte:50` specify different maximum values for each argument
 * - `if (results.length)` checks whether there were any problems
 *
 * @example
 * import narrowAintas, { aintaInteger } from '@0bdx/ainta';
 *
 * function bothNatural(a, b) {
 *     const [ results, naInteger ] = narrowAintas(
 *         { begin:'bothNatural()', gte:0 },
 *         aintaInteger
 *     );
 *     naInteger(a, 'a', { lte:1000 });
 *     naInteger(b, 'b', { lte:50 });
 *     if (results.length) return results;
 *     return "a and b are both natural numbers, in range!";
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
 * // "a and b are both natural numbers, in range!"
 *
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)
 * @param {...Ainta} aintas
 *    Any number of `ainta` functions, to apply `options` to.
 * @returns {[string[], ...Ainta[]]}
 *    The first item of the returned array will contain aggregated results. The
 *    remaining items are the passed-in functions, with `options` applied.
 */
function narrowAintas(
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
 * Narrows a single validation function.
 * @private
 *
 * @param {Options} options
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
    };

export { aintaArray, aintaBoolean, aintaNull, aintaNumber, aintaString, aintaType, narrowAintas as default };
