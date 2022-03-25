import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from './until/axios.js'
import filter from './until/filter.js'
Vue.prototype.$axios = axios


Vue.config.productionTip = false;

Vue.use(router);
Vue.use(ElementUI);
router.beforeEach((to, from, next) => {
	if (to.path == '/login') {
		next()
	} else {
		axios.get("/token").then(res => {
			if (res.code == 200) {
				next()
			}
		})
	}
})
router.afterEach((to, next) => {
	const {
		id
	} = to.query
	let title=to.meta.title
	if (id && to.name == 'add') {
		title="编辑商品"
		
	}
	store.commit('setTitle', title);
})


new Vue({
	el: '#app',
	router,
	store,
	components: {
		App
	},
	template: '<App/>',
	render: h => h(App)
})

// new Vue({
// 	router,
// 	store,
// 	render: (h) => h(App),
// }).$mount("#app");
