export default {
    input: './src/index.js',
    output: [{
        format: 'es',
        file: './dist/bundle/index.mjs'
    }, {
        format: 'es',
        file: './dist/bundle/module.js'
    }, {
        format: 'cjs',
        file: './dist/bundle/index.js'
    }, {
        format: 'iife',
        name: 'citykleta_address_normalizer',
        file: './dist/bundle/citykleta_address_normalizer.js',
        sourcemap: true
    }]
};
