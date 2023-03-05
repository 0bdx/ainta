import narrowAintas, {
    aintaBoolean,
    aintaNull,
    aintaType,
} from './index.js';

import { narrowAintasTest } from './narrow-aintas.js';
import { aintaBooleanTest } from './ainta-boolean.js';
import { aintaNullTest } from './ainta-null.js';
import { aintaTypeTest } from './ainta-type.js';

narrowAintasTest(narrowAintas);
aintaNullTest(aintaNull);
aintaBooleanTest(aintaBoolean);
aintaTypeTest(aintaType);
