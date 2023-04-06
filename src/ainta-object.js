import aintaNumber from './ainta-number.js';
import aintaString from './ainta-string.js';
import {
    _BT_OPTIONS_DOT,
    _IS_NOT_,
    _NOT_,
    _NOT_A_REGULAR_,
    _NOT_AN_ARRAY,
    _NOT_TYPE_,
    _OF_,
    AN_ARRAY,
    AN_OBJECT,
    IS_,
    IS_AN_ARRAY,
    IS_NULL,
    IS_TYPE_,
    NULL,
    ONE,
    OBJECT,
    OPEN,
    THE,
    TYPE_,
    TYPES,
    UNDEFINED,
} from './constants.js';
import {
    buildResultPrefix,
    isArray,
    QO,
    quote,
    saq,
    validateBooleanOption,
    validateSchemaOption,
} from './helpers.js';
import emptyOptions from './options.js';

/**
 * ### Validates that a value is a regular JavaScript object.
 *
 * If the first argument passed to `aintaObject()` ain't an object, it returns
 * a short explanation of what went wrong.
 *
 * Else, if the object does not conform to `options.schema`, it also returns an
 * explanation of what went wrong.
 * 
 * Otherwise, `aintaObject()` returns `false`.
 * 
 * `aintaObject()` differs from `aintaType(..., { type:'object' })`, in that it
 * doesn't consider `null` or an array to be an object.
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
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`)..
 * @returns {false|string}
 *    Returns `false` if `value` is valid, or an explanation if not.
 */
export default function aintaObject(
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
        ? buildResultPrefix(options.begin, identifier, 'An object ') + result

        // Otherwise, check that the object conforms to `options.schema` if set.
        : validateAgainstSchema(value, options, hasSchema, identifier);
}

/**
 * Checks that an object `obj` confirms to a given schema.
 *
 * @param {object} obj
 *    The object to validate.
 * @param {import('./options').Options} options
 *    The standard `ainta` configuration object (optional, defaults to `{}`)..
 * @param {boolean} hasSchema
 *    `true` if `options.schema` is present.
 * @param {string} identifier
 *    Optional name to call `obj` in the explanation, if invalid.
 * @return {false|string}
 *    Returns `false` if `obj` conforms, or an explanation if not.
 */
function validateAgainstSchema(obj, options, hasSchema, identifier) {
    const { begin, open, schema } = options;

    // Step through each property in the `schema` object.
    let result;
    if (hasSchema) {
        for (const key in schema) {
            const { types } = schema[key];
            const val = obj[key]; // could be undefined
            const type = typeof val;

            // If no types are defined, the property can be any type but must exist.
            if (!types || !types.length) {
                if (type === UNDEFINED) {
                    result = [key, IS_ + 'missing'];
                    break;
                }

            // Otherwise, if the val's type is not included in `schema.types`,
            // return an explanation of the problem.
            } else if (types.indexOf(type) === -1) {
                const THE_BT_OPT_TYPES_BT_ = THE + _BT_OPTIONS_DOT + TYPES + '` ';
                result = [key, IS_ + (
                    val === null
                        ? NULL
                        : isArray(val)
                            ? AN_ARRAY
                            : TYPE_ + quote(type)
                    ) + ',' + _NOT_ + (
                        types.length === 1
                            ? THE_BT_OPT_TYPES_BT_ + quote(types[0])
                            : ONE + _OF_ + THE_BT_OPT_TYPES_BT_ + saq(types.join(':'))
                    )
                ];
                break;

            // The val's type is included in `schema.types`, but the item may
            // still be invalid.
            } else {
                const valIdentifier = identifier
                    ? identifier + '.' + key
                    : key + _OF_ + AN_OBJECT
                const ainta = {
                    number: aintaNumber,
                    string: aintaString,
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

            // @TODO nested schemas
        }
    }

    // If `options.open` is `false` and the object contains a property which has
    // no schema key, return an explanation of the problem.
    if (!open) {
        for (const key in obj) {
            if (!schema || !schema[key]) {
                result = [key, 'is unexpected'];
                break;
            }
        }
    }

    return result ? buildResultPrefix(
            begin,
            identifier && identifier + '.' + result[0],
            '`' + result[0] + _OF_ + AN_OBJECT + '` '
        ) + result[1]
        : false
    ;
}

/**
 * aintaObject() unit tests.
 *
 * @param {aintaObject} f
 *    The `aintaObject()` function to test.
 * @returns {void}
 *    Does not return anything.
 * @throws
 *    Throws an `Error` if a test fails
 */
export function aintaObjectTest(f) {
    const equal = (actual, expected) => { if (actual !== expected) throw Error(
        `actual:\n${actual}\n!== expected:\n${expected}\n`) };

    /** @type {import('./options').Schema} */
    let schema;

    // Invalid `options.open` produces a helpful result.
    equal(f({a:1}, 'one', { open:null }),
        "`one` cannot be validated, `options.open` is null not type 'boolean'");
    // @ts-expect-error
    equal(f({a:2}, 'two', { begin:'Open to extras', open:[true] }),
        "Open to extras: `two` cannot be validated, `options.open` is an array not type 'boolean'");
    // @ts-expect-error
    equal(f({a:3}, '', { open:String(false) }),
        "An object cannot be validated, `options.open` is type 'string' not 'boolean'");

    // Invalid `options.schema` produces a helpful result.
    equal(f({a:'1'}, 'one', { begin:'{}', schema:null }),
        "{}: `one` cannot be validated, `options.schema` is null not type 'object'");
    // @ts-expect-error
    equal(f({a:'2'}, 'two', { schema:Array(10) }),
        "`two` cannot be validated, `options.schema` is an array not type 'object'");
    // @ts-expect-error
    equal(f({a:'3'}, '', { begin:'Three', schema:Symbol(1) }),
        "Three: An object cannot be validated, `options.schema` is type 'symbol' not 'object'");
    // @ts-expect-error
    equal(f({a:'4'}, undefined, { schema:NaN }),
        "An object cannot be validated, `options.schema` is type 'number' not 'object'");

    // Invalid `options.schema.a` produces a helpful result.
    equal(f({a:1}, void 0, { schema:{ a:null } }),
        "An object cannot be validated, `options.schema.a` is null not type 'object'");
    // @ts-expect-error
    equal(f({a:2}, 'two', { begin:'A', schema:{ a:[] } }),
        "A: `two` cannot be validated, `options.schema.a` is an array not type 'object'");
    // @ts-expect-error
    equal(f({a:3}, '', { begin:'Three', schema:{ a:()=>({}) } }),
        "Three: An object cannot be validated, `options.schema.a` is type 'function' not 'object'");

    // Invalid `options.schema.a.types` produces a helpful result.
    equal(f({a:'1'}, 'one', { schema: { a:{ types:null } } }),
        "`one` cannot be validated, `options.schema.a.types` is null not an array");
    // @ts-expect-error
    equal(f({a:'2'}, undefined, { schema: { a:{ types:{} } } }),
        "An object cannot be validated, `options.schema.a.types` is type 'object' not an array");
    equal(f({a:'3'}, 'three', { schema: { a:{ types:['string',null,'bigint'] } } }),
        "`three` cannot be validated, `options.schema.a.types[1]` is null not type 'string'");
    // @ts-expect-error
    equal(f({a:'4'}, 'four', { schema: { a:{ types:[[],'string','bigint'] } } }),
        "`four` cannot be validated, `options.schema.a.types[0]` is an array not type 'string'");
    // @ts-expect-error
    equal(f({a:'5'}, 'five', { schema: { a:{ types:['string',true] } } }),
        "`five` cannot be validated, `options.schema.a.types[1]` is type 'boolean' not 'string'");
    // @ts-expect-error
    equal(f({a:'6'}, 'six', { schema: { a:{ types:['string','BigInt','undefined'] } } }),
        "`six` cannot be validated, `options.schema.a.types[1]` 'BigInt' not known");

    // Typical usage without `options.open` or `.schema`.
    equal(f({}),
        false);
    equal(f(new Date(), 'now'),
        false);
    equal(f(),
        "A value is type 'undefined' not 'object'");
    equal(f(null, 'o', { begin:'Object Test' }),
        "Object Test: `o` is null not a regular object");
    equal(f(void 0, null, { begin:'Object Test' }),
        "Object Test: A value is type 'undefined' not 'object'");
    equal(f([], 'empty array'),
        "`empty array` is an array not a regular object");
    equal(f(123, void 0, { type:'number' }),
        "A value is type 'number' not 'object'");

    // Typical `options.open` usage.
    equal(f({}, '', { open:true }),
        false);
    equal(f({}, '', { open:false }),
        false);
    equal(f(Math, 'The Math object', { open:true }),
        false);
    equal(f(Math, 'The Math object', { open:false }),
        false);
    equal(f({ unexpected:1 }, 'oops!', { open:true }),
        false);
    equal(f({ unexpected:1 }, 'oops!', { open:false }),
        "`oops!.unexpected` is unexpected");
    equal(f({ a:1, b:2, c:3 }, void 0, { begin:'Object Test', open:true }),
        false);
    equal(f({ a:1, b:2, c:3 }, void 0, { begin:'Object Test', open:false }),
        "Object Test: `a of an object` is unexpected");
    equal(f(Object({a:1}) , 'object constructor', { begin:'Object Test', open:true }),
        false);
    equal(f(Object({a:1}) , 'object constructor', { begin:'Object Test', open:false }),
        "Object Test: `object constructor.a` is unexpected");

    // Minimal `options.schema` usage - an empty object.
    equal(f({}, '', { schema:{} }),
        false);
    equal(f({ foo:true }, void 0, { schema:{} }),
        "`foo of an object` is unexpected");

    // Basic `options.schema` usage - properties must exist but can be any type.
    schema = { a:{}, b:{} };
    equal(f({}, null, { begin:'Any!', schema }),
        "Any!: `a of an object` is missing");
    equal(f({ a:true }, 'two_props', { begin:'Any!', schema }),
        "Any!: `two_props.b` is missing");
    equal(f({ a:({}).x }, '', { schema }),
        "`a of an object` is missing");
    equal(f({ a:1, b:'' }, null, { begin:'Any!', schema  }),
        false);
    schema = { a:{ types:[] }, b:{ types:[] } };
    equal(f({}, null, { schema }),
        "`a of an object` is missing");
    equal(f({ a:void 0 }, 'obj', { begin:'Undefined Test', schema }),
        "Undefined Test: `obj.a` is missing");
    equal(f({ a:NaN }, 'two_props', { schema }),
        "`two_props.b` is missing");
    equal(f({ a:{}, b:null }, null, { schema  }),
        false);

    // `options.schema` - where the described properties must not exist.
    schema = { a:{ types:['undefined'] }, b:{ types:['undefined'] } };
    equal(f({ a:null }, '', { schema }),
        "`a of an object` is null, not the `options.types` 'undefined'");
    equal(f({ a:[], b:'B!' }, '*', { begin:':', schema }),
        ":: `*.a` is an array, not the `options.types` 'undefined'");
    equal(f({ b:1 }, '', { schema }),
        "`b of an object` is type 'number', not the `options.types` 'undefined'");
    equal(f({ extra:99 }, '', { schema }),
        "`extra of an object` is unexpected");
    equal(f({ extra:99 }, '', { open:true, schema }),
        false);

    // `options.schema` - both properties must exist and be of one type.
    schema = { a:{ types:['boolean'] }, b:{ types:['object'] } };
    equal(f({}, 'obj', { begin:'Must exist', schema }),
        "Must exist: `obj.a` is type 'undefined', not the `options.types` 'boolean'");
    equal(f({ a:false }, '', { schema }),
        "`b of an object` is type 'undefined', not the `options.types` 'object'");
    equal(f({ a:!0, b:NaN }, 'O', { schema }),
        "`O.b` is type 'number', not the `options.types` 'object'");
    equal(f({ a:!1, b:null, some:1 }, 'obj', { schema }),
        "`obj.some` is unexpected");
    equal(f({ a:!1, b:null, some:1, more:Symbol('extras allowed') }, '', { open:true, schema }),
        false);

    // `options.schema` - both properties are optional.
    schema = { a:{ types:['number','undefined'] }, b:{ types:['string','symbol','undefined'] } };
    equal(f({ a:null, b:null }, void 0, { begin:'Optional', schema }),
        "Optional: `a of an object` is null, not one of the `options.types` 'number:undefined'");
    equal(f({ a:NaN, b:false }, 'o', { begin:'?', schema }),
        "?: `o.a` is the special `NaN` value not a regular number");
    equal(f({ a:123, b:false }, 'o', { begin:'?', schema }),
        "?: `o.b` is type 'boolean', not one of the `options.types` 'string:symbol:undefined'");
    equal(f({ a:Infinity, b:[] }, '..', { schema }),
        "`...b` is an array, not one of the `options.types` 'string:symbol:undefined'");
    equal(f({ a:-0, b:Symbol(77) }, 'ok', { schema }),
        false);
    equal(f({ b:'77' }, 'ok', { schema }),
        false);
    equal(f({}, 'ok', { schema }),
        false);

    // `options.schema` - using 'number' options.
    schema = { n:{ gte:77, lte:99, mod:10, types:['number'] } }; // must be 80 or 90
    equal(f({ n:123 }, '', { schema }),
        "`n of an object` 123 is not lte 99");
    equal(f({ n:0 }, 'zero', { schema }),
        "`zero.n` 0 is not gte 77");
    equal(f({ n:95 }, 'ninety_five', { begin:'Number opts', schema }),
        "Number opts: `ninety_five.n` 95 is not divisible by 10");
    equal(f({ n:80 }, 'eighty', { schema }),
        false);

    // `options.schema` - using 'string' options.
    schema = { str:{ enum:['a','aa','AAA','aaaa','aaaaa'], max:4, min:2, rx:/a/, types:['string'] } };
    equal(f({ str:'aaaaa' }, '', { schema }),
        "`str of an object` 'aaaaa' is not max 4");
    equal(f({ str:'a' }, 'a', { schema }),
        "`a.str` 'a' is not min 2");
    equal(f({ str:'AAA' }, 'caps', { begin:'String opts', schema }),
        "String opts: `caps.str` 'AAA' fails /a/");
    equal(f({ str:'aaa' }, void 0, { begin:'String opts', schema }),
        "String opts: `str of an object` 'aaa' is not in 'a:aa:AAA:aaaa:aaaaa'");
    equal(f({ str:'aa' }, 'double_a', { schema }),
        false);
}
