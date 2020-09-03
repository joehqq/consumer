<template>
	<view class="app">
		<view class="box">
			<view class="head">
				<view>
					{{num}}
				</view>
				<text>
					洪湾渔港
				</text>
			</view>
			<view class="center" :class="index+1==list.length?'nocenter':''" v-for="(item,index) in list" :key='index'>
				<view class="centerbox">
					<view class="imgbox">
						<image :src="item.avatar?item.avatar:'../../static/image/yut.png'" mode=""></image>
					</view>
					<view class="cneterbox">
						<view class="hw">
							{{item.spmc}}
						</view>
						<text>
							{{item.je}} 斤
						</text>
					</view>
				</view>
				<view class="je">
					<view class="qian">
						¥ {{item.jq}}
					</view>
					<!-- <view class="je">
                                {{item.cui}}
					</view>
					<view class="xs">
                                .{{item.cuiend}}
					</view> -->
				</view>
			</view>
		</view>
		<view class="footbox">
			<view class="leftbox">
				<view class="foot">
					合计({{list.length}})<text class="fh">¥</text> <text class="rednum"> {{isalls}}</text><text class="cnmui"></text>
				</view>
				<view class="yxz">
					已选择 {{isall}}斤
				</view>
			</view>
			<view class="qzf" @click="enddk">
				去支付
			</view>
		</view>
		<view class="boxzz" v-if="show">
			<u-loading class="ddjz" :show="show" mode="circle"></u-loading>
		</view>
	</view>
</template>

<script>
	import homeApi from '../../api/home.js'
	export default {
		data() {
			return {
				list: [],
				num: '',
				show: false
			};
		},
		onLoad() {
			this.getlist()
		},
		computed: {
			isall() {
				if (this.list.length == 0) {
					return 0
				} else {
					const arr = []
					this.list.map(ele => {
						arr.push(ele.je == undefined ? 0 : (ele.je - 0))
					})
					let crr = arr.reduce((ele, val) => ele + val)
					crr = (crr + '').replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3");
					return crr
				}
			},
			isalls() {
				if (this.list.length == 0) {
					return 0
				} else {
					const arr = []
					this.list.map(ele => {
						arr.push((ele.jq == undefined ? 0 : (ele.jq - 0)))
					})
					let crr = arr.reduce((ele, val) => ele + val)
					crr = (crr + '').replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3");
					return crr
				}
			}
		},
		methods: {
			async enddk() {
				this.show = true
				const adddata = JSON.parse(uni.getStorageSync('data'))
				let obj = {
					"xs_dj": {
						payerId: adddata.buyer.id,
						"shyh": adddata.dmb.bm,
						"shyxm": adddata.dmb.mc,
						"jhze": 0,
						"lsze": null,
						"yhze": null,
						"xsze": null
					},
					"xsMxList": []
				}
				this.list.map((ele, index) => {

					obj.xsMxList.push({
						xh: index + 1,
						spbm: ele.spbm,
						sptm: ele.sptm,
						spmc: ele.spmc,
						spgg: ele.spgg,
						jldw: ele.jldw,
						xssl: ele.je,
						jhdj: ele.jhdj,
						lsdj: ele.lsdj,
						zkje: ele.jq,
						splb: ele.splb,
						cjmc: ele.cjmc,
						csmc: ele.csmc
					})
				})
				var that=this
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
					
						uni.setStorageSync('code', loginRes.code)
						homeApi.addorder(JSON.stringify(obj)).then(res => {
							if (res.code == 100) {
								
						
								const objs = {
									djId: res.data.id,
									js_code: uni.getStorageSync('code')
								}
								homeApi.pay(JSON.stringify(objs)).then(res => {
									if (res.code == 100) {
									
										let datas=JSON.parse(res.data)
										let paydata=JSON.parse(datas.msg_body)
										console.log(paydata)
						                let params =  paydata.qr_code_info.wx_jsapi
									
										let enddata=JSON.parse(params)
										uni.requestPayment({
										    provider: 'wxpay',
										    timeStamp:enddata.timeStamp,
										    nonceStr:enddata.nonceStr,
										    package: enddata.package,
										    signType: enddata.signType,
										    paySign: enddata.paySign,
										    success: function (res) {
										        console.log('success:' + JSON.stringify(res));
												that.$u.toast('支付成功');
												uni.navigateTo({
													url: '/pages/index/index'
												});
										    },
										    fail: function (err) {
												that.$u.toast('操作失败');
										        console.log('fail:' + JSON.stringify(err));
										    }
										});
										that.show = false
									} else {
										that.show = false
										that.$u.toast('操作失败');
									}
								})
						
							} else {
						
								that.$u.toast('操作失败');
						
								that.show = false
							}
						})
					}
				});
			
			},
			hasDot(num) {
				if (!isNaN(num)) {
					return ((num + '').indexOf('.') != -1) ? num : (num - 0).toFixed(2);
				}
			},
			getlist() {
				this.num = JSON.parse(uni.getStorageSync('data')).dmb.sm
				this.list = JSON.parse(uni.getStorageSync('objes'))

				// this.list.map(e => {
				// 	e.jq = this.hasDot(e.jq)
				// })
				// this.list.map(e => {
				// 	const munse = (e.jq + '').indexOf('.')
				// 	e.cui = (e.jq + '').slice(0, munse)
				// 	e.cuiend = (e.jq + '').slice(munse + 1, (e.jq + '').length)
				// })
			}
		}
	}
</script>

<style scoped lang="scss">
	.font {
		font-weight: bold !important;
	}

	.app {
		height: 100%;

	}

	.qzf {
		width: 192rpx;
		height: 72rpx;
		background: rgba(124, 196, 87, 1);
		opacity: 1;
		line-height: 72rpx;
		text-align: center;
		border-radius: 8rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		opacity: 1;
	}

	.yxz {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34rpx;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}

	.cuiqs {
		color: rgba(250, 77, 77, 1);
		font-size: 32rpx;
	}

	.ddjz {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.rednum {
		color: rgba(250, 77, 77, 1);
		font-size:
			40rpx;
		font-family: SF Pro Text;
		color: rgba(250, 77, 77, 1);
		opacity: 1;
	}

	.fh {
		font-size: 28rpx;
		color: rgba(250, 77, 77, 1);
		margin-left: 24rpx;
	}

	.boxzz {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 99;
	}

	.foot {
		display: flex;
		align-items: center;

		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}

	.centerbox {
		display: flex;
	}

	.footbox {
		width: 750rpx;
		height: 112rpx;
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		padding: 20rpx 24rpx 18rpx;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 8;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.je {
		display: flex;
		align-items: center;

		.qian {
			font-size: 20rpx;
		}

		.je {
			font-size: 28rpx;
		}

		.xs {
			font-size: 24rpx;
		}
	}

	.cneterbox {
		display: flex;
		flex-wrap: wrap;
		align-items: center;

		.hw {
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

		text {
			height: 40rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			line-height: 40rpx;
			color: rgba(153, 153, 153, 1);
			opacity: 1;
		}
	}

	.nocenter {
		border-bottom: none !important;
	}

	.center {
		padding: 24rpx 0 24rpx 0;
		border-bottom: 2rpx solid #f3f3f3;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.imgbox {
			margin-right: 50rpx;
			margin-left: 4rpx;

			image {
				width: 90rpx;
				height: 96rpx;

			}
		}
	}

	.head {
		width: 100%;
		height: 144rpx;
		background: rgba(255, 255, 255, 1);
		opacity: 1;
		padding: 48rpx 0 48rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;

		view {
			height: 48rpx;
			font-size: 40rpx;
			font-family: SF Pro Text;
			font-weight: bold;
			line-height: 48rpx;
			color: rgba(51, 51, 51, 1);
			opacity: 1;
			margin-right: 24rpx;
		}

		text {
			height: 34rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 34rpx;
			color: rgba(51, 51, 51, 1);
			opacity: 1;
		}

		// border-radius:16rpx;
	}

	.box {
		width: 100%;
		padding: 0 24rpx 24rpx 24rpx;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 2rpx 12rpx rgba(0, 0, 0, 0.08);
		opacity: 1;
		border-radius: 16rpx;
		margin-bottom: 120rpx;
	}

	.app {
		box-sizing: border-box;
		padding: 24rpx 24rpx 0;
	}
</style>
