import { createFilter } from 'rollup-pluginutils';
import { extname, basename, join } from 'path';
import * as fs from 'fs';


export default function nodeGyp ( options ) {
	if ( !options ) options = {};
    const filter = createFilter(options.include, options.exclude);
    const binaryDir = options.dir || "./bin";

	return {
        name: 'node-gyp',

        resolveAssetUrl(options) {
            if ( extname(options.moduleId) !== '.node') return null;
            return `require('${options.relativeAssetPath}')`;
        },

		load(id) {
            if ( !filter( id ) ) return null;
            if ( extname(id) !== '.node') return null;

            const fileName = basename(id);
            const filePath = join(binaryDir, fileName);

            const data = fs.readFileSync(id);
            const assetId = this.emitAsset(filePath, data);
            const code = `export default import.meta.ROLLUP_ASSET_URL_${assetId}.default;`;

            return {
                code,
                map: null
            };
        }
	};
}
