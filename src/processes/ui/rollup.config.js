const path = require('path');
const slash = require('slash');

const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const copy = require('rollup-plugin-copy');
const replace = require('rollup-plugin-replace');
const intermediateBundle = require('rollup-plugin-intermediate-bundle');
const silentCircular = require('rollup-plugin-silent-circular');
const electron = require('rollup-plugin-electron');

const { imgSpyBundleModules } = require('img-spy-core/bundles');

const pkg = require('./package.json');

const opts = new function Options() {
    this.rootDir = __dirname;
    this.distDir = process.env.IMGSPY_UI_PATH ||
        path.resolve(this.rootDir, "dist");
    this.assets = path.resolve(this.distDir, "assets");
}();


module.exports = {
    input:  path.resolve(opts.rootDir, './src/renderer.tsx'),
    output: {
        dir: opts.assets,
        sourcemap: true,
        sourcemapPathTransform: (file) => {
            const newFile = `../../../src/processes/ui/${file.substring(9)}`
            return newFile;
        },
        format: 'cjs',
        banner: `(function() {`,
        footer: `})()`,
        entryFileNames: 'js/[name].js',
        assetFileNames: '[name].[hash][extname]',
        chunkFileNames: '[name].js',
    },
    external: [
        ...["fs", "path", "child_process", "events", "crypto", "assert", "url", 
            "constants", "stream", "net", "tty", "os", "util", "http", "https",
            "zlib", "buffer"],
        ...["electron"],

        // FIXME: Remove this externals!!
        ...["chokidar", "element-resize-detector"]
    ],
    manualChunks: {
        // 'img-spy':  [
        //     // Tier 0
        //     'redux', 'react', 'react-dom', 'react-redux',
        //     // Tier 1
        //     'img-spy-core',
        //     // Tier 2
        //     'img-spy-api', 'img-spy-navigation',
        //     'img-spy-modules', 'img-spy-material', 'img-spy-resize'
        // ]
    },
    plugins: [
        intermediateBundle.use({
            path: './js/img-spy.js',
            modules: imgSpyBundleModules
        }),
        replace({
            exclude: 'node_modules/**',
            values: {
                "process.env.NODE_ENV": "'development'"
            }
        }),
        copy({
            targets: [
                { src: slash(path.resolve(opts.rootDir, 'src/index.html')), dest: opts.assets },
                { src: slash(path.resolve(opts.rootDir, 'i18n/languages')), dest: opts.assets },
                { src: slash(path.resolve(opts.rootDir, 'fonts')), dest: opts.distDir },
            ],
            verbose: true
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
                // 'src/node_modules/react/index.js': [
                //     'useLayoutEffect', 'useEffect', 'useMemo', 'useContext',
                //     'useReducer', 'useRef',

                //     'Component', 'Children', 'PureComponent', 'PropTypes',
                //     'createElement', 'Fragment', 'cloneElement', 'StrictMode',
                //     'createFactory', 'createRef', 'createContext',
                //     'isValidElement', 'isValidElementType',
                // ],
                'src/node_modules/react-is/index.js': [
                    'isValidElementType','isContextConsumer'
                ],
                // 'src/node_modules/react-dom/index.js': [
                //     'unstable_batchedUpdates',
                //     'render', 'hydrate',
                // ],
            }
        }),
        postcss(),
        electron(),
        silentCircular({
            exclude: /node_modules\/react-redux-form/
        }),
    ],
};
