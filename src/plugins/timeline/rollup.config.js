const path = require('path');

const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const copy = require('rollup-plugin-copy');
const replace = require('rollup-plugin-replace');
const intermediateBundle = require('rollup-plugin-intermediate-bundle');
const nodeGyp = require('rollup-plugin-node-gyp');
const silentCircular = require('rollup-plugin-silent-circular');

const { imgSpyBundleModules } = require('img-spy-core/bundles');

const pkg = require('./package.json');

const opts = {
    rootDir: __dirname,
    dist: path.resolve(__dirname, "dist/assets/plugins/timeline"),
    globalSrc: path.resolve(__dirname, "../..")
};


module.exports = {
    input: {
        "timeline-view": path.resolve(opts.rootDir, './private/view/index.tsx'),
        "timeline-workers": path.resolve(opts.rootDir, './private/workers/index.ts')
    },
    output: {
        dir: opts.dist,
        sourcemap: true,
        format: 'cjs',
        banner: `(function() {`,
        footer: `})()`,
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: '[name].[hash][extname]',
    },
    external: [
        ...['path', 'crypto', 'child_process', 'fs', 'os', 'stream'],
        ...['electron'],
    ],
    manualChunks: {},
    plugins: [
        intermediateBundle.use({
            path: '../../../js/img-spy.js',
            modules: imgSpyBundleModules
        }),
        copy({
            targets: [
                { src: path.resolve(opts.rootDir, "package.json"), dest: opts.dist }
            ],
        }),
        replace({
            exclude: 'node_modules/**',
            values: {
                "process.env.NODE_ENV": "'development'"
            }
        }),
        typescript({
            typescript: require('typescript'),
            objectHashIgnoreUnknownHack: true,
            tsconfig: path.resolve(opts.rootDir, 'tsconfig.json')
        }),
        resolve(),
        commonjs({
            include: [/node_modules/],
            extensions: ['.js', '.ts', '.tsx'],
            namedExports: {
                // TODO: Check those
                'src/node_modules/electron/index.js': [
                    'remote', 'MenuItem', 'ipcRenderer'
                ],
                'src/node_modules/@phosphor/widgets/lib/index.js': [
                    'DockPanel', 'Widget'
                ]
            }
        }),
        nodeGyp(),
        postcss(),
        silentCircular({
            exclude: /node_modules\/react-redux-form/
        }),
    ],
};
