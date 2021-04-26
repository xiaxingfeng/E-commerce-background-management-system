import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
}, {
    path: '/login',
    component: () =>
        import ( /* webpackChunkName: "login" */ './../views/login.vue')
}, {
    path: '/home',
    component: () =>
        import ( /* webpackChunkName: "home" */ '../views/home.vue'),
    children: [{
        path: 'users',
        component: () =>
            import ( /* webpackChunkName: "user" */ '../components/yhgl/users.vue')
    }, {
        path: 'roles',
        component: () =>
            import ( /* webpackChunkName: "roles" */ '../components/qxgl/roles.vue')
    }, {
        path: 'rights',
        component: () =>
            import ( /* webpackChunkName: "rights" */ '../components/qxgl/rights.vue')
    }, {
        path: 'categories',
        component: () =>
            import ( /* webpackChunkName: "categories" */ './../components/spgl/categories.vue')
    }, {
        path: 'orders',
        component: () =>
            import ( /* webpackChunkName: "orders" */ './../components/ddgl/orders.vue')
    }, {
        path: 'reports',
        component: () =>
            import ( /* webpackChunkName: "reports" */ './../components/sjtj/reports.vue')
    }, {
        path: 'goods',
        component: () =>
            import ( /* webpackChunkName: "goods" */ './../components/spgl/goods.vue')
    }, {
        path: 'params',
        component: () =>
            import ( /* webpackChunkName: "params" */ './../components/spgl/params.vue')
    }, ]
}, ]

const router = new VueRouter({
    routes
})

export default router