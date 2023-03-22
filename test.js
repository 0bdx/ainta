import narrowAintas, {
    aintaArray,
    aintaBoolean,
    aintaNull,
    aintaNumber,
    aintaObject,
    aintaString,
    aintaType,
} from './ainta.js';

import narrowAintasMin, {
    aintaArray as aintaArrayMin,
    aintaBoolean as aintaBooleanMin,
    aintaNull as aintaNullMin,
    aintaNumber as aintaNumberMin,
    aintaObject as aintaObjectMin,
    aintaString as aintaStringMin,
    aintaType as aintaTypeMin,
} from './ainta.min.js';

import { narrowAintasTest } from './src/narrow-aintas.js';
import { aintaArrayTest } from './src/ainta-array.js';
import { aintaBooleanTest } from './src/ainta-boolean.js';
import { aintaNullTest } from './src/ainta-null.js';
import { aintaNumberTest } from './src/ainta-number.js';
import { aintaObjectTest } from './src/ainta-object.js';
import { aintaStringTest } from './src/ainta-string.js';
import { aintaTypeTest } from './src/ainta-type.js';

narrowAintasTest(narrowAintas);
aintaArrayTest(aintaArray);
aintaBooleanTest(aintaBoolean);
aintaNullTest(aintaNull);
aintaNumberTest(aintaNumber);
aintaObjectTest(aintaObject);
aintaStringTest(aintaString);
aintaTypeTest(aintaType);

narrowAintasTest(narrowAintasMin);
aintaArrayTest(aintaArrayMin);
aintaBooleanTest(aintaBooleanMin);
aintaNullTest(aintaNullMin);
aintaNumberTest(aintaNumberMin);
aintaObjectTest(aintaObjectMin);
aintaStringTest(aintaStringMin);
aintaTypeTest(aintaTypeMin);
