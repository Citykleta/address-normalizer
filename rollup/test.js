import node from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';

export default {
    input: './test/index.js',
    output: {
        format: 'iife',
        name: 'test',
        file: './test/dist/debug.js',
        sourcemap: true
    },
    plugins: [node(), cjs()]
};
