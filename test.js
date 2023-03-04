import narrowAintas, {
    aintaBoolean,
    aintaType,
} from './ainta.js';

import { narrowAintasTest } from './src/narrow-aintas.js';
import { aintaBooleanTest } from './src/ainta-boolean.js';
import { aintaTypeTest } from './src/ainta-type.js';

narrowAintasTest(narrowAintas);
aintaBooleanTest(aintaBoolean);
aintaTypeTest(aintaType);
