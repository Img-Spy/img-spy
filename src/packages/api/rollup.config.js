const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');
const pkg = require('./package.json');

const opts = {
    root: __dirname
}

module.exports = {
    input: path.resolve(opts.root, './src/index.ts'),
    output: [
        {
            file: path.resolve(opts.root, pkg.main),
            sourcemap: true,
            format: 'cjs',
        },
        {
            file: path.resolve(opts.root, pkg.module),
            sourcemap: true,
            format: 'es',
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...["rxjs/operators", "uuid/v1"],
        ...["crypto"],
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            tsconfig: path.resolve(opts.root, 'tsconfig.json'),
            useTsconfigDeclarationDir: true
        }),
        resolve(),
        commonjs({
            include: /node_modules/,
            extensions: ['.js', '.ts']
        }),
    ],
};
