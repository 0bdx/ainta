import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import * as bh from '@0bdx/build-helpers';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

// Use @0bdx/build-helpers to generate 'basic library' Rollup configuration.
const basicLibConfig = bh.rollupConfigBasicLib(
    'ainta.js',
    bh.generateBanner(
        new Date(),
        readFileSync('./package.json', 'utf-8'),
        bh.getFirstCommitYear(execSync),
        true,
    ),
);

// Create configuration for the Terser minification Rollup plugin.
const terserOptions = {
    compress: {
        drop_console: true,
        unsafe: true,
    },
    format: {
        max_line_len: 120,
        semicolons: false,
    },
    mangle: {
        toplevel: true,
    },
};

// Add a second output file to the 'basic library' Rollup configuration, which
// will create a minified version of the distribution file. `ainta` has the
// potential to bloat projects its used in, so creating 'ainta.min.js':
// 1. Helps us optimise the minified code size, while working on `ainta`
// 2. Gives downstream users the option of bundling minified `ainta` in an
//    otherwise unminified app, library or website
const config = {
    input: basicLibConfig.input,
    output: [
        basicLibConfig.output,
        {
            ...basicLibConfig.output,
            file: 'ainta.min.js',
            plugins: [terser(terserOptions)]
        }
    ],

    // When generated, `ainta.js` contains multiple instances of:
    //    import('./options').Options
    // These cause TS errors, so must be replaced by:
    //    Options
    //
    // This works because we have rolled-up the source into a single file -
    // the `@typedef {object} Options ...` is at the top of that file.
    //
    // Note that this solution also fixes an issue in `ainta.d.ts`.
    // Was:
    //    options?: any
    // Now:
    //    options?: Options
    plugins: [replace({
        "import('./options').": '',

        // Prevent the "(!) Plugin replace: @rollup/plugin-replace: ... will
        // default this option to `true`." message.
        preventAssignment: true,
    })]
}

export default config;
