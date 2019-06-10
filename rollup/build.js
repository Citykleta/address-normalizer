import pkg from '../package.json';

const nameParts = pkg.name.split('/');
const packageName = pkg.name.split('/')[nameParts.length - 1].replace(/-/g, '_');

export default {
    input: './src/index.js',
    output: [{
        format: 'es',
        file: `${pkg.main}.mjs`
    }, {
        format: 'es',
        file: `${pkg.module}`
    }, {
        format: 'cjs',
        file: `${pkg.main}.js`
    }, {
        format: 'iife',
        name: `${packageName}`,
        file: `./dist/bundle/${packageName}.js`,
        sourcemap: true
    }]
};
