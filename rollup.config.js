import rollupTs from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import bundleSize from 'rollup-plugin-bundle-size';


const commonPlugins = [
    nodeResolve({ browser: true }),
    commonjs(),
    json(),
    rollupTs({ useTsconfigDeclarationDir: true }),

    terser(),
    bundleSize(),
]

export default [
    // ESM build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.mjs',
            format: 'esm',
            sourcemap: false,
        },
        plugins: [
            ...commonPlugins,
        ],
    },
    // CJS build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.cjs',
            format: 'cjs',
            sourcemap: false,
            exports: "named",
        },
        plugins: [
            ...commonPlugins,
        ],
    }
]