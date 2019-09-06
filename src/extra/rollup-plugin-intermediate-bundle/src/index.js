import { createFilter } from 'rollup-pluginutils';


const INTERMEDIATE_BUNDLE = "bundle-"

function intermediateBundleCreate(options) {
    if (!options || !options.name) throw new Error("Bundle name must be specified");

    // const filter = createFilter(options.include, options.exclude);
    // const bundleDir = options.dir || "./";
    const name = options.name;
    const input = `${INTERMEDIATE_BUNDLE}${name}`;
    const resolver = options.resolver;

    const source = Object.keys(options.modules).map(moduleName => {
        const moduleImport = options.modules[moduleName];
        return `
        import * as ${moduleName} from '${moduleImport}';
        export { ${moduleName} } ;
        `;
    }).join('\n');

	return {
        name: 'intermediate-bundle-create',

        options(inputOptions) {
            // Generate imports dynamically
            const newInputOptions = Object.assign({}, inputOptions, {
                input,
            });
            return newInputOptions;
        },

        resolveId(importee, importer) {
            if(importee === input) return importee;
            if(importee) {
                resolver.resolveId(importee, importer);
            }
            return null;
        },

        load(id) {
            console.log(id);
            if(id !== input) return null;
            // let code = `const module.exports = {};`
            

            return source;
        }
	};
}


function intermediateBundleUse(options) {
    if (!options || !options.path) throw new Error("Bundle name must be specified");

    // const filter = createFilter(options.include, options.exclude);
    // const bundleDir = options.dir || "./";
    const bundlePath = options.path;
    const modules = options.modules || {};

	return {
        name: 'intermediate-bundle-create',

        resolveId(importee, importer) {
            if(importee === bundlePath) {
                return false; // External
            }
            if(!modules[importee]) return null;
            return importee;
        },

        load(id) {
            if(!modules[id]) return null;

            return `
            const { ${modules[id].name} } = require('${bundlePath}');
            export default ${modules[id].name};
            ${modules[id].namedExports
                .map(named => `export const ${named} = ${modules[id].name}.${named};`).join('\n')}
            `;
        }
	};
}





export default {
    create: intermediateBundleCreate,
    use: intermediateBundleUse
};
