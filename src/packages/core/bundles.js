

module.exports = {
    imgSpyBundleModules: {
        // ImgSpy
        "img-spy-core": {
            name: "imgSpyCore",
            namedExports: [                         
                'channels', 'buildMessageType', 'QueuedCluster',
                'reducerBuilder', 'environment', 'PluginLoader',
                'Sink', 'ReDuckModule', 'SimpleModule', 'FormModule', 
                'loadArgs', 'WorkerInfo', 'ResizeObservable', 'filter'
            ]
        },
        "img-spy-api": {
            name: "imgSpyApi",
            namedExports: ['apiQuery', 'api', 'api$', 'finalizeMap']
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
                'Slide',  'Tabs', 'Tab'
            ]
        },
        "img-spy-resize": {
            name: "imgSpyResize",
            namedExports: [
                'resizeModule', 'ResizePanel', 'ResizeModel',
                'resizeActions',
            ]
        },

        // React
        "react": {
            name: "React",
            namedExports: [
                'useLayoutEffect', 'useEffect', 'useMemo', 'useContext',
                'useReducer', 'useRef', 'memo',

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
        },

        "react-redux": {
            name: "ReactRedux",
            namedExports: [
                'connect', 'Provider'
            ]
        }
    }
}