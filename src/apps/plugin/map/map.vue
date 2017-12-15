<!--
	@desc 元图地图组件
 -->
<template>
	 <div ref="mapdom" :class="className" :id="domId" style="position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;" param="tileUrl:googleSate;bounds:
67.5 0 157.5 67.5;maptype:google;backgroundColor:#F5F3F0;zoom:4;tileStretchPixel:2;sliceZoom:5;maxZoom:20;minZoom:1;fullZoom:20;mapTilesWidth:2048;mapTilesHeight:1536;errorImg:/static/js/webgis/mxImg/blank.png;mapTilesExtendPixel:300"></div>

</template>
<script>
import $ from "jquery";
import ytMapApi from "../../../../static/js/webgis/mxlib/api.min";
import "../../../../static/js/webgis/css/map.css";
export default {
  data() {
    /* 生成随机Id给dom */
    const domId =
      "map_" +
      new Date().getTime() +
      Math.random()
        .toString()
        .replace(/\./g, "x");
    return {
      /* domId */
      domId: domId,
      /* mxLib对象 */
      mxLib: null,
      /* map实例对象 */
      map: null,
      /* 地图默认选项 */
      defaultOption: {
        mapParams: {
          x: 125.30638850809298,
          y: 55.492890222253685,
          zoom: 9,
          maxZoom: 20,
          scriptBaseDir: "./static/js/webgis/",
          control: { enabled: true, position: 2 }
        },
        labelStyle: {
          background: "transparent",
          color: "#33ffbb",
          fontSize: "16px",
          border: "0px solid #ccc",
          height: "20px",
          lineHeight: "20px",
          fontFamily: "微软雅黑"
        },
        mapModel: "satellite"
      }
    };
  },
  props: {
    /** 绑定到地图dom上的class */
    className: {
      type: String
    },
    /** 地图加载默认参数 */
    option: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    /** 默认参数与opiton合并 */
    mapOption() {
      return Object.assign(this.defaultOption.mapParams, this.option);
    }
  },
  methods: {
    init() {
      var mxLib = (this.mxLib = ytMapApi),
        params = this.mapOption;
      var map = (this.map = new mxLib.Map(this.domId, params));
      /* 开启调试 */
      // map.debug(true);
      /* 设置中心点 */
      this.setCenter(params.x, params.y);
      /* 添加工具 */
      if (params.control.enabled) {
        // 地图缩放控件
        var ctl = new mxLib.NavigationControl();
        ctl.setOffset(new mxLib.Size(10, 50));
        ctl.setAnchor(
          params.control.position != null
            ? params.control.position
            : MX_ANCHOR_BOTTOM_RIGHT
        );
        ctl.showToast = true; // 拖动bar时显示缩放级别
        map.addControl(ctl);
      }
      this.$emit("ready", map);
    },
    /**
     * 获取地图实例
     *
     * @public
     * @param none
     * @returns {Object} map
     * */
    getMap() {
      return this.map;
    },
    /**
     * 设置缩放级别
     *
     * @public
     * @param {Number} zoom - 缩放级别
     * */
    setZoom(zoom) {
      this.map.setZoom(zoom);
    },
    /**
     * 设置地图中心点
     *
     * @public
     * @param {Number} x - 坐标x
     * @param {Number} y - 坐标y
     * @returns none
     * */
    setCenter(x, y) {
      this.map.setCenter(new this.mxLib.Point(x, y));
    },
    /**
     * 在地图上绑定点
     *
     * @public
     * @param {Number} x - 坐标x
     * @param {Number} y - 坐标y
           * @param {String} img - 图片路径
     * @param {String} lableName - 标签名
     * @param {Object} styleOptions - 标签样式
     * @returns {Object} marker
     * */
    bindPointToMap(x, y, img, lableName, styleOptions) {
      let point = new this.mxLib.Point(x, y);
      // 添加点
      var marker = this.addMarker(x, y, img, 40, 40);

      // 添加lable
      var lable = this.addLable(
        point,
        lableName,
        Object.assign(this.defaultOption.labelStyle, styleOptions || {})
      );
      marker.label = lable;
      return marker;
    },
    /**
     * 添加标记
     * */
    addMarker(x, y, icon, heigth, width) {
      var myIcon = this.markerIcon(icon, heigth, width);
      var point = new this.mxLib.Point(x, y);
      var marker = new this.mxLib.Marker(point, { icon: myIcon }); // 创建标注
      this.map.addOverlay(marker); // 将标注添加到地图中
      return marker;
    },
    markerIcon(url, height, width) {
      return new this.mxLib.Icon(url, new mxLib.Size(height, width));
    },
    // 添加lable
    addLable(position, lableName, labelStyle, offset, minZoom, maxZoom) {
      var px = 0;
      var llength = lableName.length / 2;
      var radix = 16;
      labelStyle = labelStyle || {};
      if (labelStyle["fontSize"]) {
        radix = parseInt(labelStyle["fontSize"]);
      }
      px = llength * radix;
      offset = offset || new this.mxLib.Size(-px, -42);
      var opts = {
        position: position,
        offset: offset,
        minZoom: minZoom,
        maxZoom: maxZoom
      };
      var label = new this.mxLib.Label(lableName, opts);

      label.setStyle(labelStyle);
      this.map.addOverlay(label);
      return label;
    },
    // 创建多边形
    addPolygon(spoints, options, autoHide) {
      let points = [];
      for (let i in spoints) {
        points.push(new this.mxLib.Point(spoints[i].x, spoints[i].y));
      }
      var polygon = new this.mxLib.Polygon(points, options); // 创建多边形
      this.map.addOverlay(polygon);
      if (autoHide) {
        polygon.addEventListener("onmouseover", function(e) {
          if (e.currentTarget) {
            e.currentTarget.setFillOpacity(0.6);
            polygon.setStrokeOpacity(0.6);
          }
        });
        polygon.addEventListener("onmouseout", function(e) {
          if (e.currentTarget) {
            e.currentTarget.setFillOpacity(0.0);
            polygon.setStrokeOpacity(0.0);
          }
        });
      }
    }
  }
};
</script>
