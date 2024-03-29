import {
    _BT_OPT_IS_BT_,
    _BT_OPTIONS_DOT,
    _IS_NOT_,
    _NOT_,
    _NOT_A_REGULAR_,
    _NOT_AN_ARRAY,
    _NOT_TYPE_,
    _OF_,
    AN_OBJECT,
    FUNCTION,
    IS_AN_ARRAY,
    IS_NOT_IN,
    IS_NULL,
    IS_TYPE_,
    IS,
    OBJECT,
    OPEN,
} from './constants.js';
import {
    buildResultPrefix,
    containsOrContainsTheClassOf,
    isArray,
    QO,
    quote,
    saqArray,
    validateAgainstSchema,
    validateArrayOption,
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
 * @param {import('./options').Options} [options={}]
 *    The standard `ainta` configuration object (optional, defaults to `{}`).
 *    `options.open` determines whether properties not in `.schema` are allowed.
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
    const e2l = e => e.stack.split('\n')[2].match(/([^\/]+\.js:\d+):\d+\)?$/)[1];
    const equal = (actual, expected) => { if (actual === expected) return;
        try { throw Error() } catch(err) { throw Error(`actual:\n${actual}\n` +
            `!== expected:\n${expected}\n...at ${e2l(err)}\n`) } };

    /** @type {import('./options').Schema} */
    let schema;

    // Invalid `options.is` produces a helpful result.
    equal(f({a:1}, 'one', { begin:'Is', is:null }),
        "Is: `one` cannot be validated, `options.is` is null not an array");
    // @ts-expect-error
    equal(f({a:2}, undefined, { is:{} }),
        "An object cannot be validated, `options.is` is type 'object' not an array");
    equal(f({a:3}, 'three', { is:[] }),
        "`three` cannot be validated, `options.is` is empty");
    equal(f({a:4}, 'four', { is:[true,123,'123'] }),
        "`four` cannot be validated, `options.is` contains nothing of type 'object' or 'function'");

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

    // If `options.schema.a.types` is not an array, it produces a helpful result.
    equal(f({a:'1'}, 'one', { schema: { a:{ types:null } } }),
        "`one` cannot be validated, `options.schema.a.types` is null not an array");
    // @ts-expect-error
    equal(f({a:'2'}, undefined, { schema: { a:{ types:{} } } }),
        "An object cannot be validated, `options.schema.a.types` is type 'object' not an array");

    // If `options.schema.a.types` contains no arrays, and is invalid, it produces a helpful result.
    equal(f({a:'1'}, 'one', { schema: { a:{ types:['string',null,'bigint'] } } }),
        "`one` cannot be validated, `options.schema.a.types[1]` is null not type 'string'");
    // @ts-expect-error
    equal(f({a:'2'}, 'two', { schema: { a:{ types:['string',true] } } }),
        "`two` cannot be validated, `options.schema.a.types[1]` is type 'boolean' not 'string'");
    // @ts-expect-error
    equal(f({a:'3'}, 'three', { schema: { a:{ types:['string','BigInt','undefined'] } } }),
        "`three` cannot be validated, `options.schema.a.types[1]` 'BigInt' not known");

    // If `options.schema.a.types` contains only arrays, and is invalid, it produces a helpful result.
    equal(f({a:'1'}, 'one', { schema: { a:{ types:[[],[null]] } } }),
        "`one` cannot be validated, `options.schema.a.types[1][0]` is null not type 'string'");
    // @ts-expect-error
    equal(f({a:'2'}, undefined, { schema: { a:{ types:[[{}]] } } }),
        "An object cannot be validated, `options.schema.a.types[0][0]` is type 'object' not 'string'");
    // @ts-expect-error
    equal(f({a:'3'}, 'three', { schema: { a:{ types:[['string',[],'bigint']] } } }),
        "`three` cannot be validated, `options.schema.a.types[0][1]` is an array not type 'string'");
    // @ts-expect-error
    equal(f({a:'4'}, 'four', { schema: { a:{ types:[['string',true]] } } }),
        "`four` cannot be validated, `options.schema.a.types[0][1]` is type 'boolean' not 'string'");
    // @ts-expect-error
    equal(f({a:'5'}, 'five', { schema: { a:{ types:[['boolean'],['number'],['bigint','string','undefined','']] } } }),
        "`five` cannot be validated, `options.schema.a.types[2][3]` '' not known");

    // If `options.schema.a.types` contains a mix of arrays and strings, and is invalid, it produces a helpful result.
    equal(f({a:'1'}, 'one', { schema: { a:{ types:['string',[],null,'bigint'] } } }),
        "`one` cannot be validated, `options.schema.a.types[2]` is null not type 'string'");
    // @ts-expect-error
    equal(f({a:'2'}, 'two', { schema: { a:{ types:[['string','number'],'undefined',true] } } }),
        "`two` cannot be validated, `options.schema.a.types[2]` is type 'boolean' not 'string'");
    // @ts-expect-error
    equal(f({a:'3'}, 'three', { schema: { a:{ types:[['string'],'boolean',['Number']] } } }),
        "`three` cannot be validated, `options.schema.a.types[2][0]` 'Number' not known");

    // Typical usage without `options.is`, `.open` or `.schema`.
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

    // Typical `options.is` usage.
    class Foo { constructor(n) { this.n = n } }
    const foo = new Foo();
    equal(f(new Foo(3), null, { is:[3,'2',true,Foo], open:true }),
        false);
    equal(f({n:2}, null, { is:[3,'2',true,void 0,Foo], open:true }),
        "An object is not in `options.is` '3:2:true:undefined:Foo'");
    equal(f(new Promise(()=>{}), 'new Promise()', { is:[Foo,{},Promise,null] }),
        false);
    equal(f({n:4}, 'new Promise()', { is:[Foo,{},Promise,null] }),
        "`new Promise()` is not in `options.is` 'Foo:Object:Promise:null'");
    equal(f(foo, 'foo', { is:[foo], open:true }),
        false);
    equal(f({n:2}, 'foo', { is:[foo], open:true }),
        "`foo` is not in `options.is` 'Foo'");
    // @TODO more tests

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
    equal(f({ a:{}, b:'B!' }, '*', { begin:':', schema }),
        ":: `*.a` is type 'object', not the `options.types` 'undefined'");
    equal(f({ b:1 }, '', { schema }),
        "`b of an object` is type 'number', not the `options.types` 'undefined'");
    equal(f({ extra:99 }, '', { schema }),
        "`extra of an object` is unexpected");

    // `options.schema` - where any property can exist, except the described ones.
    schema = { a:{ types:['undefined'] }, b:{ types:['undefined'] } };
    equal(f({ extra:99 }, '', { open:true, schema }),
        false);
    equal(f({ extra:99, a:123 }, '', { open:true, schema }),
        "`a of an object` is type 'number', not the `options.types` 'undefined'");

    // `options.schema` - deep nesting example 1.
    schema = { a:{ types:['object'], schema: { b:{ types:['object'], schema: { c:{ types:['number'] } } } } } };
    equal(f({ a:{ b:true } }, 'nest3', { schema }),
        "`nest3.a.b` is type 'boolean', not the `options.types` 'object'");
    equal(f({ a:{ b:{ b:{}, c:3 } } }, 'nest3', { schema }),
        "`nest3.a.b.b` is unexpected");
    equal(f({ a:{ b:{ c:3 } } }, 'nest3', { schema }),
        false);

    // `options.schema` - `pass:true` does not pass the schema down to the next level.
    schema = { a:{ types:['object','undefined'] } };
    equal(f({ a:{ a:{ a:123 } } }, 'nest3', { schema, pass:true }),
        "`nest3.a.a` is unexpected");

    // `options.schema` - instance example.
    class ClassWhichDoesThings {
        constructor() { this.b = {} }
        doThings() {}
        a = true;
    }
    const doesThings = new ClassWhichDoesThings();
    schema = { a:{ types:['boolean'] }, b:{ types:['object'] }, doThings: { types:['function'] } };
    equal(f(doesThings, 'doesThings', { begin:'schema expects doThings()', open:false, schema }),
        false);
    schema = { a:{ types:['boolean'] }, b:{ types:['object'] } }; // @TODO maybe doesThings should be invalid
    equal(f(doesThings, 'doesThings', { begin:'schema does not expect doThings()', open:false, schema }),
        false);
    class ClassWhichDoesNotDoThings {
        constructor() { this.b = {} }
        a = true;
    }
    const doesNotDoThings = new ClassWhichDoesNotDoThings();
    schema = { a:{ types:['boolean'] }, b:{ types:['object'] }, doThings: { types:['function'] } };
    equal(f(doesNotDoThings, 'doesNotDoThings', { begin:'schema expects doThings()', open:false, schema }),
        "schema expects doThings(): `doesNotDoThings.doThings` is type 'undefined', not the `options.types` 'function'");
    schema = { a:{ types:['boolean'] }, b:{ types:['object'] } };
    equal(f(doesNotDoThings, 'doesNotDoThings', { begin:'schema does not expect doThings()', open:false, schema }),
        false);

    // `options.schema` - both properties must exist and be non-arrays of one type.
    schema = { a:{ types:['boolean'] }, b:{ types:['object'] } };
    equal(f({}, 'obj', { begin:'Must exist', schema }),
        "Must exist: `obj.a` is type 'undefined', not the `options.types` 'boolean'");
    equal(f({ a:false }, '', { schema }),
        "`b of an object` is type 'undefined', not the `options.types` 'object'");
    equal(f({ a:[], b:{} }, 'O', { schema }),
        "`O.a` is an array, not the `options.types` 'boolean'");
    equal(f({ a:!0, b:NaN }, '', { begin:'Bool and Obj', schema }),
        "Bool and Obj: `b of an object` is type 'number', not the `options.types` 'object'");
    equal(f({ a:!0, b:null }, '', { schema }),
        "`b of an object` is null not a regular object");
    equal(f({ a:!0, b:[] }, 'O', { begin:'Bool and Obj', schema }),
        "Bool and Obj: `O.b` is an array not a regular object");
    equal(f({ a:!1, b:{}, some:1 }, 'obj', { schema }),
        "`obj.some` is unexpected");
    equal(f({ a:!1, b:new Date(), some:1, more:Symbol('extras allowed') }, '', { open:true, schema }),
        false);

    // `options.schema` - both properties must exist and be arrays containing just one type.
    schema = { a:{ types:[['boolean']] }, b:{ types:[['object']] } };
    equal(f({ a:!1, b:null, some:1 }, 'obj', { begin:'The "unexpected" validation happens first', schema }),
        "The \"unexpected\" validation happens first: `obj.some` is unexpected");
    equal(f({}, 'obj', { begin:'Must exist', schema }),
        "Must exist: `obj.a` is type 'undefined', not the `options.types` '[boolean]'");
    equal(f({ a:NaN, b:[{}] }, 'O', { schema }),
        "`O.a` is type 'number', not the `options.types` '[boolean]'");
    equal(f({ a:[true,false,true] }, '', { schema }),
        "`b of an object` is type 'undefined', not the `options.types` '[object]'");
    equal(f({ a:[true,void 0], b:[{}] }, 'invalid_void_in_a', { schema }),
        "`invalid_void_in_a.a[1]` is type 'undefined', not the `options.types` '[boolean]'");
    equal(f({ a:[true], b:[{},null,[],true] }, 'invalid_true_in_b', { schema }),
        "`invalid_true_in_b.b[3]` is type 'boolean', not the `options.types` '[object]'");
    equal(f({ a:[true], b:[{}] }, 'one valid item in each array', { schema }),
        false);
    equal(f({ a:[], b:[] }, 'empty arrays are always valid', { schema }),
        false);
    equal(f({ a:[!1,!0], b:[null,[],Math] }, '', { begin:'Null and [] are not objs', schema }),
        "Null and [] are not objs: `b of an object[0]` is null not a regular object");
    equal(f({ a:[!1,!0], b:[Object(),[],Math] }, 'O', { begin:'Null and [] are not objs', schema }),
        "Null and [] are not objs: `O.b[1]` is an array not a regular object");
    equal(f({ a:[!1,!0], b:[/abc/,{},Math] }, '', { begin:'Null and [] are not objs', schema }),
        false);
    equal(f({ a:[!1,!0], b:[/abc/,{ c:3 },Math] }, 'O', { begin:'Sub-schema validation works', schema }),
        "Sub-schema validation works: `O.b[1].c` is unexpected");
    equal(f({ a:[!1,!0], b:[/abc/,{ c:3 },Math] }, 'O', { begin:'Adds `open:true` to sub-schema',
        schema: { ...schema, b:{ ...schema.b, open:true } } }),
        false);
    equal(f({ a:[!1,!0], b:[/abc/,{ c:3 },Math] }, 'O', { begin:'Adds mandatory type to sub-schema',
        schema: { ...schema, b:{ ...schema.b, schema:{ c:{ types:['number'] }} } } }),
        "Adds mandatory type to sub-schema: `O.b[0].c` is type 'undefined', not the `options.types` 'number'");
    equal(f({ a:[!1,!0], b:[/abc/,{ c:3 },Math] }, 'O', { begin:'Adds optional type to sub-schema',
        schema: { ...schema, b:{ ...schema.b, schema:{ c:{ types:['number','undefined'] }} } } }),
        false);
    equal(f({ a:[], b:[new Object()], some:1, more:Symbol('extras allowed') }, '', { open:true, schema }),
        false);

    // `options.schema` - the property must exist and be an array containing up to two types.
    schema = { a:{ types:[['string','symbol']] } };
    equal(f({ a:'1', b:1 }, '', { begin:'The "unexpected" validation happens first', schema }),
        "The \"unexpected\" validation happens first: `b of an object` is unexpected");
    equal(f({}, 'obj', { begin:'Must exist', schema }),
        "Must exist: `obj.a` is type 'undefined', not the `options.types` '[string:symbol]'");
    equal(f({ a:{} }, 'O', { schema }),
        "`O.a` is type 'object', not the `options.types` '[string:symbol]'");
    equal(f({ a:['',Symbol('a'),true] }, void 0, { schema }),
        "`a[2] of an object` is type 'boolean', not the `options.types` '[string:symbol]'");
    equal(f({ a:[Symbol(),'ok!'] }, void 0, { schema }),
        false);

    // `options.schema` - the property must exist and be either:
    // - an array containing only numeric values; or
    // - a boolean value
    schema = { a:{ types:[['bigint','number'],'boolean'] } };
    equal(f({ a:true, b:1 }, '', { begin:'The "unexpected" validation happens first', schema }),
        "The \"unexpected\" validation happens first: `b of an object` is unexpected");
    equal(f({ a:true }, 'just a bool', { schema }),
        false);
    equal(f({ a:[123,456] }, 'just an array of numbers', { schema }),
        false);
    equal(f({ a:[BigInt(123),BigInt(456)] }, 'just an array of bigints', { schema }),
        false);
    equal(f({ a:[BigInt(123),456] }, 'mixed array', { schema }),
        false);
    equal(f({ a:null }, '', { schema }),
        "`a of an object` is null, not one of the `options.types` '[bigint:number]:boolean'");
    equal(f({}, 'obj', { begin:'Must exist', schema }),
        "Must exist: `obj.a` is type 'undefined', not one of the `options.types` '[bigint:number]:boolean'");

    // `options.schema` - both properties are optional non-arrays.
    schema = { a:{ types:['number','undefined'] }, b:{ types:['string','symbol','undefined'] } };
    equal(f({ a:null, b:null }, void 0, { begin:'Optional', schema }),
        "Optional: `a of an object` is null, not one of the `options.types` 'number:undefined'");
    equal(f({ a:NaN, b:false }, 'o', { begin:'?', schema }),
        "?: `o.a` is the special `NaN` value not a regular number");
    equal(f({ a:123, b:false }, 'o', { begin:'?', schema }),
        "?: `o.b` is type 'boolean', not one of the `options.types` 'string:symbol:undefined'");
    equal(f({ a:Infinity, b:_=>_ }, '..', { schema }),
        "`...b` is type 'function', not one of the `options.types` 'string:symbol:undefined'");
    equal(f({ a:-0, b:Symbol(77) }, 'ok', { schema }),
        false);
    equal(f({ b:'77' }, 'ok', { schema }),
        false);
    equal(f({}, 'ok', { schema }),
        false);

    // `options.schema` - the property is optional and be either:
    // - an array containing only plain objects (not null or an array) and/or numbers; or
    // - a string; or
    // - an array containing only numeric values
    schema = { a:{ types:[['object','number'],'string',['bigint','number'],'undefined'] } };
    equal(f({}, 'undefined', { schema }),
        false);
    equal(f({ a:'ok' }, 'just_a_str', { schema }),
        false);
    equal(f({ a:true }, 'just_a_bool', { schema }),
        "`just_a_bool.a` is type 'boolean', not one of the `options.types` " +
        "'[object:number]:string:[bigint:number]:undefined'");
    equal(f({ a:[123,456] }, 'just an array of numbers - both sub-arrays could validate this', { schema }),
        false);
    equal(f({ a:[{},Math,/abc/] }, 'just an array of plain objects', { schema }),
        false);
    equal(f({ a:[BigInt(123),BigInt(456)] }, 'just an array of bigints', { schema }),
        false);
    equal(f({ a:[{ n:123 },456] }, '', { begin:'Sub-schema', schema }),
        "Sub-schema: `a of an object[0].n` is unexpected");
    equal(f({ a:[{ n:123 },456] }, 'mixed obj/num array', { schema: { a:{ ...schema.a, open:true } } }),
        false);
    equal(f({ a:[BigInt(123),456] }, 'mixed numeric array', { schema }),
        false);
    equal(f({ a:[{ n:123 },BigInt(456)] }, 'cannot_mix_up_like_this', { schema }),
        "`cannot_mix_up_like_this.a[0]` is type 'object', not one of the `options.types` " +
        "'[object:number]:string:[bigint:number]:undefined'");
    equal(f({ a:null }, '', { schema }),
        "`a of an object` is null, not one of the `options.types` " +
        "'[object:number]:string:[bigint:number]:undefined'");
    equal(f({ a:{} }, '', { begin:'Obj', schema }),
        "Obj: `a of an object` is type 'object', not one of the `options.types` " +
        "'[object:number]:string:[bigint:number]:undefined'");
    equal(f({ a:[[123],456] }, 'mixed_arr/num_array', { schema }),
        "`mixed_arr/num_array.a[0]` is an array not a regular object");
    equal(f({ a:[456,null] }, undefined, { begin:'mixed_null/num_array', schema }),
        "mixed_null/num_array: `a of an object[1]` is null not a regular object");
    equal(f({ a:[456,{ n:123 }] }, 'mixed_obj/num_array', { schema }),
        "`mixed_obj/num_array.a[1].n` is unexpected");
    equal(f({ a:[456,{ n:123 }] }, 'mixed_obj/num_array_with_sub-schema_to_allow_bool',
        { schema: { a:{ ...schema.a, schema:{ n:{ types:['boolean'] } } } } }),
        "`mixed_obj/num_array_with_sub-schema_to_allow_bool.a[1].n` is type 'number', not the `options.types` 'boolean'");
    equal(f({ a:[456,{ n:123 }] }, 'mixed obj/num array with sub-schema to allow num',
        { schema: { a:{ ...schema.a, schema:{ n:{ types:['number'] } } } } }),
        false);

    // `options.schema` - using 'number' options on non-arrays.
    schema = { n:{ gte:77, lte:99, mod:10, types:['number'] } }; // must be 80 or 90
    equal(f({ n:123 }, '', { schema }),
        "`n of an object` 123 is not lte 99");
    equal(f({ n:0 }, 'zero', { schema }),
        "`zero.n` 0 is not gte 77");
    equal(f({ n:95 }, 'ninety_five', { begin:'Number opts', schema }),
        "Number opts: `ninety_five.n` 95 is not divisible by 10");
    equal(f({ n:80 }, 'eighty', { schema }),
        false);

    // `options.schema` - using 'string' options on non-arrays.
    schema = { str:{ is:['a','aa','AAA','aaaa','aaaaa'], max:4, min:2, rx:/a/, types:['string'] } };
    equal(f({ str:'aaaaa' }, '', { schema }),
        "`str of an object` 'aaaaa' is not max 4");
    equal(f({ str:'a' }, 'a', { schema }),
        "`a.str` 'a' is not min 2");
    equal(f({ str:'AAA' }, 'caps', { begin:'String opts', schema }),
        "String opts: `caps.str` 'AAA' fails /a/");
    equal(f({ str:'aaa' }, void 0, { begin:'String opts', schema }),
        "String opts: `str of an object` 'aaa' is not in `options.is` 'a:aa:AAA:aaaa:aaaaa'");
    equal(f({ str:'aa' }, 'double_a', { schema }),
        false);
}
