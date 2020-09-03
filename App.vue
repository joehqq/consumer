<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			// uni.login({
			//   provider: 'weixin',
			//   success: function (loginRes) {
			//    uni.setStorageSync('code',loginRes.code)
			//   }
			// }); 
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	.app1{
		height: 100%;
		}
	page{
		height: 100%;
		background-color: #FEFEFE;
		// background-color: red;
	}
		@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
