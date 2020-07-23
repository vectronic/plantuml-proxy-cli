import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

module.exports = [
    {
        input: {
            node: 'src/index.js'
        },
        output: {
            dir: 'dist',
            format: 'es'
        },
        watch: {
            include: 'src/**',
        },
        external: [
            'assert',
            'crypto',
            'events',
            'fs',
            'os',
            'path',
            'readline',
            'stream',
            'tty',
            'util',
            'http',
            'https',
            'zlib',
            'url',
            'string_decoder',
            'buffer',
            'constants',
            'readable-stream',
            'querystring'
        ],
        plugins: [
            json(),
            commonjs(),
            resolve({
                preferBuiltins: true
            }),
            cleanup({
                extensions: [
                    'js'
                ]
            }),
            terser()
        ]
    }
];
