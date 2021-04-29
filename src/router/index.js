import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import (
                    /* webpackChunkName: "dashboard" */
                    "../views/Dashboard.vue")
            }, {
                path: "/user",
                name: "usertable",
                meta: {
                    title: '用户管理'
                },
                component: () => import (
                    /* webpackChunkName: "table" */
                    "../views/UserTable.vue")
            }, {
                path: "/cart",
                name: "carttable",
                meta: {
                    title: '购物车管理'
                },
                component: () => import (
                    /* webpackChunkName: "table" */
                    "../views/CartTable.vue")
            }, {
                path: "/order",
                name: "ordertable",
                meta: {
                    title: '订单管理'
                },
                component: () => import (
                    /* webpackChunkName: "table" */
                    "../views/OrderTable.vue")
            },{
                path: "/recommender",
                name: "recommendertable",
                meta: {
                    title: '标签管理'
                },
                component: () => import (
                    /* webpackChunkName: "table" */
                    "../views/RecommenderTable.vue")
            },{
                path: "/charts",
                name: "basecharts",
                meta: {
                    title: '图表'
                },
                component: () => import (
                    /* webpackChunkName: "charts" */
                    "../views/BaseCharts.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '自定义图标'
                },
                component: () => import (
                    /* webpackChunkName: "icon" */
                    "../views/Icon.vue")
            }, {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */
                    '../views/404.vue')
            }, {
                path: '/403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */
                    '../views/403.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
            /* webpackChunkName: "login" */
            "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;
