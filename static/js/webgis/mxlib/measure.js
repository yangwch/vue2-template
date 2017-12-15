/**
* @fileoverview 测量命令定义(距离测量和面积测量)
* @author Metamap Map Api Group
*/

var DistanceMeasureCmd =
/**
* 距离测量类构造函数
* @param  {String} name 命令名称 
* @param  {Command} parentCmd 调用命令对象 
* @param  {Json Object} opts 命令选项
* @constructor
*/
mxLib.DistanceMeasureCmd = function DistanceMeasureCmd(name, parentCmd, opts) {
    mxLib.Command.prototype.constructor.call(this, name, parentCmd, opts);
    this.polyline = {};
    this.points = [];
    this.secPoints = [];
    this.formatText = [];
    this.formatTip = {};
    this.closeBtn = {};
    this._styles = {
        "mxLib_diso": "height:17px;width:5px;position:absolute;background:url(" + scriptBaseDir + "mxImg/dis_box_01.gif) no-repeat left top"
    , "mxLib_disi": "color:#7a7a7a;position:absolute;left:5px;padding:0 4px 1px 0;line-height:17px;background:url(" + scriptBaseDir + "mxImg/dis_box_01.gif) no-repeat right top"
    };
}

//继承自Command类
mxLib.Lang.inherits(DistanceMeasureCmd, mxLib.Command);

/**
* 抽象方法，开始命令
* @param {Map} map 地图对象
* @returns {None} 
*/
DistanceMeasureCmd.prototype.start = function (map) {
    //调用基类的方法
    mxLib.Command.prototype.start.call(this, map);

    //设置鼠标样式
    var cur = scriptBaseDir + "mxImg/ruler.png";
    var csr = /webkit/.test(navigator.userAgent.toLowerCase()) ?
        "url(" + cur + ") 3 6, crosshair" :
        "url(" + cur + "), crosshair"
    map.setCursor(csr);

    //提示框
    var point = map.getCenter();
    var opts = {
        position: point,
        offset: new mxLib.Size(14, 16)
    }
    var label = new mxLib.Label("", opts);
    label.setStyle({
        color: "#333",
        border: 'solid 1px #ff0103',
        fontSize: "12px",
        background: 'white',
        fontFamily: "arial"
    });
    map.addOverlay(label);
    this.formatTip = label;
    this.formatTip.hide();
}

/**
* 抽象方法，左键抬起事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
DistanceMeasureCmd.prototype.leftMouseup = function (e, data) {
    var point = mxLib.Util.getEventPoint(this.map, e);

    //添加节点
    _addDistSecPoint(this,point);

    //画多段线
    if (this.points.length == 0) {
        this.points.push(point);
        this.points.push(point);
        var polyline = new mxLib.Polyline(this.points, { strokeColor: '#ff6319', strokeWidth: 2, strokeOpacity: 0.8, enableClicking: false });
        this.map.addOverlay(polyline);
        this.polyline = polyline;

        _formatDistText(this, '起点', point);
    }
    else {
        this.polyline.setPositionAt(this.points.length - 1, point);
        this.points.push(point);

        var ptStart, ptEnd;
        if (map.mapModel.config["isTrans"]) {
            ptStart = window.layerTrans.ytTocadPoint(this.points[this.points.length - 3]);
            ptEnd = window.layerTrans.ytTocadPoint(this.points[this.points.length - 1]);
        }

        //计算距离
        var dist = map.getDistance(ptStart, ptEnd);
        dist = dist.toFixed(0).toString() + "米";

        //显示距离提示框
        _formatDistText(this, dist, this.points[this.points.length - 1]);
    }
}

/**
* 计算两点之间的距离并显示出来
*/
function _formatDistText(self, disText, point) {
    var opt = {
        position:point,
        offset: new mxLib.Size(10, -5)
    }
    var disLabel = new mxLib.Label(disText, opt);
    disLabel.setStyle({ color: "#333", borderColor: "#ff0103","border": "none", "padding": "0" });
    disLabel.setContent("<span style='" + self._styles.mxLib_diso + "'><span style='" + self._styles.mxLib_disi + "'>" + disText + "</span></span>");

    map.addOverlay(disLabel);
    self.formatText.push(disLabel);
}

/**
* 计算总距离并显示出来
*/
function _formatDistTip(self, type, point) {
    if (self.points.length == 0) {
        var strContent = "单击确定起点,右键取消";
        if (self.formatTip) {
            self.formatTip.show();
            self.formatTip.setPosition(point);
            self.formatTip.setContent(strContent);
        }
    } else {
        var totalDist = 0;;
        for (var i = 0; i < self.points.length; i++) {
            if (i == self.points.length - 1)
                break;

            //获取距离
            var ptStart, ptEnd;
            if (map.mapModel.config["isTrans"]) {
                ptStart = window.layerTrans.ytTocadPoint(self.points[i]);
                ptEnd = window.layerTrans.ytTocadPoint(self.points[i + 1]);
            }

            var dist = map.getDistance(ptStart, ptEnd);
            totalDist += parseInt(dist.toFixed(0));
        }
        
        var htmls = [];
        if (type == 1) {
            htmls.push("<span>总长：<span style='color:#ff6319;font-weight:bold'>" + totalDist + "</span>米</span><br/>");
            htmls.push("<span style='color:#7a7a7a'>单击确定地点,双击结束</span>");
        } else {
            self.formatTip.setOffset(new mxLib.Size(0, -33));
            htmls.push("总长：<span style='color:#ff6319;font-weight:bold'>" + totalDist + "</span>" + '米');
        }

        if (self.formatTip) {
            self.formatTip.setStyle({ "lineHeight": "16px", "zIndex": "85", "padding": "3px 5px" });
            self.formatTip.show();
            self.formatTip.setPosition(point);
            self.formatTip.setContent(htmls.join(""));
        }
    }
}

/**
* 添加节点
*/
function _addDistSecPoint(self, point) {

    //添加节点
    var ico = new mxLib.Icon(scriptBaseDir + "mxImg/rulerCtrl.png", new mxLib.Size(11, 11), { imageOffset: new mxLib.Size(-0, -0) });
    var secPt = new mxLib.Marker(point, {
        icon: ico,
        enableClicking: false,
    });
    self.map.addOverlay(secPt);
    self.secPoints.push(secPt);
}

/**
* 添加关闭按钮
*/
function _addDistColseBtn(self) {

    var lstPx = self.map.pointToPixel(self.points[self.points.length - 1]);
    var prePx = self.map.pointToPixel(self.points[self.points.length - 2]);
    var btnOffset = [0, 0];
    var disOffset = [0, 0];
    if (lstPx.y - prePx.y >= 0) {
        disOffset = [-5, 11];
    } else {
        disOffset = [-5, -35];
    }
    if (lstPx.x - prePx.x >= 0) {
        btnOffset = [14, 0];
    } else {
        btnOffset = [-14, 0];
    }

    var bico = new mxLib.Icon(scriptBaseDir + "mxImg/mapctrls.gif", new mxLib.Size(12, 12), { imageOffset: new mxLib.Size(0, -14) });
    var closeBtn = new mxLib.Marker(self.points[self.points.length - 1],
        {
            icon: bico,
            offset: new mxLib.Size(btnOffset[0], btnOffset[1])
        }
    );

    //添加点击事件
    self.closeBtn = closeBtn;
    self.map.addOverlay(closeBtn);
    closeBtn.addEventListener("click", function (e) {
        _distClear(self);
    });
}

/**
* 清空覆盖物
*/
function _distClear(self) {
    var me = self;

    //删除节点
    for (var i = 0; i < me.secPoints.length; i++) {
        var secPoint = me.secPoints[i];
        if (!$.isEmptyObject(secPoint)) {
            me.map.removeOverlay(secPoint);
        }
    }

    //删除提示
    for (var i = 0; i < me.formatText.length; i++) {
        var formatext = me.formatText[i];
        if (!$.isEmptyObject(formatext)) {
            me.map.removeOverlay(formatext);
        }
    }

    //清空覆盖物
    me.map.removeOverlay(me.polyline);
    me.map.removeOverlay(me.formatTip);
    me.map.removeOverlay(me.closeBtn);
}

/**
* 清空覆盖物
*/
function _clear(self) {
    var me = self;

    //删除节点
    for (var i = 0; i < me.secPoints.length; i++) {
        var secPoint = me.secPoints[i];
        if (!$.isEmptyObject(secPoint)) {
            me.map.removeOverlay(secPoint);
        }
    }

    //清空覆盖物
    me.map.removeOverlay(me.polygon);
    me.map.removeOverlay(me.formatTip);
    me.map.removeOverlay(me.closeBtn);
}

/**
* 清空最后一个提示
*/
function _distClose(self) {
    var distObj1 = self.formatText[self.formatText.length - 1];
    var distObj2 = self.formatText[self.formatText.length - 2];
    if (distObj1 && distObj2) {
        map.removeOverlay(distObj1);
        map.removeOverlay(distObj2);
    }
}

/**
* 抽象方法，右键抬起事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
DistanceMeasureCmd.prototype.rightMouseup = function (e, data) {
    this.map.showContextMenu(e);

    if (this.points.length == 0) {
        if (this.formatTip) {
            map.removeOverlay(this.formatTip);
        }
        this.end(true);
    } else {
        var points = this.polyline.getPath();
        if (points.length >= 3) {
            points.pop();
            this.polyline.setPath(points);
        }

        //清空
        if (this.formatText.length > 1) {
            map.removeOverlay(this.formatText[this.formatText.length - 1]);
            this.formatText.pop();
        }
        if (this.secPoints.length > 1) {
            map.removeOverlay(this.secPoints[this.secPoints.length - 1]);
            this.secPoints.pop();
        }
    }
}

/**
* 抽象方法，双击事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
DistanceMeasureCmd.prototype.dblclick = function (e, data) {
    var point = mxLib.Util.getEventPoint(this.map, e);

    //关闭
    var self = this;
    setTimeout(function () {     
        _distClose(self);
    }, 50);

    //添加关闭按钮
    _addDistColseBtn(this);

    //更新提示
    _formatDistTip(this, 2, point);

    this.points.pop();
    this.points.pop();

    //结束命令
    this.end(true);
}

/**
* 抽象方法，鼠标移动事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
DistanceMeasureCmd.prototype.mousemove = function (e, data) {
    var point = mxLib.Util.getEventPoint(this.map, e);

    //设置点坐标
    if (this.points.length > 0) {
        this.polyline.setPositionAt(this.polyline.getPath().length - 1, point);
    }

    //提示
    _formatDistTip(this, 1, point);
}

/**
* 抽象方法，结束命令
* @param {Boolean} bCancel 是否取消
* @returns {None} 
*/
DistanceMeasureCmd.prototype.end = function (bCancel) {
    this.map.removeContextMenu(this.contextMenu);
    this.map.removeOverlay(this.label);

    mxLib.Command.prototype.end.call(this, bCancel);
}

var AreaMeasureCmd =
/**
* 面积测量类构造函数
* @param  {String} name 命令名称 
* @param  {Command} parentCmd 调用命令对象 
* @param  {Json Object} opts 命令选项
* @constructor
*/
mxLib.AreaMeasureCmd = function AreaMeasureCmd(name, parentCmd, opts) {
    mxLib.Command.prototype.constructor.call(this, name, parentCmd, opts);
    this.polygon = {};
    this.points = [];
    this.secPoints = [];
    this.formatTip = {};
    this.closeBtn = {};
    this._styles = {
        "mxLib_diso": "height:17px;width:5px;position:absolute;background:url(" + scriptBaseDir + "mxImg/dis_box_01.gif) no-repeat left top"
    , "mxLib_disi": "color:#7a7a7a;position:absolute;left:5px;padding:0 4px 1px 0;line-height:17px;background:url(" + scriptBaseDir + "mxImg/dis_box_01.gif) no-repeat right top"
    };
}

//继承自Command类
mxLib.Lang.inherits(AreaMeasureCmd, mxLib.Command);

/**
* 抽象方法，开始命令
* @param {Map} map 地图对象
* @returns {None} 
*/
AreaMeasureCmd.prototype.start = function (map) {
    //调用基类的方法
    mxLib.Command.prototype.start.call(this, map);

    //设置鼠标样式
    var cur = scriptBaseDir + "mxImg/ruler.png";
    var csr = /webkit/.test(navigator.userAgent.toLowerCase()) ?
        "url(" + cur + ") 3 6, crosshair" :
        "url(" + cur + "), crosshair"
    map.setCursor(csr);

    //提示框
    var point = map.getCenter();
    var opts = {
        position: point,
        offset: new mxLib.Size(14, 16)
    }
    var label = new mxLib.Label("", opts);
    label.setStyle({
        color: "#333",
        border: 'solid 1px #ff0103',
        fontSize: "12px",
        background: 'white',
        fontFamily: "arial"
    });
    map.addOverlay(label);
    this.formatTip = label;
    this.formatTip.hide();
}

/**
* 抽象方法，左键抬起事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
AreaMeasureCmd.prototype.leftMouseup = function (e, data) {
    var point = mxLib.Util.getEventPoint(this.map, e);

    //添加节点
    _addArea_SecPoint(this, point);

    //画多段线
    if (this.points.length == 0) {
        this.points.push(point);
        this.points.push(point);

        var polygon = new mxLib.Polygon(this.points, { strokeColor: "#ff6319", fillColor: "#FFEC8B", strokeWidth: 3, strokeOpacity: 0.8, enableClicking: false });

        this.map.addOverlay(polygon);
        this.polygon = polygon;
    }
    else {
        this.polygon.setPositionAt(this.points.length - 1, point);
        this.points.push(point);
    }
}

/**
* 更新label的距离
*/
function _cal_Area(self) {
    var point_num = self.points.length;
    if (point_num < 3)
        return 0.0;

    //如果叠加
    var points = [];
    for (var i = 0; i < self.points.length; i++) {
        var point = self.points[i];
        points.push(point);
    }

    var area = points[0].y * (points[point_num - 1].x - points[1].x);
    for (var i = 1; i < point_num; ++i) {
        area += points[i].y * (points[i - 1].x - points[(i + 1) % point_num].x);
    }

    var str = Math.abs(area / 2.0).toFixed(2);
    return str;
}

/**
* 计算总距离并显示出来
*/
function _format_AreaTip(self, type, point) {
    if (self.points.length == 0) {
        var strContent = "单击确定起点,右键取消";
        if (self.formatTip) {
            self.formatTip.show();
            self.formatTip.setPosition(point);
            self.formatTip.setContent(strContent);
        }
    } else {
  
        //计算面积
        var strArea = _cal_Area(self);

        var htmls = [];
        if (type == 1) {
            htmls.push("<span>面积：<span style='color:#ff6319;font-weight:bold'>" + strArea + "</span>平方米</span><br/>");
            htmls.push("<span style='color:#7a7a7a'>单击确定地点,双击结束</span>");
        } else {
            self.formatTip.setOffset(new mxLib.Size(0, -33));
            htmls.push("总面积：<span style='color:#ff6319;font-weight:bold'>" + strArea + "</span>" + '平方米');
        }

        if (self.formatTip) {
            self.formatTip.setStyle({ "lineHeight": "16px", "zIndex": "85", "padding": "3px 5px" });
            self.formatTip.show();
            self.formatTip.setPosition(point);
            self.formatTip.setContent(htmls.join(""));
        }
    }
}

/**
* 添加节点
*/
function _addArea_SecPoint(self, point) {

    //添加节点
    var ico = new mxLib.Icon(scriptBaseDir + "mxImg/rulerCtrl.png", new mxLib.Size(11, 11), { imageOffset: new mxLib.Size(-0, -0) });
    var secPt = new mxLib.Marker(point, {
        icon: ico,
        enableClicking: false,
    });
    self.map.addOverlay(secPt);
    self.secPoints.push(secPt);
}

/**
* 添加关闭按钮
*/
function _addArea_ColseBtn(self) {

    var lstPx = self.map.pointToPixel(self.points[self.points.length - 1]);
    var prePx = self.map.pointToPixel(self.points[self.points.length - 2]);
    var btnOffset = [0, 0];
    var disOffset = [0, 0];
    if (lstPx.y - prePx.y >= 0) {
        disOffset = [-5, 11];
    } else {
        disOffset = [-5, -35];
    }
    if (lstPx.x - prePx.x >= 0) {
        btnOffset = [14, 0];
    } else {
        btnOffset = [-14, 0];
    }

    var bico = new mxLib.Icon(scriptBaseDir + "mxImg/mapctrls.gif", new mxLib.Size(12, 12), { imageOffset: new mxLib.Size(0, -14) });
    var closeBtn = new mxLib.Marker(self.points[self.points.length - 1],
        {
            icon: bico,
            offset: new mxLib.Size(btnOffset[0], btnOffset[1])
        }
    );

    //添加点击事件
    self.closeBtn = closeBtn;
    self.map.addOverlay(closeBtn);
    closeBtn.addEventListener("click", function (e) {
        _area_Clear(self);
    });
}

/**
* 清空覆盖物
*/
function _area_Clear(self) {
    var me = self;

    //删除节点
    for (var i = 0; i < me.secPoints.length; i++) {
        var secPoint = me.secPoints[i];
        if (!$.isEmptyObject(secPoint)) {
            me.map.removeOverlay(secPoint);
        }
    }

    //清空覆盖物
    me.map.removeOverlay(me.polygon);
    me.map.removeOverlay(me.formatTip);
    me.map.removeOverlay(me.closeBtn);
}

/**
* 抽象方法，右键抬起事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
AreaMeasureCmd.prototype.rightMouseup = function (e, data) {
    this.map.showContextMenu(e);

    if (this.points.length == 0) {
        if (this.formatTip) {
            map.removeOverlay(this.formatTip);
        }
        this.end(true);
    } else {
        var points = this.polygon.getPath();
        if (points.length > 2) {
            points.pop();
        } else if (points.length == 2) {
            points.pop();
            points.pop();
        }

        this.polygon.setPath(points);
    }

    //删除节点
    if (this.secPoints.length >= 1) {
        map.removeOverlay(this.secPoints[this.secPoints.length - 1]);
        this.secPoints.pop();
    }
}

/**
* 抽象方法，双击事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
AreaMeasureCmd.prototype.dblclick = function (e, data) {
    var point = mxLib.Util.getEventPoint(this.map, e);

    //添加关闭按钮
    _addArea_ColseBtn(this);

    //更新提示
    _format_AreaTip(this, 2, point);

    this.points.pop();
    this.points.pop();

    //结束命令
    this.end(true);
}

/**
* 抽象方法，鼠标移动事件
* @param {Object} e 事件
* @param {Object} data 事件参数
* @returns {None} 
*/
AreaMeasureCmd.prototype.mousemove = function (e, data) {
    var point = mxLib.Util.getEventPoint(this.map, e);

    //设置点坐标
    if (this.points.length > 0) {
        this.polygon.setPositionAt(this.polygon.getPath().length - 1, point);
    }

    //提示
    _format_AreaTip(this, 1, point);
}

/**
* 抽象方法，结束命令
* @param {Boolean} bCancel 是否取消
* @returns {None} 
*/
AreaMeasureCmd.prototype.end = function (bCancel) {
    this.map.removeContextMenu(this.contextMenu);

    mxLib.Command.prototype.end.call(this, bCancel);
}