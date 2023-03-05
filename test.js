import narrowAintas, {
    aintaArray,
    aintaBoolean,
    aintaNull,
    aintaType,
} from './ainta.js';

import { narrowAintasTest } from './src/narrow-aintas.js';
import { aintaArrayTest } from './src/ainta-array.js';
import { aintaBooleanTest } from './src/ainta-boolean.js';
import { aintaNullTest } from './src/ainta-null.js';
import { aintaTypeTest } from './src/ainta-type.js';

narrowAintasTest(narrowAintas);
aintaArrayTest(aintaArray);
aintaBooleanTest(aintaBoolean);
aintaNullTest(aintaNull);
aintaTypeTest(aintaType);
