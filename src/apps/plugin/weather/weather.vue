<!-- 天气组件 -->
<template>
	<div class="right">
		<div class="aw-weather-info" @mouseenter.stop="showJumbotron=true" @mouseleave.stop ="showJumbotron=false">
			<p class="temp-line">
				<span class="aw-weather-city">{{weatherInfo.realtime.city_name}}</span>
				<span class="aw-weather-animate-icon">
					<span :class="classType_sm"></span>
				</span>
				<span class="aw-weather-currentTemp">
					<span class="aw-current-temp">{{weatherInfo.realtime.weather.temperature}}</span>
					<span class="aw-weather-current-unit">℃</span>
				</span>
			</p>
			<transition name="el-zoom-in-top">
				<div class="jumbotron" v-if="showJumbotron">
					<div>
						<div class="aw-weather-head">
							<div class="aw-weather-maininfo">
								<el-row :gutter="20">
									<el-col :span="12">
										<p class="temp-line">
											<span class="aw-weather-currentTemp">
												<span class="aw-current-temp">{{weatherInfo.realtime.weather.temperature}}</span>
												<span class="aw-weather-current-unit">℃</span>
											</span>
											<span class="aw-weather-animate-icon">
												<span :class="classType"></span>
											</span>
											<span class="aw-weather-currentWeather">{{weatherInfo.realtime.weather.info}}</span>
										</p>
									</el-col>
									<el-col :span="12">
										<div class="aw-weather-wind-info right">
											<div class="aw-weather-wind">
												<span>现在：</span>
												<span class="aw-weather-temp-range c-gap-right">{{weatherInfo.realtime.weather.temperature}}°C</span>
											</div>
											<div class="aw-weather-wind">
												<span class="aw-weather-wind-dir">{{weatherInfo.realtime.wind.direct}}</span>
												<span>{{weatherInfo.realtime.wind.power}}</span>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
							<div class="aw-weather-prompt">
								<span class="aw-weather-prompt-text" v-if="">{{weatherInfo.life.info.chuanyi[0]}},{{weatherInfo.life.info.chuanyi[1]}}</span>
							</div>
							<div class="c-row-tile detail">
								<div id="chart-6d" class="chart aw-weather-chart">
									<div class="canvas c-row">
										<svg version="1.2" baseProfile="tiny">
											<path class="path1" stroke="#e9e9e9" stroke-width="1" stroke-opacity="0.7" fill="none" :d="path1"></path>
											<circle :cx="allWeatherInfo[0].x" :cy="allWeatherInfo[0].yh" r="2.5" fill="#fff"></circle>
											<path class="path2" stroke="#e9e9e9" stroke-width="1" stroke-opacity="0.7" fill="none" :d="path2"></path>
											<circle :cx="allWeatherInfo[0].x" :cy="allWeatherInfo[0].yl" r="2.5" fill="#fff"></circle>
											<path class="path5" stroke-dasharray="4,4" stroke="#fff" stroke-width="1" fill="none" :d="path5" />
										</svg>
									 	<div class="c-span2 weather-bar"  v-for="(value, index) in allWeatherInfo" v-if="index<5" :class="{active:current == index}">
									 		<div class="weather-content">
									 			<div class="title c-gap-bottom" :class="{dim:index == 0}">
									 				<span class="value">{{value.week}}</span>
									 				<div class="weather-icons" :class="weatherIconSm(value.type)">
									 				</div>
									 			</div>
									 			<div class="aw-weather-canvas-area">
									 				<div class="pillar">
									 					<span class="pillar-max" :style="{top:calculateTxtHTop(value.yh, index)}">{{value.high}}°C</span>
									 					<span class="pillar-min" :style="{top:calculateTxtLTop(value.yl)}">{{value.low}}°C</span>
									 				</div>
									 			</div>
									 			<div class="c-gap-top-large wind">
									 				<span>{{value.wind}}</span>
									 				<div>{{value.windLeve}}</div>
									 			</div>
									 		</div>
									 	</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
	import {weatherType2Icon,weatherType2IconSm} from "./js/weathertype2icon";
	import {extend,quickSort,getSVGPathByCoordinate,addData,queryData} from "./js/common";
	import {getWeather} from '@/api/getData'
	// 曲线显示区域
	const HEIGHT = 173.50;
	// 最高温断点
	const BREAKPOINT_H = 77.20;
	// 最低温断点
	const BREAKPOINT_L = 152.00;
	// 最高温、最低温Y轴偏移
	const OFFSET_H_Y = 60;
	const OFFSET_L_Y = 60;
	export default {
		data() {
			return {
				showJumbotron:false,
				weatherInfo:{
					life:{
						date:'',
						info:{
							chuanyi:[],
							ganmao:[],
							kongtiao:[],
							yundong:[],
							ziwaixian:[],
						}
					},
					realtime:{
						city_name:'',
						date:'',
						moon:'',
						weather:{
							info:'',
							temperature:''
						},
						wind:{
							direct:'',
							power:''
						}
					},
					weather:[]
				},
				current: 1,     // 6天天气预测当前选择标志位
				path1: '',      // 曲线1
				path2: '',      // 曲线2
				path5: '',      // 虚线
			}
		},
		computed: {
			allWeatherInfo() {
				if (!this.weatherInfo.weather) return []
				// 拷贝对象修改
				let otherdays = []
				this.weatherInfo.weather.forEach((item) => {
					otherdays.push({
						high:item.info.day[2],
						low:item.info.night[2],
						type:item.info.day[1],
						wind:item.info.day[3],
						windLeve:item.info.day[4],
						week:item.week
					});
				})
				let offsetX = 45,
					path1 = [],
					path2 = [],
					yH = [],
					yL = [];
				// 提取数字
				for (let i = 0; i < otherdays.length; i++) {
					yH[i] = parseInt(otherdays[i].high.match(/-?[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0]);
					yL[i] = parseInt(otherdays[i].low.match(/-?[1-9](?:\d{0,2})(?:,\d{3})*|0/)[0]);
				}
				// 根据最高温、最低温求相应温度显示坐标系数
				let allTemp = quickSort(yH.concat(yL));
				let	max = allTemp[allTemp.length-1],
					min = allTemp[0],
					ratioH = Math.abs((BREAKPOINT_H + OFFSET_H_Y - HEIGHT)/ -max),
					ratioL = Math.abs((BREAKPOINT_L + OFFSET_L_Y - HEIGHT)/ -min);
				// 被除数为0出现无穷大情况
				if (ratioH == '-Infinity' || ratioH == 'Infinity') ratioH = 0;
				if (ratioL == '-Infinity' || ratioL == 'Infinity') ratioL = 0;
				// 系数过大显示不正常情况下，统一使用同一系数,保证最高温或最低温位置置于顶部、底部
				let offsetHY = OFFSET_H_Y, offsetLY = OFFSET_L_Y;
				if ((HEIGHT - max * ratioH - OFFSET_H_Y).toFixed(2) != BREAKPOINT_H) {
					// 最高温曲线显示不正常取最低温曲线系数
					ratioH = ratioL;
					offsetHY = HEIGHT - BREAKPOINT_H - max * ratioH;
				}
				if ((HEIGHT - min * ratioL - OFFSET_L_Y).toFixed(2) != BREAKPOINT_L) {
					// 最低温曲线显示不正常取最高温曲线系数
					ratioL = ratioH;
					offsetLY = HEIGHT - BREAKPOINT_L - min * ratioL;
				}
				// 采用跟最高温一样的系数，也可以不用
				ratioL = ratioH;
				// 计算，并将计算结果放入源数组对象中
				for (let i = 0, left = offsetX; i < otherdays.length; i++) {
					path1[i] = {};
					path2[i] = {};
					otherdays[i].high = yH[i];
					otherdays[i].low  = yL[i];
					// 根据温度换算坐标
					Object.defineProperty(otherdays[i], 'x', {value: left});
					path1[i].x = left;
					path2[i].x = left;
					Object.defineProperty(otherdays[i], 'yh', {value: HEIGHT - otherdays[i].high * ratioH - offsetHY});
					path1[i].y = otherdays[i].yh;
					Object.defineProperty(otherdays[i], 'yl', {value: HEIGHT - otherdays[i].low  * ratioL - offsetLY});
					path2[i].y = otherdays[i].yl;
					left += offsetX*2;
				}
				// 绘制两条条三次贝塞尔曲线
				this.path1 = getSVGPathByCoordinate(path1.slice(0));
				this.path2 = getSVGPathByCoordinate(path2.slice(0));
				// 虚线
				this.path5 = `M${path1[0].x},${path1[0].y} ${path1[0].x},${path2[0].y}`;
				return otherdays;
			},
			/*小图标*/
			classType_sm() {
				if (!this.weatherInfo.realtime) return;
				return weatherType2IconSm(this.weatherInfo.realtime.weather.info);
			},
			/*大图标*/
			classType() {
				if (!this.weatherInfo.realtime) return;
				return weatherType2Icon(this.weatherInfo.realtime.weather.info);
			},
		},
		created() {
			this.getWeather()
		},
		methods: {
			/*获取城市天气*/
			async getWeather() {
				await getWeather({
					cityName:'神木市'
				}).then(res=>{
					const result = JSON.parse(res.result)
					if(result&&result.result)
					this.weatherInfo = result.result
				})
			},
			/*最高温度位置*/
			calculateTxtHTop(top, index) {
				return index == 1 ? top-22+'px' : top<BREAKPOINT_H ? top+2+'px' : top-22+'px';
			},
			/*最低温度位置*/
			calculateTxtLTop(top) {
				return top>BREAKPOINT_L ? top-30+'px' : top-2+'px';
			},
			weatherIconSm(type) {
				return weatherType2IconSm(type);
			}
		}
	}
</script>
<style  lang="less" scoped>
	@import "./less/index";
	@shadow-1_5: 1.5px 1.5px 0 rgba(0,0,0,.23);
	@shadow-1: 1px 1px 0 rgba(0,0,0,.23);
	@duration: .3s;
	.icon-position (@left: 68px, @top: -98px) {
		left: @left;
		top: @top;
	}
	.aw-weather-info{
		cursor: pointer;
		position: relative;
		height: 35px;
		&>.temp-line{
			line-height: 28px;
			font-size: 14px;
			color: #fff;
			span{
				display: inline-block;
				&.aw-weather-animate-icon{
					vertical-align:middle;
					span{
						margin-top: 5px;
						font-size: 24px;
					}
					.icon-Sun{
						color:#ffd905
					}
				}
			}
		}
		.jumbotron{
			background-color:rgb(70, 136, 216,0.9);
			background-image:-webkit-linear-gradient(top, #3b83da, #6ec2ff);
			opacity: 0.9;
			width: 450px;
			border-radius: 0 0 10px 10px;
			box-shadow: @shadow-1_5;
			position: absolute;
			top:35px;
			right:-15px;
			padding:20px 0 0; 
			z-index: 10000000;
			&>div{
				color: #fff;
	    		padding: 0 15px 15px;
	    		position: relative;
	    		.aw-weather-maininfo{
					position: relative;
	    			.temp-line{
	    				position: relative;
	    				padding-top: 25px;
						.aw-weather-currentTemp{
							text-shadow: @shadow-1_5;
							position: relative;
							left: 10px;
							font-size:20px;
							bottom: 10px;
							font-family: 'HelveticaNeue-Thin';
							.aw-current-temp{
								font-family:  Ostrich Sans ;
								font-size: 80px;
								letter-spacing:0px;
							}
							.aw-weather-current-unit{
								text-shadow: @shadow-1;
								font-family:  Ostrich Sans ;
								position: absolute;
								top: -50px;
								font-size: 22px;
								font-weight: 100;
							}
						}
						.aw-weather-currentWeather{
							text-shadow: @shadow-1_5;
							position: relative;
							left: 70px;
							bottom: 10px;
							font-size: 24px;
							font-weight: lighter;
						}
						.aw-weather-animate-icon{
							margin-left: 40px;
							display: inline-block;
							transform:scale(.6);
							top: 10px;
							left: 10px;
							.sunny{
								.icon-position(50px, -120px);
							}
							.cloudy{
								.icon-position(40px, -98px);
							}
							.rainy{
								.icon-position(40px, -98px);
							}
							.rainbow{
								.icon-position(50px, -98px);
							}
							.starry{
								.icon-position(40px, 0);
							}
							.stormy{
								.icon-position(40px, -98px);
							}
							.snowy{
								.icon-position(40px, -98px);
							}
							.cloudy2sunny{
								.icon-position(18px, -110px);
							}
							.sandstorm{
								.icon-position(40px, -98px);
							}
						}
	    			}
	    			.aw-weather-wind-info{
	    				padding-top:25px;
						.aw-weather-wind{
							height: 26px;
							line-height: 26px;
						}
					}
	    		}
	    		.aw-weather-prompt{
	    			margin-top:10px;
	    			padding:5px;
	    			background: rgba(255, 255, 255, 0.1);
	    			border-radius:3px;
	    			overflow:hidden;
	    			line-height: 22px;
	    			font-size: 12px;
	    			.aw-weather-prompt-text{
	    				text-shadow:1px 1px 0 rgba(0, 0, 0, 0.23)
	    			}
	    		}
	    		/* 其他天 */
	    		.detail{
					background-color: hsla(0,0%,100%,.08);
					flex-grow: 1;
					display: flex;
					flex-direction: column;
					overflow-y: auto;
					.aw-weather-chart{
				        position: relative;
				        -webkit-tap-highlight-color: rgba(0,0,0,0);
				    }
				    .chart{
				        overflow: hidden;
				    }
				    #chart-6d {
        				.canvas{
            				position: relative;
           					padding: 0!important;
            				// 动画
            				.path1,.path2{
              					stroke-dasharray: 1000;
              					stroke-dashoffset: 1000;
              					animation: dash 10s linear 0s infinite;
							}
            				@-webkit-keyframes dash {
              					to {
                					stroke-dashoffset: 0;
              					}
            				}
            				@keyframes dash {
              					to {
                					stroke-dashoffset: 0;
          						}
        					}
        				}
        				.c-flexbox,.c-row {
						    width: auto;
						    display: box;
						    box-orient: horizontal;
						    box-direction: normal;
						    box-pack: justify;
						    box-align: stretch;
						    box-lines: single;
						    display: -webkit-box;
						    display: -ms-flexbox;
						    display: flex;
						    -webkit-box-orient: horizontal;
						    -webkit-box-direction: normal;
						    -ms-flex-direction: row;
						    flex-direction: row;
						    -webkit-box-pack: justify;
						    -ms-flex-pack: justify;
						    justify-content: space-between;
						    -webkit-box-align: stretch;
						    -ms-flex-align: stretch;
						    align-items: stretch;
						    -ms-flex-line-pack: start;
						    align-content: flex-start;
						    -ms-flex-wrap: nowrap;
						    flex-wrap: nowrap;
						}	
        				.c-row{
				            margin-left: 0;
				            margin-right: 0;
				            svg{
				                position: absolute;
				                left: 0;
				                top: 0;
				                width: 100%;
				                height: 100%;
				            }
				            .c-span2{
								width: 16.66666667%;
								box-flex: 2;
								-webkit-box-flex: 2;
								-ms-flex: 2 2 auto;
								flex: 2 2 auto;
				            }
       					 	.weather-bar{
                				padding: 10px 0;
                				overflow: hidden;
               				 	position: relative;
            					>.weather-content{
                   				 	border-right: 1px solid hsla(0,0%,100%, .12);
                					.title{
                    					padding: 0!important;
                        				text-align: center;
                       			 		color: #fff;
	                        			.day{
	                           		 		display: inline-block;
	                            			line-height: 22px;
	                    				}
				                        .weather-icons{
				                            font-size: 26px;
				                            &.icon-Sun{
				                                color: #ffd905;
				                            }
				                        }
                    				}
				                    .dim{
				                        color: hsla(0,0%,100%, .5);
				                    }
				                    .aw-weather-canvas-area{
				                        // position: relative;
				                        height: 100px;
				                        .pillar{
				                            width: 100%;
				                            // position: absolute;
				                            text-align: center;
				                            color: #fff;
				                            span{
				                                font-size: 14px;
				                                display: inline-block;
				                                line-height: 21px;
				                                position: absolute;
				                                left: 0;
				                                right: 0;
				                            }
				                            .pillar-max{
				                            	top:60px;
				                                margin-bottom: 6px;
				                            }
				                            .pillar-min{
				                            	top:45px;
				                                margin-top: 6px;
				                            }
				                        }
	                    			}
				                    .wind{
				                        color: #fff;
				                        font-size: 12px;
				                        text-align: center;
				                        line-height: 16px;
				                        padding: 0!important;
				                    }
				                }
                			}
			                &.active {
			                    background-image: linear-gradient(180deg,transparent,rgba(0,0,0,.1))
			                }
            			}
        			}
	    		}
			}
		}
	}
</style>