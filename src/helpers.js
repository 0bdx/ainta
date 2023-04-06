import {
    _NOT_,
    _NOT_AN_ARRAY,
    _NOT_TYPE_,
    AN_ARRAY,
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
    TYPES,
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
 * @param {string} [unidentified]
 *    Optional way to refer to `value`, if `identifier` is not set.
 */
export const buildResultPrefix = (begin, identifier, unidentified) => {

    // Wrap `identifier` in backticks, to make the explanation clearer.
    // If `identifier` was not set, fall back to the default, "A value".
    const ident = identifier ? `\`${identifier}\` ` : unidentified || 'A value ';

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
 * ### Recognises a `typeof` string, or an array of `typeof` strings.
 * @private
 *
 * @param {string|string[]} type
 *    One of the strings that JavaScript's `typeof` produces, or an array of
 *    such strings, eg `"boolean"` or `["number","string","symbol"]`.
 * @returns {boolean}
 *    Returns true if `type` is a recognised `typeof` string.
 */
export const isRecognisedType = type =>
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

/**
 * ### Wraps a string or array of strings in single-quotes.
 * @private
 *
 * @param {string|string[]} [text]
 *    Text to wrap in single quotes.
 */
export const quote = text =>
    "'" + (Array.isArray(text) ? text.join(':') : text) + "'";

/** @constant {string} QB The literal string "'boolean'" */
export const QB = quote(BOOLEAN);

/** @constant {string} QN The literal string "'number'" */
export const QN = quote(NUMBER);

/** @constant {string} QF The literal string "'function'" */
export const QF = quote(FUNCTION);

/** @constant {string} QO The literal string "'object'" */
export const QO = quote(OBJECT);

/** @constant {string} QS The literal string "'string'" */
export const QS = quote(STRING);

/**
 * ### Truncates text to 32 characters, and then uri-encodes it.
 * @private
 *
 * If `text` is an array of strings, they are joined with the ':' character
 * before processing. This is useful for `TypeOrTypesOf` arrays.
 * 
 * @param {string|string[]} [text]
 *    Text to sanitise.
 */
export const sanitise = text => {
    const t = isArray(text) ? text.join(':') : text;
    return encodeURI(t.length <= 32 ? t
        : `${t.slice(0, 21)}...${t.slice(-8)}`).replace(/%20/g, ' ');
}

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
export const saq = text => quote(sanitise(text));

/**
 * ### Validates an option which should be an array of strings.
 * @private
 * 
 * @param {string} key
 *    The name of the option to validate, eg "enum".
 * @param {any} val
 *    The value of the option, which must be an array of strings to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 * @param {boolean} [allTypes]
 *    An optional flag which, if `true`, means strings must all be types.
 * @returns {undefined|string}
 *    Returns undefined if `val` is valid, or an explanation if not.
 */
export const validateArrayOfStringsOption = (key, val, has, allTypes) => {
    if (has) {
        const result = val === null
            ? IS_NULL + _NOT_AN_ARRAY
            : !isArray(val)
                ? IS_TYPE_ + quote(typeof val) + _NOT_AN_ARRAY
                : !allTypes && !val.length
                    ? 'is empty' // eg for `options.enum`
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
                    : allTypes && !isRecognisedType(item)
                        ? saq(item) + _NOT_ + 'known'
                        : '';
            if (result) return CANNOT_OPTIONS + key + '[' + i + ']` ' + result;
        }
    }
};

/**
 * ### Validates an option which should be a boolean, eg `options.pass`.
 * @private
 *
 * @param {string} key
 *    The name of the option to validate, eg "pass".
 * @param {any} val
 *    The value of the option, which must be a number to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 * @returns {undefined|string}
 *    Returns undefined if `val` is valid, or an explanation if not.
 */
export const validateBooleanOption = (key, val, has) => {
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
export const validateNumericOption = (key, val, has, notZero, notNegative) => {
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
 * @param {string} key
 *    The name of the option to validate, eg "rx".
 * @param {any} val
 *    The value of the option, which must be an object to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 */
export const validateRxishOption = (key, val, has) => {
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

/**
 * ### Validates an option which describes an object.
 * @private
 * 
 * @TODO refactor, it's too long a repetitive
 *
 * @param {any} schema
 *    The value of the option, which must be an object to be valid.
 * @param {boolean} has
 *    Whether the option exists in the `options` object.
 */
export const validateSchemaOption = (schema, has) => {
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
                                for (let i=0, l=val.length; i<l; i++) {
                                    const item = val[i];
                                    result = item === null
                                        ? IS_NULL + _NOT_TYPE_ + QS
                                        : isArray(item)
                                            ? IS_AN_ARRAY + _NOT_TYPE_ + QS
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
                }
            }
            if (result) return CANNOT_OPTIONS + 'schema.' + propertyName + result;
        }
    }    
};
