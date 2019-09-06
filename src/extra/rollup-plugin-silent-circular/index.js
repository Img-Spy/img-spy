module.exports = function(pluginOptions) {
    pluginOptions = pluginOptions || {};

    const { createFilter } = require("rollup-pluginutils");
    const include = pluginOptions.include || "";
    const exclude = pluginOptions.exclude || "";
    const filter = createFilter(exclude, include);
    const plugin = {
        name: "warning resolver",
        options(inputOptions) {
            const onwarn = inputOptions.onwarn;
            inputOptions.onwarn = (warning, warn) => {
                if(warning.code === 'CIRCULAR_DEPENDENCY' && filter(warning.importer)) {
                    return;
                }

                if(onwarn) onwarn(warning, warn);
            };

            return inputOptions;
        }
    };
    return plugin;
};
