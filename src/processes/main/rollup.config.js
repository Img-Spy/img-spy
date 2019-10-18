const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const silentCircular = require('rollup-plugin-silent-circular');
const electron = require('rollup-plugin-electron');
const intermediateBundle = require('rollup-plugin-intermediate-bundle');
const path = require('path');
const pkg = require('./package.json');

const opts = {
    rootDir: __dirname,
    distDir: process.env.IMGSPY_MAIN_PATH ||
        path.resolve(__dirname, "dist"),
    globalSrc: path.resolve(__dirname, "../..")
}

module.exports = {
    input: path.resolve(opts.rootDir, './src/main.ts'),
    output: {
        dir: opts.distDir,
        sourceMap: true,
        format: 'cjs',
        assetFileNames: 'assets/[name].[hash][extname]',
        entryFileNames: '[name].js',
        chunkFileNames: 'lib/[name].js'
    },
    external: [
        ...["fs", "path", "child_process", "events", "crypto", "url", "os",
            "stream"], 
        ...["electron", "electron-store"]
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
        // 'react':    ['react', 'react-dom'],
        // 'redux':    ['redux', 'react-redux'],
        // 'img-spy':  ['img-spy-api', 'img-spy-core', 'img-spy-navigation',
        //              'img-spy-modules', 'img-spy-material', 'img-spy-resize'],
        // 'utils':    ['uuid/v1', 'rxjs', 'rxjs/operators'],
        // 'electron': ['electron'],
    },
    plugins: [
        typescript({
            typescript: require('typescript'),
            tsconfig: path.resolve(opts.rootDir, 'tsconfig.json')
        }),
        intermediateBundle.use({
            path: './assets/js/img-spy.js',
            modules: {
                "img-spy-core": {
                    name: "imgSpyCore",
                    namedExports: [                
                        'channels', 'buildMessageType', 'QueuedCluster'
                    ]
                }
            }
        }),
        resolve({
            jail: opts.globalSrc
        }),
        commonjs({
            include: /node_modules/,
            extensions: ['.js', '.ts'],
            namedExports: {
            //     'src/node_modules/react/index.js': [
            //         'useLayoutEffect', 'useEffect', 'useMemo', 'useContext',
            //         'useReducer', 'useRef',

            //         'Component', 'Children', 'PureComponent', 'PropTypes',
            //         'createElement', 'Fragment', 'cloneElement', 'StrictMode',
            //         'createFactory', 'createRef', 'createContext',
            //         'isValidElement', 'isValidElementType',
            //     ],
            //     'src/node_modules/react-is/index.js': [
            //         'isValidElementType','isContextConsumer'
            //     ],
            //     'src/node_modules/react-dom/index.js': [
            //         'unstable_batchedUpdates',
            //         'render', 'hydrate',
            //     ],
            }
        }),
        silentCircular({
            exclude: /node_modules\/react-redux-form/
        }),
        electron({ main: true }),
        json()
    ],
};
