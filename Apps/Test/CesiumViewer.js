window.CESIUM_BASE_URL = '../../Source/';

import * as Cesium from '../../Source/Cesium.js';
import * as CFzExt from '../../Source/CesiumFzExtension.js';
import Measurer from '../../Source/FzExtension/Measurer.js';

function main() {
    // var czml = [{
    //     'id': 'document',
    //     'name': 'box',
    //     'version': '1.0'
    // }, {
    //     'id': 'box1',
    //     'name': 'Blue box',
    //     'position': {
    //         'cartographicDegrees': [-114.0, 40.0, 300000.0]
    //     },
    //     'box': {
    //         'dimensions': {
    //             'cartesian': [400000.0, 300000.0, 500000.0]
    //         },
    //         'material': {
    //             'solidColor': {
    //                 'color': {
    //                     'rgba': [0, 0, 255, 255]
    //                 }
    //             }
    //         }
    //     }
    // }, {
    //     'id': 'box2',
    //     'name': 'Red box with black outline',
    //     'position': {
    //         'cartographicDegrees': [-107.0, 40.0, 300000.0]
    //     },
    //     'box': {
    //         'dimensions': {
    //             'cartesian': [400000.0, 300000.0, 500000.0]
    //         },
    //         'material': {
    //             'solidColor': {
    //                 'color': {
    //                     'rgba': [255, 0, 0, 128]
    //                 }
    //             }
    //         },
    //         'outline': true,
    //         'outlineColor': {
    //             'rgba': [0, 0, 0, 255]
    //         }
    //     }
    // }, {
    //     'id': 'box3',
    //     'name': 'Yellow box outline',
    //     'position': {
    //         'cartographicDegrees': [-100.0, 20.0, 300000.0]
    //     },
    //     'box': {
    //         'dimensions': {
    //             'cartesian': [400000.0, 300000.0, 500000.0]
    //         },
    //         'fill': false,
    //         'outline': true,
    //         'outlineColor': {
    //             'rgba': [255, 255, 0, 255]
    //         }
    //     }
    // }, {
    //     'id': 'shape1',
    //     'name': 'Green circle at height',
    //     'position': {
    //         'cartographicDegrees': [-111.0, 50.0, 150000.0]
    //     },
    //     'ellipse': {
    //         'semiMinorAxis': 300000.0,
    //         'semiMajorAxis': 300000.0,
    //         'height': 200000.0,
    //         'material': {
    //             'solidColor': {
    //                 'color': {
    //                     'rgba': [0, 255, 0, 255]
    //                 }
    //             }
    //         }
    //     }
    // }, {
    //     'id': 'shape2',
    //     'name': 'Red ellipse with white outline on surface',
    //     'position': {
    //         'cartographicDegrees': [-103.0, 40.0, 0]
    //     },
    //     'ellipse': {
    //         'semiMinorAxis': 250000.0,
    //         'semiMajorAxis': 400000.0,
    //         'height': 0,
    //         'material': {
    //             'solidColor': {
    //                 'color': {
    //                     'rgba': [255, 0, 0, 127]
    //                 }
    //             }
    //         },
    //         'outline': true, // height must be set for outlines to display
    //         'outlineColor': {
    //             'rgba': [255, 255, 255, 255]
    //         }
    //     }
    // }, {
    //     'id': 'shape3',
    //     'name': 'Blue translucent, rotated, and extruded ellipse with outline',
    //     'position': {
    //         'cartographicDegrees': [-95.0, 40.0, 100000.0]
    //     },
    //     'ellipse': {
    //         'semiMinorAxis': 150000.0,
    //         'semiMajorAxis': 300000.0,
    //         'extrudedHeight': 200000.0,
    //         'rotation': 0.78539,
    //         'material': {
    //             'solidColor': {
    //                 'color': {
    //                     'rgba': [0, 0, 255, 127]
    //                 }
    //             }
    //         },
    //         'outline': true
    //     }
    // }];

   let viewer = new Cesium.Viewer('cesiumContainer', {
        // imageryProviderViewModels:null
        // sceneMode:Cesium.SceneMode.COLUMBUS_VIEW
    });
    // var dataSourcePromise = Cesium.CzmlDataSource.load(czml);
    viewer.imageryLayers.addImageryProvider(new CFzExt.WebMapXYZTileServiceImageryProvider({
        url: 'https://mt1.google.cn/vt/lyrs=s&x={x}&y={y}&z={z}',
    }));
    // let xyz=new CFzExt.WebMapXYZTileServiceImageryProvider({
    //     url:'http://ditu.zj.cn//services/wmts/imgmap_60s/default/esritilematirx/{z}/{y}/{x}',
    //     minimumLevel:8
    // });
    // viewer.imageryLayers.addImageryProvider(xyz);
    // var wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    //     url: 'http://192.168.16.100:8080/geoserver/cite/wms',
    //     layers: 'cite:bou2_4p',
    //     width: 256,
    //     height: 256,
    //     parameters: {
    //         transparent: true,     //是否透明
    //         format: 'image/png',
    //         srs: 'EPSG:4326'
    //     }
    // });
    // viewer.imageryLayers.addImageryProvider(wmsImageryProvider);
    // viewer.dataSources.add(dataSourcePromise);
    // viewer.zoomTo(dataSourcePromise);
    var tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
    });

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);
    let m = new Measurer(viewer);

    m.measure2DArea();
}

main();
