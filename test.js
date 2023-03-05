import narrowAintas, {
    aintaBoolean,
    aintaNull,
    aintaType,
} from './ainta.js';

import { narrowAintasTest } from './src/narrow-aintas.js';
import { aintaBooleanTest } from './src/ainta-boolean.js';
import { aintaNullTest } from './src/ainta-null.js';
import { aintaTypeTest } from './src/ainta-type.js';

narrowAintasTest(narrowAintas);
aintaNullTest(aintaNull);
aintaBooleanTest(aintaBoolean);
aintaTypeTest(aintaType);
