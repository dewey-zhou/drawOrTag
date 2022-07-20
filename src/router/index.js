import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Index",
    redirect: "/modal",
    component: import("@/components/LayOut")
  },
  {
    path: "/modal",
    name: "Modal",
    redirect: "/detect",
    component:()=> import("@/components/LayOut"),
    children:[
      {
        path:"/detect",
        name:"detect",
        component:()=> import("@/views/Detect")
      },
      {
        path:"/divide",
        name:"divide",
        component:()=> import("@/views/Divide")
      },
      {
        path:"/demo",
        name:"demo",
        component:()=> import("@/views/Demo")
      }
    ]
  },
]

const router = new VueRouter({
  mode: "history",
  routes
})


export default router
