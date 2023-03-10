import {
    _NOT_,
    _NOT_AN_ARRAY,
    _NOT_TYPE_,
    BIGINT,
    BOOLEAN,
    CANNOT_OPTIONS,
    FUNCTION,
    IS_AN_ARRAY,
    IS_NAN,
    IS_NULL,
    IS_TYPE_,
    NUMBER,
    OBJECT,
    STRING,
    SYMBOL,
    UNDEFINED,
} from './constants.js';

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
export const buildResultPrefix = (begin, identifier) => {

    // Wrap `identifier` in backticks, to make the explanation clearer.
    // If `identifier` was not set, fall back to the default, "A value".
    const ident = identifier ? `\`${identifier}\` ` : 'A value ';

    // If `begin` was set, start the prefix with it followed by ": ".
    // Either way, finish the prefix with the normalised identifier.
    return (begin ? begin + ': ' : '') + ident;
}

/**
 * ### JavaScript's built-in `Array.isArray()`, for smaller minified files.
 * @private
 */
export const isArray = Array.isArray;

/**
 * ### Recognises a `typeof` string.
 * @private
 *
 * @param {string} type
 *    One of the strings that JavaScript's `typeof` produces, eg "boolean".
 * @returns {boolean}
 *    Returns true if `type` is a recognised `typeof` string.
 */
export const isRecognisedType = type => [
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
export const quote = text => "'" + text + "'";

/** @constant {string} QN The literal string "'number'" */
export const QN = quote(NUMBER);

/** @constant {string} QS The literal string "'string'" */
export const QS = quote(STRING);

/**
 * ### Truncates a string to 32 characters, and then uri-encodes it.
 * @private
 *
 * @param {string} [text]
 *    Text to sanitise.
 */
export const sanitise = text =>
    encodeURI(text.length <= 32 ? text
        : `${text.slice(0, 21)}...${text.slice(-8)}`)

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
export const validateEnumOption = (val, has) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_AN_ARRAY
            : !isArray(val)
                ? IS_TYPE_ + quote(typeof val) + _NOT_AN_ARRAY
                : '';
        if (result) return CANNOT_OPTIONS + 'enum` ' + result;
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
 * @param {boolean} [cannotBeZero]
 *    An optional flag which, if set to `true`, prevents `val` from being zero.
 * @returns {undefined|string}
 *    Returns undefined if `val` is valid, or an explanation if not.
 */
export const validateNumericOption = (key, val, has, cannotBeZero) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_TYPE_ + QN
            : isArray(val)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QN
                : typeof val !== NUMBER
                    ? IS_TYPE_ + quote(typeof val) + _NOT_ + QN
                    : isNaN(val)
                        ? IS_NAN
                        : cannotBeZero && !val
                            ? 'is zero'
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
export const validateRxishOption = (val, has) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_TYPE_ + QN
            : isArray(val)
                ? IS_AN_ARRAY + _NOT_TYPE_ + QN
                : typeof val !== NUMBER
                    ? IS_TYPE_ + quote(typeof val) + _NOT_ + QN
                    : isNaN(val)
                        ? IS_NAN
                        : '';
        if (result) return CANNOT_OPTIONS + 'rx` ' + result;
    }    
};
