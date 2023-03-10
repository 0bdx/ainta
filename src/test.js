import narrowAintas, {
    aintaArray,
    aintaBoolean,
    aintaNull,
    aintaNumber,
    aintaType,
} from './index.js';

import { narrowAintasTest } from './narrow-aintas.js';
import { aintaArrayTest } from './ainta-array.js';
import { aintaBooleanTest } from './ainta-boolean.js';
import { aintaNullTest } from './ainta-null.js';
import { aintaNumberTest } from './ainta-number.js';
import { aintaTypeTest } from './ainta-type.js';

narrowAintasTest(narrowAintas);
aintaArrayTest(aintaArray);
aintaBooleanTest(aintaBoolean);
aintaNullTest(aintaNull);
aintaNumberTest(aintaNumber);
aintaTypeTest(aintaType);
