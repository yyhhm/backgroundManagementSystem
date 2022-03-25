import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);


const routes = [{
		path: '/',
		name: 'home',
		component: () => import('../views/Home.vue'),
		redirect:'/book',
		children: [
			{
				path: '/category',
				name: 'category',
				component: () => import('../views/Category.vue'),
				meta:{
					title:'分类管理'
				}

			},
			
			{
				path: '/book',
				name: 'book',
				component: () => import('../views/Book.vue'),
				meta:{
					title:'图书管理'
				}
			},
			{
				path:'/account',
				name:'account',
				component:()=>import('../views/Account.vue'),
				meta:{
					title:'修改账户'
				}
			},
			{
				path:'/swiper',
				name:'swiper',
				component:()=>import('../views/Swiper.vue'),
				meta:{
					title:'轮播图配置'
				}
			},
			{
				path:'/user',
				name:'user',
				component:()=>import('../views/User.vue'),
				meta:{
					title:'会员管理'
				}
			},
			{
				path:'/order',
				name:'order',
				component:()=>import('../views/Order.vue'),
				meta:{
					title:'订单管理'
				}
			},
			{
				path:'/orderDetail',
				name:'orderDetail',
				component:()=>import('../views/OrderDetail.vue'),
				meta:{
					title:'订单详情'
				}
			},
			{
				path:'/appraise',
				name:'appraise',
				component:()=>import('../views/Appraise.vue'),
				meta:{
					title:'评价管理'
				}
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/Login.vue')
	},
];

const router = new VueRouter({
	routes,
});

export default router;
