import Vue from 'vue'
import Router from 'vue-router'

import login from 'components/login'
import record from 'components/content/record'
import account from 'components/content/account'
import blacklist from 'components/content/blacklist'
import system from 'components/content/system'
import warning from 'components/content/warning'
import zone from 'components/content/zone'
import dispatched from 'components/content/dispatched'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/record',
      name: 'record',
      component: record
    },
    {
      path: '/dispatched',
      name: 'dispatched',
      component: dispatched
    },
    {
      path: '/account',
      name: 'account',
      component: account
    },
    {
      path: '/blacklist',
      name: 'blacklist',
      component: blacklist
    },
    {
      path: '/system',
      name: 'system',
      component: system
    },                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    {
      path: '/warning',
      name: 'warning',
      component: warning
    },
    {
      path: '/zone',
      name: 'zone',
      component: zone
    },
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '*',
      redirect:'/login'
    },
    {
      path: '/index',
      redirect:'/login'
    }
  ]
}) 
