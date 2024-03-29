import aintaFunction from './ainta-function.js';
import aintaNumber from './ainta-number.js';
import aintaObject from './ainta-object.js';
import aintaString from './ainta-string.js';
import {
    _NOT_,
    _NOT_AN_ARRAY,
    _NOT_TYPE_,
    _OF_,
    AN_ARRAY,
    BIGINT,
    BOOLEAN,
    CANNOT_OPTIONS,
    FUNCTION,
    IS_,
    IS_AN_ARRAY,
    IS_NAN,
    IS_NULL,
    IS_TYPE_,
    NULL,
    NUMBER,
    OBJECT,
    ONE,
    STRING,
    SYMBOL,
    THE_BT_OPT_TYPES_BT_,
    TYPE_,
    TYPES,
    UNDEFINED,
} from './constants.js';

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
export const buildResultPrefix = (begin, identifier, unidentified) => {

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
export const containsOrContainsTheClassOf = (items, value) => {
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
export const isArray = Array.isArray;

/** ### Recognises a `typeof` string, or an array of `typeof` strings.
 *
 * @private
 * @param {string|string[]} type
 *    One of the strings that JavaScript's `typeof` produces, or an array of
 *    such strings, eg `"boolean"` or `["number","string","symbol"]`.
 * @returns {boolean}
 *    Returns `true` if `type` is a recognised `typeof` string.
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

/** ### Wraps a string or array of strings in single-quotes.
 *
 * @private
 * @param {string|string[]} [text]
 *    Text to wrap in single quotes.
 */
export const quote = text =>
    "'" + (Array.isArray(text) ? text.join(':') : text) + "'";

/** @private @constant {string} QB The literal string "'boolean'" */
export const QB = quote(BOOLEAN);

/** @private @constant {string} QN The literal string "'number'" */
export const QN = quote(NUMBER);

/** @private @constant {string} QF The literal string "'function'" */
export const QF = quote(FUNCTION);

/** @private @constant {string} QO The literal string "'object'" */
export const QO = quote(OBJECT);

/** @private @constant {string} QS The literal string "'string'" */
export const QS = quote(STRING);

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
export const sanitise = text => {
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
export const saq = text => quote(sanitise(text));

/** ### Sanitises an array, converts it to a string, and wraps it in quotes.
 * 
 * @private
 * @param {any[]} [arr]
 *    Array of items to stringify, sanitise and quote.
 */
export const saqArray = arr => saq(
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
export const stringifyTypes = types => quote(
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
 * @param {import('./options').Options} options
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
export const validateAgainstSchema = (ooc, options, hasSchema, unidentified, identifier) => {
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
                    : key + _OF_ + unidentified
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
                    : key + _OF_ + unidentified
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
export const validateArrayOfTypesOption = (key, val, has) => {
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
export const validateArrayOption = (key, val, has, mustContain) => {
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
