window.CESIUM_BASE_URL = '../../Source/';

import * as Cesium from '../../Source/Cesium.js';
import * as CFzExt from '../../Source/CesiumFzExtension.js';
import Measurer from '../../Source/FzExtension/Measurer.js';
var viewer;
var PolyLinePrimitive = (function() {
    function _(positions) {
        this.options = {
            name: '直线',
            polyline: {
                show: true,
                positions: [],
                material: Cesium.Color.CHARTREUSE,
                width: 2
            }
        };
        this.positions = positions;
        this._init();
    }

    _.prototype._init = function() {
        var _self = this;
        var _update = function() {
            return _self.positions;
        };
        //实时更新polyline.positions
        this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
        viewer.entities.add(this.options);
    };

    return _;
})();

var measureLineSpace = function(viewer) {
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    var positions = [];
    var poly = null;
    var tooltip = document.getElementById('toolTip');
    var distance = 0;
    var cartesian;
    var floatingPoint;
    tooltip.style.display = 'block';

    //鼠标移动事件
    handler.setInputAction(function(movement) {
        tooltip.style.left = movement.endPosition.x + 3 + 'px';
        tooltip.style.top = movement.endPosition.y - 25 + 'px';
        tooltip.innerHTML = '<p>单击开始，右击结束</p>';

        ///////=================================

        cartesian = viewer.scene.pickPosition(movement.endPosition);
        if (!cartesian) {
            cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (!cartesian) {
                //把光标移动到地球外面的时候，位置会返回空
                console.log('cartesian is undefined');
                return;
            }
        }
        /////==================================
        //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
        if (positions.length >= 2) {
            if (!Cesium.defined(poly)) {
                poly = new PolyLinePrimitive(positions);
            } else {
                positions.pop();
                // cartesian.y += (1 + Math.random());
                positions.push(cartesian);
            }
            distance = getSpaceDistance(positions);
            // console.log("distance: " + distance);
            // tooltip.innerHTML='<p>'+distance+'米</p>';
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //鼠标左键单击事件
    handler.setInputAction(function(movement) {
        tooltip.style.display = 'none';
        // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
        cartesian = viewer.scene.pickPosition(movement.position);
        if (!cartesian) {
            cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
            if (!cartesian) {
                //把光标移动到地球外面的时候，位置会返回空
                console.log('cartesian is undefined');
                return;
            }
        }
        if (positions.length === 0) {
            positions.push(cartesian.clone());
        }
        positions.push(cartesian);
        //在三维场景中添加Label
        // var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var textDisance = distance + '米';
        // console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
        floatingPoint = viewer.entities.add({
            name: '空间直线距离',
            // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
            position: positions[positions.length - 1],
            point: {
                pixelSize: 5,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                heightReference: Cesium.HeightReference.NONE
            },
            label: {
                text: textDisance,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
                heightReference: Cesium.HeightReference.NONE
            }
        });
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //鼠标左键双击事件
    handler.setInputAction(function(movement) {
        handler.destroy();//关闭事件句柄
        positions.pop();//最后一个点无效
        viewer.entities.remove(floatingPoint);
        tooltip.style.display = 'none';

    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

//空间两点距离计算函数
function getSpaceDistance(positions) {
    var distance = 0;
    for (var i = 0; i < positions.length - 1; i++) {

        var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
        /**根据经纬度计算出距离**/
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        distance = distance + s;
    }
    return distance.toFixed(2);
}

function main() {
    var czml = [{
        'id': 'document',
        'name': 'box',
        'version': '1.0'
    }, {
        'id': 'box1',
        'name': 'Blue box',
        'position': {
            'cartographicDegrees': [-114.0, 40.0, 300000.0]
        },
        'box': {
            'dimensions': {
                'cartesian': [400000.0, 300000.0, 500000.0]
            },
            'material': {
                'solidColor': {
                    'color': {
                        'rgba': [0, 0, 255, 255]
                    }
                }
            }
        }
    }, {
        'id': 'box2',
        'name': 'Red box with black outline',
        'position': {
            'cartographicDegrees': [-107.0, 40.0, 300000.0]
        },
        'box': {
            'dimensions': {
                'cartesian': [400000.0, 300000.0, 500000.0]
            },
            'material': {
                'solidColor': {
                    'color': {
                        'rgba': [255, 0, 0, 128]
                    }
                }
            },
            'outline': true,
            'outlineColor': {
                'rgba': [0, 0, 0, 255]
            }
        }
    }, {
        'id': 'box3',
        'name': 'Yellow box outline',
        'position': {
            'cartographicDegrees': [-100.0, 20.0, 300000.0]
        },
        'box': {
            'dimensions': {
                'cartesian': [400000.0, 300000.0, 500000.0]
            },
            'fill': false,
            'outline': true,
            'outlineColor': {
                'rgba': [255, 255, 0, 255]
            }
        }
    }, {
        'id': 'shape1',
        'name': 'Green circle at height',
        'position': {
            'cartographicDegrees': [-111.0, 50.0, 150000.0]
        },
        'ellipse': {
            'semiMinorAxis': 300000.0,
            'semiMajorAxis': 300000.0,
            'height': 200000.0,
            'material': {
                'solidColor': {
                    'color': {
                        'rgba': [0, 255, 0, 255]
                    }
                }
            }
        }
    }, {
        'id': 'shape2',
        'name': 'Red ellipse with white outline on surface',
        'position': {
            'cartographicDegrees': [-103.0, 40.0, 0]
        },
        'ellipse': {
            'semiMinorAxis': 250000.0,
            'semiMajorAxis': 400000.0,
            'height': 0,
            'material': {
                'solidColor': {
                    'color': {
                        'rgba': [255, 0, 0, 127]
                    }
                }
            },
            'outline': true, // height must be set for outlines to display
            'outlineColor': {
                'rgba': [255, 255, 255, 255]
            }
        }
    }, {
        'id': 'shape3',
        'name': 'Blue translucent, rotated, and extruded ellipse with outline',
        'position': {
            'cartographicDegrees': [-95.0, 40.0, 100000.0]
        },
        'ellipse': {
            'semiMinorAxis': 150000.0,
            'semiMajorAxis': 300000.0,
            'extrudedHeight': 200000.0,
            'rotation': 0.78539,
            'material': {
                'solidColor': {
                    'color': {
                        'rgba': [0, 0, 255, 127]
                    }
                }
            },
            'outline': true
        }
    }];

    viewer = new Cesium.Viewer('cesiumContainer', {
        // imageryProviderViewModels:null
        // sceneMode:Cesium.SceneMode.COLUMBUS_VIEW
    });
    var dataSourcePromise = Cesium.CzmlDataSource.load(czml);
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
 let m=  new Measurer(viewer);
m.measureLineSpace();
}

main();
