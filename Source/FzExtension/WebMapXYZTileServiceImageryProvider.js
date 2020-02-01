import defaultValue from '../Core/defaultValue.js';
import defined from '../Core/defined.js';
import DeveloperError from '../Core/DeveloperError.js';
import WebMapTileServiceImageryProvider from '../Scene/WebMapTileServiceImageryProvider.js';

/**
 * @alias WebMapXYZTileServiceImageryProvider
 * @constructor
 * @param {url} options The base URL for the WMTS GetTile operation (for KVP-encoded requests) or the tile-URL template (for RESTful requests). The tile-URL template should contain the following variables: &#123;style&#125;, &#123;TileMatrixSet&#125;, &#123;TileMatrix&#125;, &#123;TileRow&#125;, &#123;TileCol&#125;. The first two are optional if actual values are hardcoded or not required by the server. The &#123;s&#125; keyword may be used to specify subdomains.
 */
function WebMapXYZTileServiceImageryProvider(options) {
    if (!defined(options.url)) {
        throw new DeveloperError('options.url is required.');
    }
    let url = options.url.replace('{x}', '{TileCol}').replace('{y}', '{TileRow}').replace('{z}', '{TileMatrix}');
    let provider = new WebMapTileServiceImageryProvider({
        url: url,
        layer: 'tile',
        style: 'default',
        format: options.format,
        tileMatrixSetID: ''
    });
    return provider;
}

export default WebMapXYZTileServiceImageryProvider;
