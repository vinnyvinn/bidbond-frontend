import Vue from 'vue'
import './plugins/axios'

import App from './App.vue'
import router from './router'
import store from './store'
import "./filters";

import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

import Vuetify from 'vuetify';
import "vuetify/dist/vuetify.min.css";
import '@mdi/font/css/materialdesignicons.css'
Vue.use(Vuetify);

Vue.config.productionTip = false;

import Loading from "./components/Loading"
Vue.component('loading', Loading);

import Pagination from "./components/Pagination";
Vue.component('pagination', Pagination);

import PhoneNumber from "./components/PhoneNumber"
Vue.component('phone-number', PhoneNumber);

import Modal from "./components/Modal"
Vue.component('modal', Modal);

// Validate
import VeeValidate from "vee-validate";
Vue.use(VeeValidate, {
	fieldsBagName: 'vvFields'
});

// Numeric
import VueNumeric from 'vue-numeric'
Vue.use(VueNumeric);

// progress bar
import VueProgressBar from 'vue-progressbar';
const options = {
	color: '#faa51d',
	failedColor: '#ea4335',
	thickness: '5px',
	transition: {
		speed: '0.02s',
		opacity: '0.6',
		termination: 100
	},
	autoRevert: false,
	location: 'top',
	inverse: false
};
Vue.use(VueProgressBar, options);

// My modules
import { Auth } from './plugins/auth'
Vue.use(Auth);

import { Numeral } from './plugins/numeral'
Vue.use(Numeral);

import vSelect from 'vue-select'
Vue.component('v-select', vSelect);

import { Errors } from './plugins/errors'
Vue.use(Errors);

import { Permissions } from './plugins/permissions'
Vue.use(Permissions);

router.beforeEach((to, from, next) => {
	document.title = to.meta.title || process.env.VUE_APP_NAME;
	store.dispatch('setPath',to.path)
	next();
});
const app = new Vue({
  router,
  store,
 vuetify: new Vuetify(),
  render: h => h(App)
}).$mount('#app');

// axios interceptors
axios.interceptors.request.use(function(config) {
	app.$Progress.start();

	return config;
});

// Add a response interceptor
axios.interceptors.response.use(function(response) {
	app.$Progress.finish();

	return response;
	},
	function(error) {
		app.$Progress.fail();

		return Promise.reject(error);
	}
);
