import narrowAintas, {
    aintaBoolean,
    aintaType,
} from './index.js';

import { narrowAintasTest } from './narrow-aintas.js';
import { aintaBooleanTest } from './ainta-boolean.js';
import { aintaTypeTest } from './ainta-type.js';

narrowAintasTest(narrowAintas);
aintaBooleanTest(aintaBoolean);
aintaTypeTest(aintaType);
