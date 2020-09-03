<template>
	<view class="app">
		<view class="tab">
			<u-tabs class="dx" :list="list" inactive-color='black' active-color='black' :is-scroll="false" :current="currents"
			 @change="change"></u-tabs>
		</view>
		<view class="card">
			<view class="centr">
				<view class="mx" v-for="(item,index) in srlist" :key='index'>
					<view class="head">
						<view class="yfk">
							<view :class="[item.ztbz==1?'onees':item.ztbz==2?'towes':item.ztbz==3?'treees':item.ztbz==0?'forses':'']">
								{{item.ztbz|types}}
							</view>
							<text>
								 {{item.SM}}
							</text>
						</view>
						<view class="zftime">
							<view>
								创建时间 :{{item.xsrq}} {{item.xssj}}
							</view>
							<text>
								洪湾渔港
							</text>
						</view>
					</view>
					<view class="center" v-for="(ite,ind) in item.xsMxList" :key='ind'>
						<view class="img">
							
							<image :src="ite.avatar?ite.avatar:'../../static/image/yut.png'" mode=""></image>
						</view>
						<view class="centerbox">
							<view>
								{{ite.SPMC}}
							</view>
							<view class="centerfoot">
								<view class="numje">
									{{ite.XSSL}}{{ite.JLDW}}
								</view>
								<text>¥{{ite.ZKJE}}</text>
							</view>

						</view>
					</view>
					<view class="foot">
						<view class="heji">
							共{{item.xsMxList.length}}件商品
						</view>
						<view class="hejibox">
							<view class="hjjq">
								合计 :
							</view>
							<view class="jes">
								<view class="fh">
									¥
								</view>
								<text class="bw">
									{{item.xsze}}

								</text>
								<view class="bw">
									<!-- .{{item.cuiend}} -->
								</view>
							</view>
						</view>
					</view>
				</view>


				<view class="asdimg" v-if="showwu">
					<image src="../../static/image/qs.png" mode=""></image>
					<view>
						暂无订单
					</view>
					<text>快去选购吧 !</text>
				</view>
			</view>
		</view>
		<u-loadmore v-if="status=='nomore'?false:true" :is-dot='true' :status="status" />
	</view>
</template>

<script>
	import homeApi from '../../api/home.js'
	export default {
		data() {
			return {
				status: 'loadmore',
				zt:null,
				current: 1,
				size: 5,
				srlist: [],
				total: 0,
				zclist: [],
				list: [{
						name: '全部'
					},
					{
						name: '未付款'
					}, {
						name: '已付款'
					}, {
						name: '已完成'
					},
					{
						name: '已取消'
					}
				],
				currents: 0
			}
		},
		filters: {
			
			types(val) {
				if (val == 1) {
					return '已完成'
				} else if (val == 2) {
					return '未付款'
				} else if (val == 3) {
					return '已取消'
				} else {
					return '已付款'
				}
			}
		},
		onReachBottom() {
		
			if (this.total - (this.current * this.size) > 0) {
				this.current = ++this.current
				this.getlist(this.zt)
			} else {
				this.status = 'nomore';
			}
			
		},
		async onPullDownRefresh() {
			this.current = 1
			this.size = 5
			await this.getlist(null)
			await this.change(0)
			await uni.stopPullDownRefresh();
			await this.$u.toast(`刷新成功`);
		},
		computed: {
			showwu() {
			return	this.srlist.length == 0 ? true : false

			},

			typefont(val) {
				if (val == 1) {
					return 'color:#333333'
				} else if (val == 2) {
					return 'color:#FA4D4D'
				} else if (val == 3) {
					return 'color:#999999'
				} else {
					return 'color:#7CC457'
				}
			}
		},
		async onShow() {
			// if (uni.getStorageSync('num')) {
			// 	await this.getall()
			// 	await this.getlist()

			// } else {
			// 	this.shows = true
			// }
			// await this.change(0)

		},
		onLoad(val) {
			if (uni.getStorageSync('data')) {
				const objs = JSON.parse(uni.getStorageSync('data'))
				this.id = objs.buyer.id
				this.getlist(null)
			}

		},

		onHide() {

			this.shows = false
		},
		methods: {

			// add(val, val1) {
			// 	if (val1 == 1) {
			// 		uni.switchTab({
			// 			url: '/pages/order/order'
			// 		});
			// 	} else {
			// 		uni.navigateTo({
			// 			url: `/pages/ditle/ditle?id=${val}&type=${val1}`
			// 		});
			// 	}

			// },
			// 数字补0
			hasDot(num) {
				if (!isNaN(num)) {
					return ((num + '').indexOf('.') != -1) ? num : num.toFixed(2);
				}
			},
			// getall() {
			// 	const shyc = JSON.parse(uni.getStorageSync('num'))
			// 	homeApi.income({
			// 		id: shyc.id
			// 	}).then(res => {

			// 	})
			// },
			async getlist(val) {
				
				// const shyc = JSON.parse(uni.getStorageSync('num'))
				await homeApi.order({
					ztbz: val,
					current: this.current,
					size: this.size,
					// id: shyc.id
					payerId: this.id
				}).then(res => {
					this.srlist.push(...res.data.records)
					this.total = res.data.total
					if ((this.total) - (this.current) * (this.size) > 0&&this.current!=0) {
						this.status = 'loadmore'
					}else if(this.total<5||this.total==5){
						this.status = 'nomore'
					} else {
						this.status = 'nomore'
					}
					if (res.data.records.length > 0) {
						this.srlist.map(e => {
							e.xsze = this.hasDot(e.xsze)
						})
						this.srlist.map(e => {
							const munse = (e.xsze + '').indexOf('.')
							e.cui = (e.xsze + '').slice(0, munse)
							e.cuiend = (e.xsze + '').slice(munse + 1, (e.xsze + '').length)
						})
					}
					// console.log(this.srlist)
				});
				// await homeApi.cash({

				// 	id: shyc.id
				// }).then(res => {

				// 	if (res.data.length > 0) {
				// 		this.zclist = res.data
				// 		this.zclist.map(e => {
				// 			e.type = 2
				// 			e.zkze = this.hasDot(e.zkze)
				// 		})
				// 		this.zclist.map(e => {
				// 			const munse = (e.zkze + '').indexOf('.')
				// 			e.cui = (e.zkze + '').slice(0, munse)
				// 			e.cuiend = (e.zkze + '').slice(munse + 1, (e.zkze + '').length)
				// 		})

				// 	}

				// 	console.log(res)
				// })
				// this.srlist.map(eq => {
				// 	console.log(eq.zkze);
				// 	eq.zkze = this.hasDot(eq.zkze)
				// })
				// this.alllist = this.srlist.concat(this.zclist);
				// this.alllist.sort(function(a, b) {
				// 	return a.xsrq > b.xsrq ? -1 : 1;
				// });
			},

			change(index) {
				this.srlist=[]
				this.currents = index;
				this.current = 1
				this.size = 5

				switch (index) {
					case 0:
					this.zt=null
						this.getlist(null)
						break;
					case 1:
					this.zt=2
						this.getlist(2)
						break;
					case 2:
					this.zt=0
						this.getlist(0)
						break;
					case 3:
					this.zt=1
						this.getlist(1)
						break;
					case 4:
					this.zt=3
						this.getlist(3)
						break;
				}
			},


		}

	}
</script>

<style lang="scss" scoped>
	.onees {
		color: #333333 !important;
	}

	.towes {
		color: #FA4D4D !important;
	}

	.treees {
		color: #999999 !important;
	}

	.forses {
		color: #7CC457 !important;
	}

	.app {
		height: 100%;
		
	}

	.asdimg {
		height: 100%;
		width: 100%;
		overflow: hidden;

		image {
			display: block;
			width: 262rpx;
			height: 225rpx;
			margin: 300rpx auto 62rpx;
		}

		view {
			width: 100%;
			text-align: center;
			height: 40rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 28rpx;
			color: rgba(51, 51, 51, 1);
			opacity: 1;
			margin-bottom: 8rpx;
		}

		text {
			width: 100%;
			height: 34rpx;
			display: block;
			text-align: center;
			margin: 0 auto 440rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 20rpx;
			color: rgba(153, 153, 153, 1);
			opacity: 1;
		}
	}

	/deep/.u-mode-center-box {
		border: 1px solid #E6e6e6;
	}

	.cuiq {
		font-size: 28rpx !important;
	}

	.cuiz {
		font-size: 40rpx !important;
	}

	.hejibox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cuiend {
		font-size: 32rpx !important;
	}

	.foot {
		margin-top: 32rpx;
		width: 100%;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		justify-content: space-between;
		display: flex;
		align-items: center;
	}

	.jes {
		display: flex;
		align-items: center;
		font-family: SF Pro Text;
		font-weight: 600;
		color: rgba(250, 77, 77, 1);
		opacity: 1;

		.fh {
			font-size: 20rpx;
			height: 24rpx;
			text-align: center;
		}

		.bw {
			font-size: 32rpx;
			text-align: center;
			line-height: 40rpx;
			height: 40rpx;
		}

		.gw {
			text-align: center;
			font-size: 24rpx;
		}

	}

	.redfont {
		color: red !important;
	}

	.green {
		color: blue;
	}

	.block {
		color: pink;
	}

	.hjjq {
		height: 40rpx;
		font-size: 28rpx;
		margin-right: 15rpx;
		font-family: PingFang SC;
		font-weight: bold;
		line-height: 40rpx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}

	.heji {
		height: 34rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34rpx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}

	.center {
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #E6E6E6;

		.img {
			margin-right: 50rpx;
			margin-left: 4rpx;

			image {
				width: 90rpx;
				height: 96rpx;
			}
		}

		.centerfoot {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.numje {
				height: 40rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 40rpx;
				color: rgba(153, 153, 153, 1);
				opacity: 1;
				margin-bottom: 0 !important;
			}

			text {
				height: 36rpx;
				font-size: 24rpx;
				font-family: SF Pro Text;
				font-weight: 400;
				line-height: 28rpx;
				color: rgba(51, 51, 51, 1);
				opacity: 1;
			}
		}

		.centerbox {
			width: 100%;
			padding: 24rpx 24rpx 24rpx 0;
			box-sizing: border-box;

			view {
				width: 100%;
				height: 40rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				line-height: 40rpx;
				color: rgba(51, 51, 51, 1);
				opacity: 1;
				margin-bottom: 16rpx;
			}
		}

	}

	.reds {
		color: red !important;
	}

	.tab {
		
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 4rpx 8rpx rgba(51, 51, 51, 0.05);
		opacity: 1;
		padding-bottom: 16rpx;
	}

	.mx {
		padding: 24rpx 24rpx 36rpx 24rpx;
		box-sizing: border-box;
		width: 100%;
		margin: 0 auto;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2rpx 12rpx rgba(0, 0, 0, 0.08);
		opacity: 1;
		border-radius: 16rpx;
		margin-bottom: 24rpx;
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 12rpx;

		.zftime {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 48rpx;
			margin-bottom: 20rpx;

			view {
				height: 28rpx;
				font-size: 24rpx;
				font-family: SF Pro Display;
				font-weight: 500;
				line-height: 28rpx;
				color: rgba(153, 153, 153, 1);
				opacity: 1;
			}

			text {
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				line-height: 2rpx;
				color: rgba(51, 51, 51, 1);
				opacity: 1;
			}
		}

		.yfk {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16rpx;

			view {
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(124, 196, 87, 1);
				opacity: 1;
				height: 50rpx;
				line-height: 50rpx;
			}

			text {
				line-height: 48rpx;
				height: 48rpx;
				font-size: 40rpx;
				font-family: SF Pro Text;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				opacity: 1;
			}
		}
	}


	.imagese {
		width: 40rpx;
		height: 44rpx;
		position: absolute;
		top: 72rpx;
		right: 246rpx;

	}

	/deep/.u-tab-bar {
		height: 4rpx !important;
		background-color: #7CC457 !important;
	}

	.bigfont {
		font-weight: 600;
	}



	.box-box {
		display: flex;
		justify-content: center;
		border-bottom: 1px solid #edeef5;

		.box {
			width: 100%;
			height: 88rpx;
			background: rgba(255, 255, 255, 1);
			opacity: 1;
			text-align: center;
			line-height: 88rpx;
		}
	}

	/deep/.u-mask-zoom {
		// background-color: transparent !important;
	}

	.card {
		padding: 24rpx 24rpx 0 24rpx;
		box-sizing: border-box;

		.centr {}
	}






	.imagesew {
		width: 40rpx;
		height: 44rpx;
		position: absolute;
		top: 42rpx;
		left: 128rpx;

	}

	.mok {
		position: relative;

		text {
			text-align: center;
			width: 100%;
			font-size: 32rpx;
			font-family: dinbold;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			opacity: 1;
		}

		view {
			text-align: center;
			width: 100%;
			font-size: 24rpx;
			margin-top: 6rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(255, 255, 255, 1);
			opacity: 1;
		}
	}
</style>
