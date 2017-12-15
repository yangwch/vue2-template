
//样式
linkcss(scriptBaseDir + "css/map.css");
linkcss(scriptBaseDir + "css/animate.css");
linkcss(scriptBaseDir + "css/single.css");

//脚本
//第三方库
include(scriptBaseDir + "mxlib/jquery-1.11.2.min.js");
include(scriptBaseDir + "mxlib/snap.svg-min.js");
include(scriptBaseDir + "mxlib/paper-full.min.js");

//元图地图库
include(scriptBaseDir + "mxlib/api.min.js");
include(scriptBaseDir + "mxlib/Mapv.min.js");
include(scriptBaseDir + "mxlib/measure.js");

//二次开发入口文件 加载完成了dom后
domLoadedInclude(scriptBaseDir + "Main.js");