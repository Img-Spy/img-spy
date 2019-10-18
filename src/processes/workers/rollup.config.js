const typescript = require('rollup-plugin-typescript2');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const intermediateBundle = require('rollup-plugin-intermediate-bundle');
const silentCircular = require('rollup-plugin-silent-circular');
const electron = require('rollup-plugin-electron');
const path = require('path');
const pkg = require('./package.json');

const opts = new function Options() {
    this.rootDir = __dirname;
    this.distDir = process.env.IMGSPY_WORKERS_PATH ||
        path.resolve(this.rootDir, "dist");
    this.globalSrc = path.resolve(this.rootDir, "../..");
}();


module.exports = {
    input: {
        'workers': path.resolve(opts.rootDir, './src/child-process.entry.ts')
    },
    output: {
        dir: opts.distDir,
        sourcemap: true,
        format: 'cjs',
        banner: `(function() {`,
        footer: `})()`,
        entryFileNames: '[name].js',
        assetFileNames: '[name].[hash][extname]',
        chunkFileNames: '[name].js',
    },
    external: [
        ...['path', 'fs', 'crypto', 'child_process'],
        ...['electron']
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
            path: './img-spy.js',
            modules: {
                // ImgSpy
                "img-spy-core": {
                    name: "imgSpyCore",
                    namedExports: [                
                        'channels', 'buildMessageType', 'QueuedCluster',
                        'reducerBuilder', 'environment', 'PluginLoader',
                        'Sink', 'getFileContent', 'ReDuckModule', 
                        'SimpleModule', 'FormModule', 'loadArgs',
                        'ChildProcessHelper', 'ChildProcessHandler',
                        'apiCodes', 'QueueRequest'
                    ]
                },
                "img-spy-api": {
                    name: "imgSpyApi",
                    namedExports: ['apiQuery', 'api']
                },
                "img-spy-material": {
                    name: "imgSpyMaterial",
                    namedExports: [
                        'WindowEvent', 'Fa', 'FixedTable', 'DirectoryPicker'
                    ]
                },
                "img-spy-navigation": {
                    name: "imgSpyNavigation",
                    namedExports: [
                        'navigateModule', 'navigateSelectors', 'Route', 
                        'LeftBar', 'Router', 'navigateUtils', 'Slider', 
                        'Slide', 
                    ]
                },
                "img-spy-resize": {
                    name: "imgSpyResize",
                    namedExports: ['resizeModule']
                },

                // React
                "react": {
                    name: "React",
                    namedExports: [
                        'useLayoutEffect', 'useEffect', 'useMemo', 'useContext',
                        'useReducer', 'useRef',
    
                        'Component', 'Children', 'PureComponent', 'PropTypes',
                        'createElement', 'Fragment', 'cloneElement', 'StrictMode',
                        'createFactory', 'createRef', 'createContext',
                        'isValidElement', 'isValidElementType',
                    ]
                },

                "react-dom": {
                    name: "ReactDom",
                    namedExports: [
                        'unstable_batchedUpdates',
                        'render', 'hydrate',
                    ]
                }
            }
        }),
        typescript({
            typescript: require('typescript'),
            objectHashIgnoreUnknownHack: true,
            tsconfig: path.resolve(opts.rootDir, 'tsconfig.json')
        }),
        resolve({
            jail: opts.globalSrc
        }),
        commonjs({
            include: [/node_modules/],
            extensions: ['.js', '.ts', '.tsx'],            
            namedExports: {
                'src/node_modules/react/index.js': [
                    'useLayoutEffect', 'useEffect', 'useMemo', 'useContext',
                    'useReducer', 'useRef',

                    'Component', 'Children', 'PureComponent', 'PropTypes',
                    'createElement', 'Fragment', 'cloneElement', 'StrictMode',
                    'createFactory', 'createRef', 'createContext',
                    'isValidElement', 'isValidElementType',
                ],
                'src/node_modules/react-is/index.js': [
                    'isValidElementType','isContextConsumer'
                ],
                'src/node_modules/react-dom/index.js': [
                    'unstable_batchedUpdates',
                    'render', 'hydrate',
                ],
            }
        }),
        electron({
            start: true,
            main: true,
            electronArgs: ['--remote-debugging-port=9223']
        }),
        silentCircular({
            exclude: /node_modules\/react-redux-form/
        }),
    ],
};
