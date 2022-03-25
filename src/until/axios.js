import axios from "axios"
import router from "../router/index.js"
import { Message } from "element-ui"
axios.defaults.baseURL = '/admin'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = window.localStorage.getItem('token') || ''
axios.interceptors.response.use(res => {
	if(res.data.code == 500){
		Message.error(res.data.msg)
			return new Promise(() => {})
	}	
	if(res.data.code != 200)
	{
		if(res.data.data){
			Message.error(res.data.data)
		}
		if (res.data.code == 401) {	
			router.push({
				path: '/login'
			})	
		}
		return new Promise(() => {})
	}
	
	return res.data
})

export default axios