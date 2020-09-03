import http from './request.js'


// 微信登录
function wx(data){
	return http({
		url: '/system/wx/open-id',
		method: 'GET', // 严格区分大小写,必须是大写
		data
	})
}
//获取商户信息
function list(data){
	return http({
		url: '/business/dmb-spzl/list',
		method: 'POST', // 严格区分大小写,必须是大写
		data
	})
}
//获取订单信息
function order(data){
	return http({
		url: '/business/xs-dj2020/list/mx',
		method: 'POST', // 严格区分大小写,必须是大写
		data
	})
}
//创建订单
function addorder(data){
	return http({
		url: '/business/xs-dj2020/order',
		method: 'POST', // 严格区分大小写,必须是大写
		data
	})
}
//创建订单
function pay(data){
	return http({
		url: '/business/xs-dj2020/pay',
		method: 'POST', // 严格区分大小写,必须是大写
		data
	})
}
export default {
	wx,
	list,
	order,
	addorder,
	pay
}