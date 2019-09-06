const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');
const pkg = require('./package.json');

const opts = {
    root: __dirname
}

module.exports = {
    input: {
        "export": path.resolve(opts.root, './src/export/index.ts'),
        "fst-watcher": path.resolve(opts.root, './src/fst-watcher/index.ts'),
        "settings": path.resolve(opts.root, './src/settings/index.ts'),
        "settings-window": path.resolve(opts.root, './src/settings-window/index.ts'),
        "terminal": path.resolve(opts.root, './src/terminal/index.ts'),
        "windows": path.resolve(opts.root, './src/windows/index.ts')
    },
    output: [
        {
            dir: path.resolve(opts.root),
            sourcemap: true,
            exports: 'named',
            format: 'esm',
            assetFileNames: '[name][extname]',
            entryFileNames: '[name]/index.js',
            globals: {
              crypto: 'nodeCrypto'
            }
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        ...["rxjs/operators"],
        ...["fs", "crypto", "path"]
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
        {
            name: "Custom modules plugin",
            buildStart(inputOptions) {
                Object.keys(inputOptions.input).forEach(key => {
                    const source = `{
                        "name": "img-spy-modules-${key}",
                        "version": "0.1.0",
                        "description": "",
                        "main": "index.js",
                        "module": "index.js",
                        "types": "../typings/${key}/index.d.ts",
                        "keywords": [],
                        "author": "",
                        "license": "ISC"
                    }`;
                    this.emitAsset(`${key}/package.json`, source);
                });
            }
        }
    ],
};
