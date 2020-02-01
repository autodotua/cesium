import defined from '../Core/defined.js';
import ScreenSpaceEventType from '../Core/ScreenSpaceEventType.js';
import Color from '../Core/Color.js';
import EllipsoidGeodesic from '../Core/EllipsoidGeodesic.js';
import Cartesian2 from '../Core/Cartesian2.js';
import Cartographic from '../Core/Cartographic.js';
import LabelStyle from '../Scene/LabelStyle.js';
import VerticalOrigin from '../Scene/VerticalOrigin.js';
import HeightReference from '../Scene/HeightReference.js';
import CallbackProperty from '../DataSources/CallbackProperty.js';
import ScreenSpaceEventHandler from '../Core/ScreenSpaceEventHandler.js';

var viewer;
/**
 * @alias Measurer
 * @constructor
 * @param viewer the viewer
 */
function Measurer(_viewer) {
    viewer = _viewer;
}

var PolyLinePrimitive = (function() {
    function _(positions) {
        this.options = {
            name: '直线',
            polyline: {
                show: true,
                positions: [],
                material: Color.CHARTREUSE,
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
        this.options.polyline.positions = new CallbackProperty(_update, false);
        viewer.entities.add(this.options);
    };

    return _;
})();

Measurer.prototype.measureLineSpace = function() {
    var handler = new ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    var positions = [];
    var poly = null;
    var distance = 0;
    var cartesian;
    var floatingPoint;

    //鼠标移动事件
    handler.setInputAction(function(movement) {

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
            if (!defined(poly)) {
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
    }, ScreenSpaceEventType.MOUSE_MOVE);

    //鼠标左键单击事件
    handler.setInputAction(function(movement) {
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
                color: Color.RED,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
                heightReference: HeightReference.NONE
            },
            label: {
                text: textDisance,
                font: '18px sans-serif',
                fillColor: Color.GOLD,
                style: LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                pixelOffset: new Cartesian2(20, -20),
                heightReference: HeightReference.NONE
            }
        });
    }, ScreenSpaceEventType.LEFT_CLICK);

    //鼠标左键双击事件
    handler.setInputAction(function(movement) {
        handler.destroy();//关闭事件句柄
        positions.pop();//最后一个点无效
        viewer.entities.remove(floatingPoint);

    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
};

//空间两点距离计算函数
function getSpaceDistance(positions) {
    var distance = 0;
    for (var i = 0; i < positions.length - 1; i++) {

        var point1cartographic = Cartographic.fromCartesian(positions[i]);
        var point2cartographic = Cartographic.fromCartesian(positions[i + 1]);
        /**根据经纬度计算出距离**/
        var geodesic = new EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;
        //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        distance = distance + s;
    }
    return distance.toFixed(2);
}

export default Measurer;
