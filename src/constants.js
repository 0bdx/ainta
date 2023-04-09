/**
 * ### Strings used by many `ainta` functions.
 * @private
 * 
 * Using constants this way helps avoid typos, and can help reduce the size of
 * minified code.
 */

/** @constant {string} ARRAY The literal string "array" */
export const ARRAY = 'array';

/** @constant {string} BIGINT The literal string "bigint" */
export const BIGINT = 'bigint';

/** @constant {string} BOOLEAN The literal string "boolean" */
export const BOOLEAN = 'boolean';

/** @constant {string} FUNCTION The literal string "function" */
export const FUNCTION = 'function';

/** @constant {string} NAN The literal string "nan" */
export const NAN = 'nan';

/** @constant {string} NULL The literal string "null" */
export const NULL = 'null';

/** @constant {string} NUMBER The literal string "number" */
export const NUMBER = 'number';

/** @constant {string} OBJECT The literal string "object" */
export const OBJECT = 'object';

/** @constant {string} STRING The literal string "string" */
export const STRING = 'string';

/** @constant {string} SYMBOL The literal string "symbol" */
export const SYMBOL = 'symbol';

/** @constant {string} UNDEFINED The literal string "undefined" */
export const UNDEFINED = 'undefined';

/** @constant {string} GTE The literal string "gte" */
export const GTE = 'gte';

/** @constant {string} IS The literal string "is" */
export const IS = 'is';

/** @constant {string} ISNT The literal string "isnt" (without an apostrophe) */
export const ISNT = 'isnt';

/** @constant {string} KEY The literal string "key" */
export const KEY = 'key';

/** @constant {string} LEAST The literal string "least" */
export const LEAST = 'least';

/** @constant {string} LTE The literal string "lte" */
export const LTE = 'lte';

/** @constant {string} MAX The literal string "max" */
export const MAX = 'max';

/** @constant {string} MIN The literal string "min" */
export const MIN = 'min';

/** @constant {string} MOD The literal string "mod" */
export const MOD = 'mod';

/** @constant {string} MOST The literal string "most" */
export const MOST = 'most';

/** @constant {string} OPEN The literal string "open" */
export const OPEN = 'open';

/** @constant {string} PASS The literal string "pass" */
export const PASS = 'pass';

/** @constant {string} RX The literal string "rx" */
export const RX = 'rx';

/** @constant {string} SCHEMA The literal string "schema" */
export const SCHEMA = 'schema';

/** @constant {string} TYPE The literal string "type" */
export const TYPE = 'type';

/** @constant {string} TYPES The literal string "types" */
export const TYPES = 'types';

/** @constant {string} AN_ The literal string "an " */
export const AN_ = 'an ';

/** @constant {string} AN_ARRAY The literal string "an array" */
export const AN_ARRAY = AN_ + ARRAY;

/** @constant {string} A_DICTIONARY The literal string "a dictionary" */
export const A_DICTIONARY = 'a dictionary';

/** @constant {string} AN_OBJECT The literal string "an object" */
export const AN_OBJECT = AN_ + OBJECT;

/** @constant {string} IS_ The literal string "is " */
export const IS_ = IS + ' ';

/** @constant {string} ONE The literal string "one" */
export const ONE = 'one';

/** @constant {string} _NOT_ The literal string " not " */
export const _NOT_ = ' not ';

/** @constant {string} _OF_ The literal string " of " */
export const _OF_ = ' of ';

/** @constant {string} THE The literal string "the" */
export const THE = 'the';

/** @constant {string} _BT_OPTIONS_DOT The literal string " `options." */
export const _BT_OPTIONS_DOT = ' `options.';

/** @constant {string} THE_BT_OPT_TYPES_BT_ The literal string "the `options.types` " */
export const THE_BT_OPT_TYPES_BT_ = THE + _BT_OPTIONS_DOT + TYPES + '` ';

/** @constant {string} CANNOT_OPTIONS The literal string "cannot be validated, `options." */
export const CANNOT_OPTIONS = 'cannot be validated,' + _BT_OPTIONS_DOT;

/** @constant {string} TYPE_ The literal string "type " */
export const TYPE_ = TYPE + ' ';

/** @constant {string} IS_AN_ARRAY The literal string "is an array" */
export const IS_AN_ARRAY = IS_ + AN_ARRAY;

/** @constant {string} IS_NULL The literal string "is null" */
export const IS_NULL = IS_ + NULL;

/** @constant {string} IS_NAN The literal string "is the special `NaN` value" */
export const IS_NAN = IS_ + 'the special `NaN` value';

/** @constant {string} IS_TYPE_ The literal string "is type" */
export const IS_TYPE_ = IS_ + TYPE_;

/** @constant {string} IS_NOT_ The literal string "is not " */
export const IS_NOT_ = IS + _NOT_;

/** @constant {string} _IS_NOT_ The literal string " is not " */
export const _IS_NOT_ = ' ' + IS_NOT_;

/** @constant {string} _IS_NOT_IN_ The literal string " is not in " */
export const _IS_NOT_IN_ = _IS_NOT_ + 'in ';

/** @constant {string} _NOT_AN_ARRAY The literal string " not an array" */
export const _NOT_AN_ARRAY = _NOT_ + AN_ + ARRAY;

/** @constant {string} IS_NOT_AN_ARRAY The literal string "is not an array" */
export const IS_NOT_AN_ARRAY = IS_NOT_ + AN_ + ARRAY;

/** @constant {string} _NOT_A_REGULAR_ The literal string " not a regular " */
export const _NOT_A_REGULAR_ = _NOT_ + 'a regular ';

/** @constant {string} _NOT_TYPE_ The literal string " not type " */
export const _NOT_TYPE_ = _NOT_ + TYPE_;
