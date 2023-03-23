import { readFileSync, writeFileSync } from 'fs';

// This workaround corrects types for the functions returned by `narrowAintas()`,
// by fixing an issue in the auto-generated `ainta.d.ts` typings file.
const source = readFileSync('ainta.d.ts').toString();
writeFileSync(
    'ainta.d.ts',
    source.replace(
        'export type Ainta = Function;',
        'export type Ainta = (value: any, identifier?: string, options?: Options) => false | string;',
    )
);
