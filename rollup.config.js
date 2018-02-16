import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
	output: {
		file: 'public/index.js',
        sourcemap: true,
        format: 'cjs'
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
        commonjs({
            exclude: 'node_modules/**'
        }), // converts date-fns to ES modules
        production && uglify(), // minify, but only in production
        json(),
        babel({
            exclude: 'node_modules/**'
        })
	]
};