<template>
	<view class="app1">
		<view class="app">
			<view class="head">
				<view class="headbox">
					<image src="../../static/image/sc.png" mode=""></image>
					<u-input class="sear" placeholder="搜索货号/名称" v-model="searval" @confirm="sera()" type="search" :clearable='false'
					 :border="false" />
				</view>

				<view class="imgbox" @click="goorder">
					<image src="../../static/image/more.png" mode=""></image>
					<text>全部订单</text>
				</view>
			</view>
			<view class="ssk" v-if="isss">
				<text>“{{searvals}}”筛选结果：</text>
				<image @click="delss" src="../../static/image/yq.png" mode=""></image>
			</view>
			<view class="qhbox" :style="{top:isss?'185rpx':'105rpx'}">
				<image class="xz" v-show="type==1" src="../../static/image/qh.png" mode=""></image>
				<image class="mxz" v-show="type==2" src="../../static/image/qh1.png" mode=""></image>
				<view class="xzbox">
					<view class="qb" :class="type==1?'font':''" @click="add(1)">
						全部
					</view>
					<view class="yx" :class="type==2?'font':''" @click="add(2)">
						已选
					</view>
				</view>
			</view>
			<view>

			</view>
			<view class="center" :style="{marginTop:!isss?'119rpx':'104rpx'}">
				<view class="centerbox" v-if="type==1" :class="index==list.length-1?'clerboer':''" v-for="(item,index) in list"
				 :key='index'>
					<view>
						<!-- :src="item.avatar?item.avatar:'../../'" -->
						<!--  -->
						<image class="tx" :src="item.avatar?item.avatar:'../../static/image/yut.png'" mode=""></image>
					</view>
					<view class="num">
						<!-- <view class="barne"> -->
						<text class="spname">
							{{item.spmc}}
						</text>
						<view class="sl">
							<text class="slj" :class="(item.je==''&&item.isflang==false)?'redfont':''">
								{{(item.je==''&&item.isflang==false)?'请输入完整':'数量/斤'}}
							</text>
							<text class="je" :class="(item.jq==''&&item.isflang==false)?'redfont':''">
								{{(item.jq==''&&item.isflang==false)?'请输入完整':'总额/元'}}
							</text>

						</view>
						<view class="sljinp" :class="(item.je==''&&item.isflang==false)?'redbgc':''">
							<input class="inpt" v-model='item.je' @input="je(item.id,item.je)" type="digit" value="" />
						</view>
						<view class="jeinp" :class="(item.jq==''&&item.isflang==false)?'redbgc':''">
							<input class="inpt" v-model='item.jq'  @input="jq(item.id,item.jq)"
							 type="digit" value="" />
						</view>
						<view class="cz" v-if="item.jq!=''||item.je!=''" @click="rest(item.id)">
							重置
						</view>
					</view>
				</view>
				<view class="centerbox" v-if="type==2" :class="index==listyx.length-1?'clerboer':''" v-for="(item,index) in listyx"
				 :key='index'>
					<view>
						<image class="tx" :src="item.avatar?item.avatar:'../../static/image/yut.png'" mode=""></image>
					</view>
					<view class="num">
						<text class="spname">
							{{item.spmc}}
						</text>
						<view class="sl">
							<text class="slj" :class="(item.je==''&&item.isflang==false)?'redfont':''">
								{{(item.je==''&&item.isflang==false)?'请输入完整':'数量/斤'}}
							</text>
							<text class="je" :class="(item.jq==''&&item.isflang==false)?'redfont':''">
								{{(item.jq==''&&item.isflang==false)?'请输入完整':'总额/元'}}

							</text>

						</view>
						<view class="sljinp" :class="(item.je==''&&item.isflang==false)?'redbgc':''">
							<input class="inpt" v-model='item.je' @input="jes(item.id,item.je)" type="digit" value="" />
						</view>
						<view class="jeinp" :class="(item.jq==''&&item.isflang==false)?'redbgc':''">
							<input class="inpt" v-model='item.jq' @input="jqs(item.id,item.jq)" type="digit" value="" />
						</view>

						<view class="cz" @click="del(item.id)">
							删除
						</view>
					</view>
				</view>
				<view class="asdimg" v-if="hga">
					<image src="../../static/image/qs.png" mode=""></image>
					<view>
						暂无商品
					</view>
					<text>还没有商品哦 !</text>
				</view>
			</view>

			<view class="footbox">
				<view class="leftbox">
					<view class="foot">
						合计({{listyx.length}})<text class="fh">¥</text> <text class="rednum"> {{isalls}}</text><text class="cuiqs"></text>
					</view>
					<view class="yxz">
						已选择 {{isall}}斤
					</view>
				</view>
				<view class="qzf" @click="enddk">
					去支付
				</view>
			</view>

		</view>
		<u-toast ref="uToast" />
	
	</view>
</template>

<script>
	import homeApi from '../../api/home.js'
	export default {
		data() {
			return {
				searval: '',
				isss: false,
				searvals: '',
				id: '',
				res:'',
				type: 1,
				checked: false,
				listyx: [],
				js_code:'',
				dmbId:'',
				list: [],
				aaa:'',
				bbb:''

			}
		},
		async onLoad(q) {
			if (q.scene) {
				let id=q.scene
				var reg = new RegExp('scene=', "g");
				id = (id).replace(reg, "");
				id = decodeURIComponent(id);
				this.id =id
				await this.getopenid()
				
			} else {
				this.$refs.uToast.show({
					title: '请扫码登陆',
					type: 'default',
					duration: '800'
				})
			}
		},

		computed: {
			hga() {
				if (this.type == 1 && this.list.length) {
					return false
				}
				if (this.type == 1 && !this.list.length) {
					return true
				}
				if (this.type == 2 && !this.listyx.length) {
					return true
				}
				if (this.type == 2 && this.listyx.length) {
					return false
				}

			},
			isall() {
				if (this.listyx.length == 0) {
					return 0
				} else {
					const arr = []
					this.listyx.map(ele => {
						arr.push(ele.je == undefined ? 0 : (ele.je - 0))
					})
					let crr = arr.reduce((ele, val) => ele + val)
					crr = (crr+'').replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3");
					return crr
				}
			},
			isalls() {
				if (this.listyx.length == 0) {
					return 0
				} else {
					const arr = []
					this.listyx.map(ele => {
						arr.push(ele.jq == undefined ? 0 : (ele.jq - 0))
					})
					let crr = arr.reduce((ele, val) => ele + val)
					crr = (crr+'').replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3");
					return crr
				}
			}
		},

		methods: {
			delss() {
				this.searvals = ''
				this.searval = ''
				this.sera()
				this.type = 1
				this.isss = false
			},
			getlist() {
				const obj = {
					id: this.id
				}
				homeApi.list(JSON.stringify(obj)).then(res => {
					this.list = res.data
					this.list.map(ele => {
						this.$set(ele, 'isflang', true)
						this.$set(ele, 'je', '')
						this.$set(ele, 'jq', '')
					})
				})
			},
			goorder() {
				uni.navigateTo({
					url: '/pages/orders/orders'
				});
			},
			sera(e) {
				if (this.searval) {
					this.isss = true
					this.searvals = this.searval
				} else {
					this.isss = false
					this.searvals = this.searval
				}
				this.type = 1
				const obj = {
					current: null,
					size: null,
					spbm: this.searval,
					id:this.id
				}
				homeApi.list(JSON.stringify(obj)).then(res => {
					this.list = res.data
					if (this.listyx.length > 0) {
						this.list.map((item2) => {
							this.listyx.map((item1) => {
								if (item2.id == item1.id) {
									let json = {
										je: item1.je,
										jq: item1.jq
									};
									Object.assign(item2, json);
									return item2;
								}
							})
						})
					}
					this.list.map(ele => {
						if (!ele.je) {
							this.$set(ele, 'je', '')
						}
						if (!ele.isflang) {
							this.$set(ele, 'isflang', true)
						}
						if (!ele.jq) {
							this.$set(ele, 'jq', '')
						}
					})
				})

			},
			enddk() {
				if (this.listyx.length == 0) {
					return this.$refs.uToast.show({
						title: '请选择商品',
						type: 'default',
						duration: '800'
					})
				}
				const arr = []
				const brr = []
				this.listyx.map((ele, index) => {

					if (ele.je == '' || ele.jq == '') {
						arr.push(index)
					}
				})
				this.list.map((ele, index) => {
				
					if ((ele.je != '' && ele.jq == '')||(ele.je == '' && ele.jq != '')) {
						brr.push(index)
					}
				})
				if (arr.length != 0) {
					arr.map(ele => {

						this.listyx[ele].isflang = false
					})
					// return
				}
				if (brr.length != 0) {
					brr.map(ele => {
				
						this.list[ele].isflang = false
					})
					return
				}
				
			      let objes=this.listyx;
				uni.setStorageSync('objes', JSON.stringify(objes))
			
				uni.navigateTo({
					url: '/pages/dowoder/dowoder'
				});
				// }else{
				// 	this.$refs.uToast.show({
				// 		title: '操作失败，请稍后重试',
				// 		type: 'default',
				// 		duration: '800'
				// 	})
				// }
				// })





			}, // 填写金额
			gaga(value) {
				value = value.replace(/\.{1,}/g, ".")
				value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3");

				return value
			},
			jes(val, val1) {

				const index = this.list.findIndex(ele => ele.id == val)
				const indexyx = this.listyx.findIndex(ele => ele.id == val)
				if (val1 != '') {
					if (indexyx != -1) {

						this.list[index].isflang = true
						this.$nextTick(function() {
							this.list[index].je = this.gaga(val1)
							this.listyx[indexyx].je = this.gaga(val1)
						})
						console.log(this.listyx[indexyx].je)
					} else {
						this.listyx.push(this.list[index])
					}
				}else{
					this.list[index].je =''
				}

			},
			// 填写金钱
			jqs(val, val1) {
				const index = this.list.findIndex(ele => ele.id == val)
				const indexyx = this.listyx.findIndex(ele => ele.id == val)
				if (val1 != '') {
					if (indexyx != -1) {


						this.list[index].isflang = true
						this.$nextTick(function() {
							this.list[index].jq = this.gaga(val1)
							this.listyx[indexyx].jq = this.gaga(val1)
						})
					} else {
						this.listyx.push(this.list[index])
					}
				}else{
					this.list[index].jq =''
				}
				// else {
				// 	const indexyxdel = this.listyx.findIndex(ele => ele.id == val)
				// 	if (this.listyx[indexyxdel].je == '') {
				// 		this.listyx.splice(indexyxdel, 1)
				// 	}
				// }
			},
			// 填写金额
			je(val, val1) {
				const index = this.list.findIndex(ele => ele.id == val)
				const indexyx = this.listyx.findIndex(ele => ele.id == val)
				if (val1 != '') {
					if (indexyx != -1) {

						this.list[index].isflang = true
						this.$nextTick(function() {
							this.listyx[indexyx].je = this.gaga(val1)
						})
					} else {
						this.listyx.push(this.list[index])
					}
				} else {
					const indexyxdel = this.listyx.findIndex(ele => ele.id == val)
					if (this.listyx[indexyxdel].jq == '') {
						this.listyx.splice(indexyxdel, 1)
					}else{
						this.listyx[indexyxdel].je =''
					}
				}
			},
			// 填写金钱
			jq(val, val1) {
				const index = this.list.findIndex(ele => ele.id == val)
				const indexyx = this.listyx.findIndex(ele => ele.id == val)
				if (val1 != '') {
					if (indexyx != -1) {
						this.list[index].isflang = true
						this.$nextTick(function() {
							this.listyx[indexyx].jq = this.gaga(val1)
						})
					} else {
						this.listyx.push(this.list[index])
					}
				} else {
					const indexyxdel = this.listyx.findIndex(ele => ele.id == val)
					if (this.listyx[indexyxdel].je == '') {
						this.listyx.splice(indexyxdel, 1)
					}else{
						this.listyx[indexyxdel].jq =''
						}
				}
			},
			// 重置
			rest(val) {
				const index = this.list.findIndex(ele => ele.id == val)
				const indexyxdel = this.listyx.findIndex(ele => ele.id == val)
				if (indexyxdel != -1) {
					this.listyx.splice(indexyxdel, 1)
				}
				if (index != -1) {
					this.list[index].isflang = true
					this.list[index].jq = ''
					this.list[index].je = ''
				}
				this.$refs.uToast.show({
					title: '已清空',
					type: 'default',
					duration: '800'
				})
			},
			del(val) {
				const index = this.list.findIndex(ele => ele.id == val)
				const indexyxdel = this.listyx.findIndex(ele => ele.id == val)
				if (indexyxdel != -1) {
					this.listyx.splice(indexyxdel, 1)
				}
				if (index != -1) {
					this.list[index].jq = ''
					this.list[index].je = ''
				}
				this.$refs.uToast.show({
					title: '已删除',
					type: 'default',
					duration: '800'
				})
			},
			// 切换tap
			add(val) {
				if (val == 2) {
					this.type = 2
				} else {
					this.type = 1
				}
			},
			// 获取去openid
			getopenid() {
			const that=this
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
				   uni.setStorageSync('code',loginRes.code)
				   that.js_code=uni.getStorageSync('code')
				   that.dmbId=that.id
				   homeApi.wx({
				   	js_code: uni.getStorageSync('code'),
				   	dmbId: that.id
				   }).then(res => {
					  const objqq=res
					that.res=JSON.stringify(objqq)
				   	if(res.data.dmb){
				   		uni.setNavigationBarTitle({
				   			title: res.data.dmb.bm == null ? '洪湾渔港' : `洪湾渔港${res.data.dmb.sm}`
				   		})
				   		uni.setStorageSync('data', JSON.stringify(res.data))
				   		uni.setStorageSync('token', res.data.token)
				   		that.getlist()
				   	}else{
				   		that.$refs.uToast.show({
				   			title: '暂无此商家信息',
				   			type: 'default',
				   			duration: '800'
				   		})
				   	}
				   
				   })
				  }
				}); 
			
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.ssk {
		width: 100%;
		height: 80rpx;
		background: rgba(255, 251, 242, 1);
		opacity: 1;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
		margin-top: 14rpx;

		text {
			height: 34rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 34rpx;
			color: rgba(255, 179, 23, 1);
			opacity: 1;
			margin-left: 24rpx;
		}

		image {
			width: 28rpx;
			height: 28rpx;
			margin-right: 24rpx;
		}
	}

	.asdimg {
		height: 980rpx;
		width: 100%;
		overflow: hidden;

		image {
			display: block;
			width: 262rpx;
			height: 225rpx;
			margin: 180rpx auto 62rpx;
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
			margin: 0 auto;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 20rpx;
			color: rgba(153, 153, 153, 1);
			opacity: 1;
		}
	}
	
	.head {
		display: flex;
		align-items: center;
	}

	.imgbox {
		display: flex;
		align-items: center;
		margin-left: 40rpx;

		image {
			width: 50rpx;
			height: 50rpx;
		}

		text {
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			opacity: 1;
		}
	}

	.headbox {
		display: flex;
		align-items: center;
		// background-image: url(../../static/image/jx.png);
		// background-position: center;
		// background-size: 100%;
		border-radius: 60rpx;
		background-color: #F6F6F6;
		width: 516rpx;
		height: 64rpx;

		image {
			width: 32rpx;
			height: 32rpx;
			margin-left: 24rpx;
			margin-right: 8rpx;
		}

		.sear {
			color: #BBBBBB;
			font-size: 24rpx;
			caret-color: #7CC457;
			width: 100%;
		}
	}


	.inpt {
		width: 100%;
		height: 100%;
		line-height: 100%;
		text-align: center;
		font-size: 32rpx;
		font-family: SF Pro Display;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}


	.asd {
		width: 500rpx;
		height: 1000rpx;
		background-color: red;
	}

	.redbgc {
		background: rgba(250, 77, 77, 1) !important;
		opacity: 0.1 !important;
	}

	.redfont {
		// width:120px;

		font-size: 24rpx !important;
		// height:34px;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34rpx !important;
		color: rgba(250, 77, 77, 1);
		opacity: 1;
	}


	.dd {
		width: 100%;
		height: 112rpx;
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
		z-index: 999999;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cuiqs {
		color: rgba(250, 77, 77, 1);
		font-size: 32rpx;
	}

	.fh {
		font-size: 28rpx;
		color: rgba(250, 77, 77, 1);
		margin-left: 24rpx;
	}

	.qsr {
		// position: absolute;
		// top:64rpx;
		// right: 24rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 34rpx;
		color: rgba(250, 77, 77, 1);
		opacity: 1;
	}

	.rednum {
		color: rgba(250, 77, 77, 1);
		font-size:
			40rpx;
		font-family: SF Pro Text;
		color: rgba(250, 77, 77, 1);
		opacity: 1;
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

	.mxz {
		left: 25rpx;
	}

	.font {
		font-weight: bold !important;
	}

	.clerboer {
		border-bottom: 0rpx !important;
	}

	.cz {
		position: absolute;
		top: 0;
		right: 24rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 40rpx;
		color: rgba(250, 77, 77, 1);
		opacity: 1;
	}

	.je {
		width: 242rpx;

	}

	.slj {
		width: 242rpx;
		margin-right: 24rpx;
	}

	.sljinp {
		width: 242rpx;
		height: 82rpx;
		background: rgba(246, 246, 246, 1);
		opacity: 1;
		border-radius: 10rpx;
		margin-right: 24rpx;
		margin-top: 8rpx;
	}

	.jeinp {
		width: 242rpx;
		height: 82rpx;
		margin-top: 8rpx;
		background: rgba(246, 246, 246, 1);
		opacity: 1;
		border-radius: 10rpx;
	}

	.num {
		margin-left: 50rpx;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: start;

		.spname {
			height: 40rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			line-height: 40rpx;
			color: rgba(51, 51, 51, 1);
			opacity: 1;
			margin-bottom: 24rpx;
		}

		.sl {
			display: flex;
			justify-content: space-between;
			height: 34rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			line-height: 34rpx;
			color: rgba(153, 153, 153, 1);
			opacity: 1;
		}
	}

	.nickname {
		margin-left: 34rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		opacity: 1;
	}

	.tx {
		width: 90rpx !important;
		height: 96rpx !important;
		display: block;
	}

	.centerbox {
		width: 654rpx;
		height: 236rpx;
		opacity: 1;
		background: rgba(255, 255, 255, 1);
		padding: 24rpx 0;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #E6E6E6;
	}

	.xz {
		left: 5rpx;
	}

	// .qh{
	// 	background-image: url(../../static/image/qh.png);
	// }
	.xzbox {
		height: 124rpx;
		display: flex;
		align-items: center;

		view {
			line-height: 124rpx;
			height: 124rpx;
			text-align: center;
			width: 50%;
			position: relative;
			z-index: 9;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(51, 51, 51, 1);
			opacity: 1;
		}

		.qb {
			text-align: center;

		}
	}

	.qhbox {
		position: absolute;
		top: 105rpx;
		left: 0px;
		width: 100%;
		z-index: 99;
		overflow: hidden;

		image {
			position: absolute;

			width: 720rpx;
			height: 124rpx;
		}
	}

	.center {
		margin: 0 auto 130rpx;
		box-sizing: border-box;
		padding: 0 24rpx;
		position: relative;
		z-index: 9999;
		margin-top: 119rpx;
		width: 702rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 15rpx 12rpx rgba(0, 0, 0, 0.08);
		opacity: 1;
		border-radius: 0px 0px 16rpx 16rpx;
	}

	.app {
		position: relative;
		padding: 24rpx;
		box-sizing: border-box;
	}

	page {
		height: 100%;
	}

	.app1 {
		margin-bottom: 112rpx;
	}
</style>
