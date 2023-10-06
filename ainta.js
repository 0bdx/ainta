/**
 * https://www.npmjs.com/package/@0bdx/ainta
 * @version 0.0.20
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

/** @constant {string} GTE The literal string "gte" */
const GTE = 'gte';

/** @constant {string} IS The literal string "is" */
const IS = 'is';

/** @constant {string} KEY The literal string "key" */
const KEY = 'key';

/** @constant {string} LEAST The literal string "least" */
const LEAST = 'least';

/** @constant {string} LTE The literal string "lte" */
const LTE = 'lte';

/** @constant {string} MAX The literal string "max" */
const MAX = 'max';

/** @constant {string} MIN The literal string "min" */
const MIN = 'min';

/** @constant {string} MOD The literal string "mod" */
const MOD = 'mod';

/** @constant {string} MOST The literal string "most" */
const MOST = 'most';

/** @constant {string} OPEN The literal string "open" */
const OPEN = 'open';

/** @constant {string} PASS The literal string "pass" */
const PASS = 'pass';

/** @constant {string} RX The literal string "rx" */
const RX = 'rx';

/** @constant {string} TYPE The literal string "type" */
const TYPE = 'type';

/** @constant {string} TYPES The literal string "types" */
const TYPES = 'types';

/** @constant {string} AN_ The literal string "an " */
const AN_ = 'an ';

/** @constant {string} AN_ARRAY The literal string "an array" */
const AN_ARRAY = AN_ + ARRAY;

/** @constant {string} A_CLASS The literal string "a class" */
const A_CLASS = 'a class';

/** @constant {string} A_DICTIONARY The literal string "a dictionary" */
const A_DICTIONARY = 'a dictionary';

/** @constant {string} AN_OBJECT The literal string "an object" */
const AN_OBJECT = AN_ + OBJECT;

/** @constant {string} IN The literal string "in" */
const IN = 'in';

/** @constant {string} IS_ The literal string "is " */
const IS_ = IS + ' ';

/** @constant {string} ONE The literal string "one" */
const ONE = 'one';

/** @constant {string} _NOT_ The literal string " not " */
const _NOT_ = ' not ';

/** @constant {string} _OF_ The literal string " of " */
const _OF_ = ' of ';

/** @constant {string} THE The literal string "the" */
const THE = 'the';

/** @constant {string} _BT_OPTIONS_DOT The literal string " `options." */
const _BT_OPTIONS_DOT = ' `options.';

/** @constant {string} _BT_OPT_IS_BT_ The literal string "`options.is` " */
const _BT_OPT_IS_BT_ = _BT_OPTIONS_DOT + IS + '` ';

/** @constant {string} THE_BT_OPT_TYPES_BT_ The literal string "the `options.types` " */
const THE_BT_OPT_TYPES_BT_ = THE + _BT_OPTIONS_DOT + TYPES + '` ';

/** @constant {string} CANNOT_OPTIONS The literal string "cannot be validated, `options." */
const CANNOT_OPTIONS = 'cannot be validated,' + _BT_OPTIONS_DOT;

/** @constant {string} TYPE_ The literal string "type " */
const TYPE_ = TYPE + ' ';

/** @constant {string} IS_AN_ARRAY The literal string "is an array" */
const IS_AN_ARRAY = IS_ + AN_ARRAY;

/** @constant {string} IS_NULL The literal string "is null" */
const IS_NULL = IS_ + NULL;

/** @constant {string} IS_NAN The literal string "is the special `NaN` value" */
const IS_NAN = IS_ + 'the special `NaN` value';

/** @constant {string} IS_TYPE_ The literal string "is type" */
const IS_TYPE_ = IS_ + TYPE_;

/** @constant {string} IS_NOT_ The literal string "is not " */
const IS_NOT_ = IS + _NOT_;

/** @constant {string} _IS_NOT_ The literal string " is not " */
const _IS_NOT_ = ' ' + IS_NOT_;

/** @constant {string} IS_NOT_IN The literal string "is not in" */
const IS_NOT_IN = IS_NOT_ + IN;

/** @constant {string} _IS_NOT_IN The literal string " is not in" */
const _IS_NOT_IN = _IS_NOT_ + IN;

/** @constant {string} _NOT_AN_ARRAY The literal string " not an array" */
const _NOT_AN_ARRAY = _NOT_ + AN_ + ARRAY;

/** @constant {string} IS_NOT_AN_ARRAY The literal string "is not an array" */
const IS_NOT_AN_ARRAY = IS_NOT_ + AN_ + ARRAY;

/** @constant {string} _NOT_A_REGULAR_ The literal string " not a regular " */
const _NOT_A_REGULAR_ = _NOT_ + 'a regular ';

/** @constant {string} _NOT_TYPE_ The literal string " not type " */
const _NOT_TYPE_ = _NOT_ + TYPE_;

/**
 * ### The string name of a JavaScript type, eg `"boolean"` or `"undefined"`.
 * 
 * This is the complete set of possible values that JavaScript's built in
 * `typeof` is able to produce.
 * 
 * `typeof` has a few surprises up its sleeve. For example, `null` is "object"
 * and `NaN` is "number".
 *
 * @typedef {'bigint'|'boolean'|'function'|'number'|'object'|'string'|'symbol'|'undefined'} TypeOf
 */

/**
 * ### Describes the types an array can contain, eg `["object"]`.
 * 
 * - `["bigint","number"]` describes an array containing only numeric values
 * - `["boolean"]` describes an array containing only `true` and `false`
 * - `["string","undefined"]` can contain strings, `undefined` and 'empty slots'
 * - `[]` means an array which can contain any value
 *
 * @typedef {TypeOf[]} TypesOf
 */

/**
 * ### One type, or an array of certain types, eg `"number"` or `["string"]`.
 *
 * @typedef {TypeOf|TypesOf} TypeOrTypesOf
 */

// /**
//  * ### Extends JavaScript types, adding useful extras like "any" and "null".
//  *
//  * @typedef {TypeOf|'any'|'array'|'nan'|'null'} Kind
//  */

/**
 * ### A configuration object, used by all `ainta` functions.
 * 
 * Each option is actually optional, so an empty object `{}` is perfectly valid.
 * 
 * Different options are used by different `ainta` functions. For example:
 * - `options.before` is used all the `ainta` functions
 * - `options.gte` is only used by `aintaNumber()`
 * - `options.is` is used by `aintaBoolean()`, `aintaNumber()` and
 *   `aintaString()`.
 *
 * @typedef {object} Options
 * @property {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @property {number} [gte]
 *    Optional minimum value. Short for 'Greater Than or Equal'.
 * @property {any[]} [is]
 *    Optional array of valid values.
 * @property {any[]} [isnt]
 *    Optional array of invalid values.
 * @property {Rxish} [key]
 *    Optional object with a `test()` function. Typically a JavaScript `RegExp`.
 * @property {number} [least]
 *    Optional minimum length of an array.
 * @property {number} [lte]
 *    Optional maximum value. Short for 'Less Than or Equal'.
 * @property {number} [max]
 *    Optional maximum length of a string.
 * @property {number} [min]
 *    Optional minimum length of a string.
 * @property {number} [mod]
 *    Optional modulo which `value` must divide into without a remainder.
 * @property {number} [most]
 *    Optional maximum length of an array.
 * @property {boolean} [open]
 *    Optional flag. If true, an object can contain 'extra' properties -
 *    that is, key/value pairs not described in `options.schema`.
 * @property {boolean} [pass]
 *    Optional flag. If true, array items are validated using `options`.
 * @property {Rxish} [rx]
 *    Optional object with a `test()` function. Typically a JavaScript `RegExp`.
 * @property {string} [split]
 *    Optional string which tells `aintaList()` how to turn strings into arrays.
 * @property {Schema} [schema]
 *    Optional object which describes an object.
 * @property {TypeOrTypesOf} [type]
 *    Optional JavaScript type to expect, eg "number", ["object"] or "undefined".
 * @property {TypeOrTypesOf[]} [types]
 *    Optional array of JS types to expect, eg ["boolean"] for `true` or `false`
 *    or [["bigint","number"],"undefined"] for an optional array of numerics.  
 *    If missing, the property is allowed to be any type.
 */

/**
 * ### An object with a `test()` function. Typically a JavaScript `RegExp`.
 * 
 * @typedef {object} Rxish
 * @property {function(string):boolean} test
 *    The test function, which takes a string and returns `true` if it passes
 *    and `false` if it fails.
 */

/**
 * ### An object which describes an object's properties.
 * 
 * @typedef {Object.<string, Options>} Schema
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
 * ### Validates a number.
 *
 * If the first argument passed to `aintaNumber()` ain't a number, it returns
 * a short explanation of what went wrong.
 * 
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.gte` - if set, the value must be Greater Than or Equal to this
 * - `options.is` - if set, this is an array containing valid numbers
 * - `options.lte` - if set, the value must be Less Than or Equal to this
 * - `options.mod` - if set, the value must be divisible by this
 * 
 * Otherwise, `aintaNumber()` returns `false`.
 * 
 * `aintaNumber()` differs from `aintaType(..., { type:'number' })`, in that it
 * doesn't consider `NaN` to be a number.
 *
 * @TODO Add options.isnt, eg:
 * - `options.isnt` - if set, this is an array containing invalid numbers
 * - (by default, `.isnt` is [`NaN`], so set it to `[]` if `NaN` should be valid)
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
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
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

    // If `options.gte`, `.is` `.lte` or `.mod` are invalid, return a helpful
    // result. Note that setting these to `undefined` may be useful in some
    // cases, so that `{ gte:undefined }` acts the same way as `{}`, which
    // is why we use `options.gte !== void 0` instead of `"gte" in options`.
    const optionsGte = options.gte;
    const hasGte = optionsGte !== void 0;
    const optionsIs = options.is;
    const hasIs = optionsIs !== void 0;
    const optionsLte = options.lte;
    const hasLte = optionsLte !== void 0;
    const optionsMod = options.mod;
    const hasMod = optionsMod !== void 0;
    result =
        validateNumericOption(GTE, optionsGte, hasGte)
     || validateArrayOption(IS, optionsIs, hasIs, [NUMBER])
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
            ? IS_NAN + _NOT_A_REGULAR_ + NUMBER

            // Check that `value` exists in the `options.is` array, if set.
            : hasIs && optionsIs.indexOf(value) == -1
                ? IS_NOT_IN + _BT_OPT_IS_BT_ + saq(optionsIs.join(':'))

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
 * ### Validates that a value is a regular JavaScript object.
 *
 * If the first argument passed to `aintaObject()` ain't an object, it returns
 * a short explanation of what went wrong.
 * 
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.is` - if set, this is an array containing valid classes
 * - `options.open` - if set, properties not in `options.schema` are allowed
 * - `options.schema` - if set, the value must conform to this
 *
 * Otherwise, `aintaObject()` returns `false`.
 *
 * `aintaObject()` differs from `aintaType(..., { type:'object' })`, in that
 * it doesn't consider `null` or an array to be an object.
 * 
 * @example
 * import { aintaObject } from '@0bdx/ainta';
 * 
 * aintaObject({ red:0xFF0000 }, 'palette', { open:true });
 * // false
 *
 * aintaObject([]);
 * // "A value is an array not type 'object'"
 *
 * aintaObject(null, 'lookup', { begin:'processLookup()' });
 * // "processLookup(): `lookup` is null not an object"
 *
 * const schema = { red: { rx:/^#[a-f0-9]{6}$/i, types:['string'] } };
 * aintaObject({ red:0xFF0000 }, 'palette', { schema });
 * // "`palette.red` is type 'number' not 'string'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 *    `options.open` determines whether properties not in `.schema` are allowed.
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaObject(
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

    // If `options.is`, `.open` or `.schema` are invalid, return a helpful
    // result. Note that setting these to `undefined` may be useful in some
    // cases, so that `{ is:undefined }` acts the same way as `{}`, which is why
    // we use `options.is !== void 0` instead of `"is" in options`.
    const optionsIs = options.is;
    const hasIs = optionsIs !== void 0;
    const optionsOpen = options.open;
    const hasOpen = optionsOpen !== void 0;
    const optionsSchema = options.schema;
    const hasSchema = optionsSchema !== void 0;
    result =
        validateArrayOption(IS, optionsIs, hasIs, [OBJECT,FUNCTION])
     || validateBooleanOption(OPEN, optionsOpen, hasOpen)
     || validateSchemaOption(optionsSchema, hasSchema)

    // Check that `options.is`, if set, contains a class which `value` is an
    // instance of.
     || (hasIs && !containsOrContainsTheClassOf(optionsIs, value)
        ? IS_NOT_IN + _BT_OPT_IS_BT_ + saqArray(optionsIs)
        : ''
    );

    // If the validation above has failed, return an explanation.
    return result
        ? buildResultPrefix(options.begin, identifier, 'An object ') + result

        // Otherwise, check that the object conforms to `options.schema` if set.
        : validateAgainstSchema(value, options, hasSchema, AN_OBJECT, identifier);
}

/**
 * ### Validates a string.
 *
 * If the first argument passed to `aintaString()` ain't a string, it returns
 * a short explanation of what went wrong.
 * 
 * Else, if the first argument fails any of the following conditions, it also
 * returns an explanation of what went wrong:
 * - `options.is` - if set, this is an array containing valid strings
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
 * aintaString(99, 'redBalloons', { begin:'fly()' });
 * // "fly(): `redBalloons` is type 'number' not 'string'"
 * 
 * equal(f('Fum!', null, { is:['Fee','Fi','Fo'] }),
 * // "A value 'Fum!' is not in `options.is` 'Fee:Fi:Fo'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
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

    // If `options.is`, `.max`, `.min` or `.rx` are invalid, return a helpful
    // result. Note that setting these to `undefined` may be useful in some
    // cases, so that `{ max:undefined }` acts the same way as `{}`, which
    // is why we use `options.max !== void 0` instead of `"max" in options`.
    const optionsIs = options.is;
    const hasIs = optionsIs !== void 0;
    const optionsMax = options.max;
    const hasMax = optionsMax !== void 0;
    const optionsMin = options.min;
    const hasMin = optionsMin !== void 0;
    const optionsRx = options.rx;
    const hasRx = optionsRx !== void 0;
    result =
        validateArrayOption(IS, optionsIs, hasIs, [STRING])
     || validateNumericOption(MAX, optionsMax, hasMax, false, true)
     || validateNumericOption(MIN, optionsMin, hasMin, false, true)
     || validateRxishOption(RX, optionsRx, hasRx)

    // If `options.max` and `options.min` are both being used, but `max` is less
    // than `min`, return a helpful result.
     || (hasMax && hasMin && optionsMax < optionsMin
        ? CANNOT_OPTIONS + MAX + '` <' + _BT_OPTIONS_DOT + MIN + '`'

        // Check that `value` exists in the `options.is` array, if set.
        : hasIs && optionsIs.indexOf(value) == -1
            ? saq(value) + _IS_NOT_IN + _BT_OPT_IS_BT_ + saq(optionsIs.join(':'))

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

/** ### Utilities used by many `ainta` functions.
 * 
 * Reduces code duplication, and helps reduce the size of minified code.
 */

/** ### Builds the first part of an explanation.
 *
 * @private
 * @param {string} [begin]
 *    Optional text to begin the result with, eg a function name like "isOk()".
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation.
 * @param {string} [unidentified]
 *    Optional way to refer to `value`, if `identifier` is not set.
 */
const buildResultPrefix = (begin, identifier, unidentified) => {

    // Wrap `identifier` in backticks, to make the explanation clearer.
    // If `identifier` was not set, fall back to the default, "A value".
    const ident = identifier ? `\`${identifier}\` ` : unidentified || 'A value ';

    // If `begin` was set, start the prefix with it followed by ": ".
    // Either way, finish the prefix with the normalised identifier.
    return (begin ? begin + ': ' : '') + ident;
};

/** ### Checks that an array contains a value, or the class of that value.
 *
 * @private
 * @param {any[]} items
 *    Can contain anything, but `containsOrContainsTheClassOf()` is only 
 *    interested in functions (or more precisely classes), and objects.
 * @param {object} value
 *    The object to check.
 * @returns {boolean}
 *    Returns `true` if an item strict-equals `value`, or if an item is the
 *    class which `value` is an instance of.
 */
const containsOrContainsTheClassOf = (items, value) => {
    for (let i=0, len=items.length; i<len; i++) {
        const item = items[i];
        if (
            value === item
          || (typeof item === FUNCTION && value instanceof item)
        ) return true;
    }
    return false;
};

/** ### JavaScript's built-in `Array.isArray()`, for smaller minified files.
 * @private
 */
const isArray = Array.isArray;

/** ### Recognises a `typeof` string, or an array of `typeof` strings.
 *
 * @private
 * @param {string|string[]} type
 *    One of the strings that JavaScript's `typeof` produces, or an array of
 *    such strings, eg `"boolean"` or `["number","string","symbol"]`.
 * @returns {boolean}
 *    Returns `true` if `type` is a recognised `typeof` string.
 */
const isRecognisedType = type =>
    !isArray(type)
        ? [
            BIGINT,
            BOOLEAN,
            FUNCTION,
            NUMBER,
            OBJECT,
            STRING,
            SYMBOL,
            UNDEFINED,
        ].indexOf(type) !== -1
        : false
;

/** ### Wraps a string or array of strings in single-quotes.
 *
 * @private
 * @param {string|string[]} [text]
 *    Text to wrap in single quotes.
 */
const quote = text =>
    "'" + (Array.isArray(text) ? text.join(':') : text) + "'";

/** @private @constant {string} QB The literal string "'boolean'" */
const QB = quote(BOOLEAN);

/** @private @constant {string} QN The literal string "'number'" */
const QN = quote(NUMBER);

/** @private @constant {string} QF The literal string "'function'" */
const QF = quote(FUNCTION);

/** @private @constant {string} QO The literal string "'object'" */
const QO = quote(OBJECT);

/** @private @constant {string} QS The literal string "'string'" */
const QS = quote(STRING);

// @TODO use it or lose it
// /**
//  * @private
//  * @constant {string} QBFNS
//  * The literal string "'boolean:function:number:string'"
//  */
// export const QBFNS = quote(BOOLEAN+':'+FUNCTION+':'+NUMBER+':'+STRING);

/** ### Truncates text to 32 characters, and then uri-encodes it.
 *
 * If `text` is an array of strings, they are joined with the ':' character
 * before processing. This is useful for `TypeOrTypesOf` arrays.
 * 
 * @private
 * @param {string|string[]} [text]
 *    Text to sanitise.
 */
const sanitise = text => {
    const t = isArray(text) ? text.join(':') : text;
    return encodeURI(t.length <= 32 ? t
        : `${t.slice(0, 21)}...${t.slice(-8)}`).replace(/%20/g, ' ');
};

/** ### Sanitises a string, and then wraps it in single-quotes.
 * 
 * Makes .min.js files smaller, and source code more readable.
 * 
 * @private
 * @param {string} [text]
 *    Text to sanitise and quote.
 */
const saq = text => quote(sanitise(text));

/** ### Sanitises an array, converts it to a string, and wraps it in quotes.
 * 
 * @private
 * @param {any[]} [arr]
 *    Array of items to stringify, sanitise and quote.
 */
const saqArray = arr => saq(
    arr.map(i => i === null
            ? NULL
            : i === void 0
                ? UNDEFINED
                : typeof i === FUNCTION
                    ? i.name
                    : typeof i === OBJECT
                        ? i.constructor.name
                        : i
            // : typeof i.name === STRING
            //     ? i.name
            //     : i.constructor && typeof i.constructor.name === STRING
            //         ? i.constructor.name
            //         : i
    ).join(':')
);

/** ### Renders a 'typed array', to be used as part of an explanation.
 *
 * @private
 * @param {(string|string[])[]} types
 *    An array, containing a mixture of strings and arrays-of-strings.
 */
const stringifyTypes = types => quote(
    types
        .map(type => isArray(type) ? `[${type.join(':')}]` : type)
        .join(':'));

/** ### Checks that an object or class confirms to a given schema.
 * 
 * @TODO refactor, it's too long and repetitive
 *
 * @private
 * @param {object} ooc
 *    The object or class to validate.
 * @param {Options} options
 *    The standard `ainta` configuration object. `options.open` changes the
 *    validation behavior of `validateAgainstSchema()`.
 * @param {boolean} hasSchema
 *    `true` if `options.schema` is present.
 * @param {string} unidentified
 *    Way to refer to `ooc`, if `identifier` is not set.
 * @param {string} [identifier]
 *    Name to call `ooc` in the explanation, if invalid.
 * @return {false|string}
 *    Returns `false` if `ooc` conforms, or an explanation if not.
 */
const validateAgainstSchema = (ooc, options, hasSchema, unidentified, identifier) => {
    const { begin, open, schema } = options;

    // Step through each property in the `schema` object.
    let result;
    if (hasSchema) {
        for (const key in schema) {
            const { types } = schema[key];
            const val = ooc[key]; // could be undefined
            const type = typeof val;

            // If `options.types` exists, create `typedArrays` - a shallow copy
            // of `options.types` without the top-level strings.
            // So `[ "boolean", ["string"], "symbol", ["number","bigint"] ]`
            // becomes `[ ["string"], ["number","bigint"] ]`.
            const typedArrays = types && types.filter(isArray);

            // If no types are defined, the property can be any type but must exist.
            // @TODO still reject NaN, null and [], and write unit tests
            // @TODO still apply other options, and write unit tests
            if (!types || !types.length) {
                if (type === UNDEFINED) {
                    result = [key, IS_ + 'missing'];
                    break;
                }

            // Otherwise, if `options.types` contains at least one array, and if
            // `val` is an array, and if one of its item's types is not included
            // in `schema.types`, return an explanation of the problem.
            } else if (typedArrays.length && isArray(val)) {

                // If one of the 'typed arrays' is empty, it means that anything
                // goes. `val` must be valid, so skip to the next `key`.
                // @TODO still reject NaN, null and [], and write unit tests
                // @TODO still apply other options, and write unit tests
                for (const typedArray of typedArrays)
                    if (typedArray.length === 0) continue;

                // Define three variables which will be used inside the
                // `validateValue` loop, but also used afterwards.
                const valLen = val.length;
                let i = 0;
                let item;

                // Step through each 'typed array', and validate the value
                // against each one in turn.
                let validTypedArray = false;
                validateValue: for (const typedArray of typedArrays) {

                    // Step through each item in the value, to check whether
                    // the current 'typed array' can validate it.
                    i = 0; // IMPORTANT: no `let`, `i` must stay in upper scope
                    for (; i<valLen; i++) {
                        item = val[i]; // IMPORTANT: no `const`, `item` must stay in upper scope

                        // Step through each type-string in the current 'typed array'.
                        let validItem = false;
                        for (let j=0, len=typedArray.length; j<len; j++) {
                            if (typeof item === typedArray[j]) {
                                validItem = true;
                                break;
                            }
                        }

                        // If the current 'typed array' could not validate the
                        // item, try the next 'typed array'.
                        if (!validItem) continue validateValue;
                    }

                    // Every item in the value has validated against the current
                    // 'typed array', so skip to the next `key`.
                    validTypedArray = true;
                    break validateValue;
                }

                // If `validTypedArray` has not been set to `true`, `val` could
                // not be validated against any of the 'typed arrays', so write
                // an explanation, and break out of the top-level loop.
                if (!validTypedArray) {
                    const itemType = typeof item;
                    result = [`${key}[${i}]`, IS_ + (
                        item === null
                            ? NULL
                            : isArray(item)
                                ? AN_ARRAY
                                : TYPE_ + quote(itemType)
                        ) + ',' + _NOT_ + (
                            typedArrays.length === 1
                                ? THE_BT_OPT_TYPES_BT_
                                : ONE + _OF_ + THE_BT_OPT_TYPES_BT_
                        ) + stringifyTypes(types)
                    ];
                    break;
                }

                // `val` is an array, and its basic type is included in
                // `schema.types`, but it may still be have invalid items.
                // @TODO check that `most` and `least` (in which schema?) are followed
                const valIdentifier = identifier
                    ? identifier + '.' + key
                    : key + _OF_ + unidentified;
                for (let i=0; i<valLen; i++) {
                    const item = val[i];
                    const ainta = {
                        number: aintaNumber, // @TODO write unit tests
                        object: aintaObject, // @TODO recursive! write unit tests
                        string: aintaString, // @TODO write unit tests
                    }[typeof item];
                    if (ainta) {
                        const result = ainta(
                            item,
                            `${valIdentifier}[${i}]`,
                            { begin:options.begin, ...schema[key] },
                        );
                        if (result) return result;
                    }
                }

            // `val` is not an array. If its type is not included in `schema.types`,
            // return an explanation of the problem.
            // Note that `indexOf()` will ignore any 'typed arrays' in the schema.
            } else if (types.indexOf(type) === -1) {
                result = [key, IS_ + (
                    val === null
                        ? NULL
                        : isArray(val)
                            ? AN_ARRAY
                            : TYPE_ + quote(type)
                    ) + ',' + _NOT_ + (
                        types.length === 1
                            ? THE_BT_OPT_TYPES_BT_
                            : ONE + _OF_ + THE_BT_OPT_TYPES_BT_
                    ) + stringifyTypes(types)
                ];
                break;

            // `val` is not an array, and its basic type is included in
            // `schema.types`, but it may still be invalid.
            } else {
                const valIdentifier = identifier
                    ? identifier + '.' + key
                    : key + _OF_ + unidentified;
                const ainta = {
                    function: aintaFunction, // @TODO write unit tests
                    number: aintaNumber, // @TODO write unit tests
                    object: aintaObject, // @TODO recursive! write unit tests
                    string: aintaString, // @TODO write unit tests
            }[type];
                if (ainta) {
                    const result = ainta(
                        val,
                        valIdentifier,
                        { begin:options.begin, ...schema[key] },
                    );
                    if (result) return result;
                }
            }

            // @TODO write full unit tests for nested schemas
        }
    }

    // If `options.open` is `false` and the object contains a property which has
    // no schema key, return an explanation of the problem.
    if (!open) {
        for (const key in ooc) {
            if (!schema || !schema[key]) {
                result = [key, 'is unexpected'];
                break;
            }
        }
    }

    return result ? buildResultPrefix(
            begin,
            identifier && identifier + '.' + result[0],
            '`' + result[0] + _OF_ + unidentified + '` '
        ) + result[1]
        : false
    ;
};

// @TODO use it or lose it
// /** ### Validates an option which should be an array of functions.
//  * 
//  * `validateArrayOfFunctionsOption()` can be used to validate an array of
//  * classes, too. That's because, in JavaScript, a `class` has type `"function"`.
//  * 
//  * @private
//  * @param {string} key
//  *    The name of the option to validate, eg "is".
//  * @param {any} val
//  *    The value of the option, which must be an array of functions to be valid.
//  * @param {boolean} has
//  *    Whether the option exists in the `options` object.
//  * @returns {undefined|string}
//  *    Returns `undefined` if `val` is valid, or an explanation if not.
//  */
// export const validateArrayOfFunctionsOption = (key, val, has) => {
//     if (has) {
//         const result = val === null
//             ? IS_NULL + _NOT_AN_ARRAY
//             : !isArray(val)
//                 ? IS_TYPE_ + quote(typeof val) + _NOT_AN_ARRAY
//                 : '';
//         if (result) return CANNOT_OPTIONS + key + '` ' + result;
//         for (let i=0, l=val.length; i<l; i++) {
//             const item = val[i];
//             const result = item === null
//                 ? IS_NULL + _NOT_TYPE_ + QF
//                 : isArray(item)
//                     ? IS_AN_ARRAY + _NOT_TYPE_ + QF
//                     : typeof item !== FUNCTION
//                         ? IS_TYPE_ + quote(typeof item) + _NOT_ + QF
//                         : '';
//             if (result) return CANNOT_OPTIONS + key + '[' + i + ']` ' + result;
//         }
//     }
// };

// @TODO use it or lose it
// /** ### Validates an option which should be an array of scalars and functions.
//  * 
//  * A 'scalar', in this context, is a boolean, number or string.
//  * 
//  * @TODO maybe add BigInt, null and Symbol
//  * 
//  * @private
//  * @param {string} key
//  *    The name of the option to validate, eg "isnt".
//  * @param {any} val
//  *    The value of the option, which must be an array of scalars to be valid.
//  * @param {boolean} has
//  *    Whether the option exists in the `options` object.
//  * @param {'boolean'|'function'|'number'|'string'} mustContain
//  *    The array must contain at least one item of this type to be valid.
//  * @returns {undefined|string}
//  *    Returns `undefined` if `val` is valid, or an explanation if not.
//  */
// export const validateArrayOfBFNSOption = (key, val, has, mustContain) => {
//     if (has) {
//         const result = val === null
//             ? IS_NULL + _NOT_AN_ARRAY
//             : !isArray(val)
//                 ? IS_TYPE_ + quote(typeof val) + _NOT_AN_ARRAY
//                 : !val.length
//                     ? 'is empty'
//                     : '';
//         if (result) return CANNOT_OPTIONS + key + '` ' + result;
//         let doesContain = false;
//         for (let i=0, l=val.length; i<l; i++) {
//             const item = val[i];
//             const type = typeof item;
//             const result = item === null
//                 ? IS_NULL + _NOT_TYPE_ + QBFNS
//                 : isArray(item)
//                     ? IS_AN_ARRAY + _NOT_TYPE_ + QBFNS
//                     : type !== BOOLEAN && type !== FUNCTION && type !== NUMBER && type !== STRING
//                         ? IS_TYPE_ + quote(type) + _NOT_ + QBFNS
//                         : '';
//             if (result) return CANNOT_OPTIONS + key + '[' + i + ']` ' + result;
//             if (type === mustContain) doesContain = true;
//         }
//         if (!doesContain)
//             return CANNOT_OPTIONS + key + '` contains no ' + mustContain + 's';
//     }
// };

/** ### Validates an option which should be an array of types.
 * 
 * A 'type', in this context, is one of the strings that JavaScript's `typeof`
 * can produce, like `"boolean"` or `"undefined"`.
 * 
 * @private
 * @param {string} key
 *    The name of the option to validate, eg "types".
 * @param {any} val
 *    The value of the option, which must be an array of types to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 * @returns {undefined|string}
 *    Returns `undefined` if `val` is valid, or an explanation if not.
 */
const validateArrayOfTypesOption = (key, val, has) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_AN_ARRAY
            : !isArray(val)
                ? IS_TYPE_ + quote(typeof val) + _NOT_AN_ARRAY
                : '';
        if (result) return CANNOT_OPTIONS + key + '` ' + result;
        for (let i=0, l=val.length; i<l; i++) {
            const item = val[i];
            const result = item === null
                ? IS_NULL + _NOT_TYPE_ + QS
                : isArray(item)
                    ? IS_AN_ARRAY + _NOT_TYPE_ + QS
                    : typeof item !== STRING
                        ? IS_TYPE_ + quote(typeof item) + _NOT_ + QS
                        : !isRecognisedType(item)
                            ? saq(item) + _NOT_ + 'known'
                            : '';
            if (result) return CANNOT_OPTIONS + key + '[' + i + ']` ' + result;
        }
    }
};

/** ### Validates an option which should be an array containing any types.
 * 
 * @private
 * @param {string} key
 *    The name of the option to validate, eg "is".
 * @param {any} val
 *    The value of the option, which must be an array to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 * @param {('boolean'|'function'|'number'|'object'|'string')[]} mustContain
 *    `val` must contain at least one item of these types to be valid.
 *    - If `mustContain` is empty, `val` can contain anything
 * @returns {undefined|string}
 *    Returns `undefined` if `val` is valid, or an explanation if not.
 */
const validateArrayOption = (key, val, has, mustContain) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_AN_ARRAY
            : !isArray(val)
                ? IS_TYPE_ + quote(typeof val) + _NOT_AN_ARRAY
                : !val.length
                    ? 'is empty'
                    : '';
        if (result) return CANNOT_OPTIONS + key + '` ' + result;
        const mustContainLen = mustContain.length;
        if (!mustContainLen) return;
        let doesContain = false;
        if (mustContainLen === 1) {
            for (let i=0, l=val.length; i<l; i++) {
                const type = typeof val[i];
                if (type === mustContain[0]) {
                    doesContain = true;
                    break;
                }
            }
        } else {
            outer: for (let i=0, l=val.length; i<l; i++) {
                const type = typeof val[i];
                for (let j=0; j<mustContainLen; j++) {
                    if (type === mustContain[j]) {
                        doesContain = true;
                        break outer;
                    }
                }
            }
        }
        if (!doesContain) return CANNOT_OPTIONS + key +
            "` contains nothing of type '" + mustContain.join("' or '") + "'";
    }
};

/** ### Validates an option which should be a boolean, eg `options.pass`.
 *
 * @private
 * @param {string} key
 *    The name of the option to validate, eg "pass".
 * @param {any} val
 *    The value of the option, which must be a number to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 * @returns {undefined|string}
 *    Returns `undefined` if `val` is valid, or an explanation if not.
 */
const validateBooleanOption = (key, val, has) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_TYPE_ + QB
            : isArray(val)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QB
                : typeof val !== BOOLEAN
                    ? IS_TYPE_ + quote(typeof val) + _NOT_ + QB
                    : '';
        if (result) return CANNOT_OPTIONS + key + '` ' + result;
    }    
};

/** ### Validates an option which should be a number, eg `options.gte`.
 *
 * @private
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
 *    Returns `undefined` if `val` is valid, or an explanation if not.
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

/** ### Validates an option which should be an object with a `test()` function.
 *
 * @private
 * @param {string} key
 *    The name of the option to validate, eg "rx".
 * @param {any} val
 *    The value of the option, which must be an object to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 */
const validateRxishOption = (key, val, has) => {
    if (has) {
        let result = val === null
            ? IS_NULL + _NOT_TYPE_ + QO
            : isArray(val)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QO
                : typeof val !== OBJECT
                    ? IS_TYPE_ + quote(typeof val) + _NOT_ + QO
                    : '';
        if (result) return CANNOT_OPTIONS + key + '` ' + result;
        const fn = val.test;
        result = fn === null
            ? IS_NULL + _NOT_TYPE_ + QF
            : isArray(fn)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QF
                : typeof fn !== FUNCTION
                    ? IS_TYPE_ + quote(typeof fn) + _NOT_ + QF
                    : '';
        if (result) return CANNOT_OPTIONS + key + '.test` ' + result;
    }    
};

/** ### Validates an option which describes an object.
 * 
 * @TODO refactor, it's too long and repetitive
*
 * @private
 * @param {any} schema
 *    The value of the option, which must be an object to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 */
const validateSchemaOption = (schema, has) => {
    if (has) {
        let result = schema === null
            ? IS_NULL + _NOT_TYPE_ + QO
            : isArray(schema)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QO
                : typeof schema !== OBJECT
                    ? IS_TYPE_ + quote(typeof schema) + _NOT_ + QO
                    : '';
        if (result) return CANNOT_OPTIONS + 'schema` ' + result;
        for (const propertyName in schema) {
            const property = schema[propertyName];
            result = property === null
                ? '` ' + IS_NULL + _NOT_TYPE_ + QO
                : isArray(property)
                    ? '` ' + IS_AN_ARRAY + _NOT_TYPE_ + QO
                    : typeof property !== OBJECT
                        ? '` ' + IS_TYPE_ + quote(typeof property) + _NOT_ + QO
                        : '';
            if (!result) {
                there: for (const key in property) {
                    const val = property[key];
                    switch (key) {
                        case TYPES:
                            result = val === null
                                ? '.' + TYPES + '` ' + IS_NULL + _NOT_ + AN_ARRAY
                                : !isArray(val)
                                    ? '.' + TYPES + '` ' + IS_TYPE_ + quote(typeof val) + _NOT_ + AN_ARRAY
                                    : '';
                            if (!result) {
                                for (let i=0, valLen=val.length; i<valLen; i++) {
                                    const item = val[i];
                                    if (isArray(item)) {
                                        for (let j=0, itemLen=item.length; j<itemLen; j++) {
                                            const sub = item[j];
                                            result = sub === null
                                                ? IS_NULL + _NOT_TYPE_ + QS
                                                : isArray(sub)
                                                    ? IS_AN_ARRAY + _NOT_TYPE_ + QS
                                                    : typeof sub !== STRING
                                                        ? IS_TYPE_ + quote(typeof sub) + _NOT_ + QS
                                                        : !isRecognisedType(sub)
                                                            ? saq(sub) + _NOT_ + 'known'
                                                            : '';
                                            if (result) {
                                                result = '.' + key + '[' + i + '][' + j + ']` ' + result;
                                                break there;
                                            }
                                        }
                                    } else {
                                        result = item === null
                                            ? IS_NULL + _NOT_TYPE_ + QS
                                            : typeof item !== STRING
                                                ? IS_TYPE_ + quote(typeof item) + _NOT_ + QS
                                                : !isRecognisedType(item)
                                                    ? saq(item) + _NOT_ + 'known'
                                                    : '';
                                        if (result) {
                                            result = '.' + key + '[' + i + ']` ' + result;
                                            break there;
                                        }
                                    }
                                }
                            }
                        // @TODO more `schema` properties
                    }
                }
            }
            if (result) return CANNOT_OPTIONS + 'schema.' + propertyName + result;
        }
    }    
};

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
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 *    Also returns an explanation if `options.type` is invalid.
 */
function aintaType(
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
        const result = validateArrayOfTypesOption(TYPE, optionsType, true);
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
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 *    `options.open` determines whether properties not in `.schema` are allowed.
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaFunction(
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
 * ### Validates a value using JavaScript's native `Array.isArray()`.
 *
 * If the first argument passed to `aintaArray()` ain't an array, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the array fails any of the following conditions, it also returns an
 * explanation of what went wrong:
 * - `options.is` - if set, this is an array containing valid items
 * - `options.least` - if set, there must be at least this number of items
 * - `options.most` - if set, there must not be more than this number of items
 * - `options.pass` - if set, each item is validated more deeply using `options`
 * - `options.types` - if set, all items must be one of these types
 * 
 * If `options.is` and `.types` are both set, items are considered valid if they
 * are either in `options.is`, or are one of the `options.types`.
 * @TODO test that
 * 
 * Otherwise, `aintaArray()` returns `false`.
 * 
 * @example
 * import { aintaArray } from '@0bdx/ainta';
 * 
 * aintaArray([1, 'two', 3], 'a', { types:['number','string'] });
 * // false
 *
 * aintaArray({});
 * // "A value is type 'object' not an array"
 *
 * aintaArray(null, 'list', { begin:'processList()' });
 * // "processList(): `list` is null not an array"
 *
 * aintaArray(['ok', null, {}], 'a', { types:['object','string'] });
 * // "`a[1]` is null, not one of the `options.types` 'object:string'"
 *
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaArray(
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

    // Will probably be needed several times, below.
    const length = value.length;

    // If any of the `options` properties are invalid, return a helpful result.
    // Note that setting these to `undefined` may be useful in some cases, so
    // that `{ is:undefined }` acts the same way as `{}`, which is why we use
    // `options.is !== void 0` instead of `"is" in options`.
    const optionsIs = options.is;
    const hasIs = optionsIs !== void 0;
    const optionsLeast = options.least;
    const hasLeast = optionsLeast !== void 0;
    const optionsMost = options.most;
    const hasMost = optionsMost !== void 0;
    const optionsPass = options.pass;
    const hasPass = optionsPass !== void 0;
    const optionsTypes = options.types;
    const hasTypes = optionsTypes !== void 0;
    const result =
        validateArrayOption(IS, optionsIs, hasIs, [])
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
        ? buildResultPrefix(options.begin, identifier, 'An array ') + result

        // Otherwise, check that every item conforms to `options`.
        : validateEveryItem(value, length, options, hasIs, hasTypes, identifier);
}

function validateEveryItem(value, length, options, hasIs, hasTypes, identifier) {
    const { begin, is, pass, types } = options;

    // If no types are defined, the item can be any type, or even `undefined`.
    // Note that `validateArrayOption()` will already have failed an empty `is`.
    const definesTypes = hasTypes && types.length;

    // Step through each item in the `value` array.
    // In 2023, `for` loops run 3x faster than array methods on the V8 engine.
    for (let i=0; i<length; i++) {
        const item = value[i];
        const type = typeof item;
        const SQI = '[' + i + ']';

        // If the item is in `options.is` (or is an instance of a class in `is`),
        // then it's valid, and any `options.types` checks can be skipped.
        if (hasIs && containsOrContainsTheClassOf(is, item)) continue;

        // If the item did not just validate because of `options.is`, and no
        // `options.types` have been defined, then it's invalid.
        if (hasIs && !definesTypes) {
            return buildResultPrefix(
                begin,
                identifier && identifier + SQI,
                '`' + SQI + _OF_ + AN_ARRAY + '` '
            ) + IS_NOT_IN + _BT_OPT_IS_BT_ + saqArray(is);
        }

        // If the item's type is not one of `options.is`, and is not included
        // in `options.types`, return an explanation of the problem.
        if (definesTypes && types.indexOf(type) === -1) {
            return buildResultPrefix(
                begin,
                identifier && identifier + SQI,
                '`' + SQI + _OF_ + AN_ARRAY + '` '
            ) + IS_ + (
                item === null
                    ? NULL
                    : isArray(item)
                        ? AN_ARRAY
                        : TYPE_ + quote(type)
            ) + ',' + _NOT_ + (
                types.length === 1
                    ? THE_BT_OPT_TYPES_BT_ + quote(types[0])
                    : ONE + _OF_ + THE_BT_OPT_TYPES_BT_ + saq(types.join(':'))
            );
        }

        // If the item is `null` or an array, don't let it match 'object' in
        // `options.types`.
        if (definesTypes && type === OBJECT) {
            const result = item === null
                ? NULL
                : isArray(item)
                    ? AN_ARRAY
                    : '';
            if (result) return buildResultPrefix(
                begin,
                identifier && identifier + SQI,
                '`' + SQI + _OF_ + AN_ARRAY + '` '
            ) + IS_ + result + ',' + _NOT_A_REGULAR_ + OBJECT;
        }

        // The item's type is included in `options.types`, but if `options.pass`
        // is set to `true` the item may still be invalid.
        if (pass) {
            const itemIdentifier = identifier
                ? identifier + '[' + i + ']'
                : SQI + _OF_ + AN_ARRAY;
            let result;
            switch (type) {
                case FUNCTION:
                    result = aintaFunction(item, itemIdentifier, options);
                    if (result) return result;
                    break;
                case NUMBER:
                    result = aintaNumber(item, itemIdentifier, options);
                    if (result) return result;
                    break;
                case OBJECT:
                    if (item === null) break; // @TODO a bit hacky, revisit this
                    if (Array.isArray(item)) break; // @TODO a bit hacky, revisit this
                    result = aintaObject(item, itemIdentifier, options);
                    if (result) return result;
                    break;
                case STRING:
                    result = aintaString(item, itemIdentifier, options);
                    if (result) return result;
                    break;
            }
        }
    }

    return false;
}

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
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaBoolean(
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
        ? IS_NOT_IN + _BT_OPT_IS_BT_ + saq(optionsIs.join(':'))
        : ''
    );

    return result
        ? buildResultPrefix(options.begin, identifier) + result
        : false;
}

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
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
function aintaDictionary(
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
                : key + _OF_ + A_DICTIONARY;
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
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
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

/** Any one of `ainta`'s validation functions.
 * @typedef {Function} Ainta
 * @param {any} value
 *    The value to validate.
 * @param {string} [identifier]
 *    Optional name to call `value` in the explanation, if invalid.
 * @param {Options} [options={}]
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
 * @param {Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 * @param {...(Ainta|Ainta[])} aintas
 *    Any number of `ainta` functions, to apply `options` to.
 *    - An array of `ainta` functions is treated as an 'OR' list
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
 * @param {Options} options
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
    };

/** ### Narrows an 'OR' list of validation functions.
 * @private
 *
 * @param {Options} options
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
    };

export { aintaArray, aintaBoolean, aintaDictionary, aintaFunction, aintaNull, aintaNumber, aintaObject, aintaString, aintaType, narrowAintas as default };
