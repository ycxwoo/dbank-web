import { createRouter, createWebHistory, type RouteRecordNormalized, type RouteRecordRaw } from 'vue-router'
import { adminInfo } from '@/api/admin';
import { useInfoStore, type UserInfo, SetUserInfo, GetUserInfo } from '@/stores/user-info';
import { GetToken } from '@/stores/token'

//递归设置 动态路由表
async function setDynamicRoutes(dynamicRoutes:any[], menuList:any[]){
  menuList.forEach(async menu => {
      var route: RouteRecordRaw = {
          path: menu.path,
          name: menu.name,
          component: () => {
            const path = menu.component.split('/'); // 将路径拆分为数组
            //去除空串
            path.forEach((item: string, index: any) => {
              if (item == "") {
                path.splice(index, 1);
              }
            });
            return import(`@/${path[0]}/${path[1]}/${path[2]}.vue`)
          },
          meta: menu.meta,
          redirect: menu.redirect ? menu.redirect : null,
          children: [],
      }

      if (route.children) {
          route.children = await setDynamicRoutes(route.children, menu.children) as RouteRecordNormalized[];
      }

      dynamicRoutes.push(route)
  });

  return dynamicRoutes
}

//获取动态路由
export async function getDynamicRoutes(){
  //动态路由表
  var dynamicRoutes: RouteRecordRaw[] = []

  //实例化用户存储
  // var useInfo = useInfoStore()
  //获取用户菜单
  // var userInfo = useInfo.getUserInfo

  var userInfo = GetUserInfo()   //cookie中获取用户信息 
  if (userInfo) {
    //设置动态路由到路由表
    await setDynamicRoutes(dynamicRoutes, userInfo.menu)
  }else{
    //获取用户信息
    await adminInfo().then(async res => {
        var userInfo: UserInfo = {
            username: res.username,
            nickname: res.name,
            avatar: res.avatar,
            introduction: res.introduction,
            menu: res.menu,
            roles: res.roles
        }

        // useInfo.saveUserInfo(userInfo); // 保存用户信息
        SetUserInfo(userInfo); // 缓存用户信息到cookie
        //设置动态路由到路由表
        await setDynamicRoutes(dynamicRoutes, userInfo.menu)
    }).catch(err => {
        console.log("err = ", err);
    })
  }
  return dynamicRoutes
}

//静态路由
const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: "登录",
    },
    component: () => import('@/views/login/login-page.vue'),
    children: []
  },
];

//动态路由
// const dynamicRoutes = [
//   {
//     component: Layout,
//     path: '/system',
//     name: '系统管理',
//     isHidden: false,
//     meta: {
//       icon: "setting",
//       roles: ["admin"]
//     },
//     children: [
//       {
//         path: 'role',
//         name: '角色管理',
//         isHidden: false,
//         meta: {
//           icon: "setting",
//           roles: ["admin"]
//         },
//         component: () => import('@/views/system/role.vue'),
//       },
//       {
//         path: 'params',
//         name: '参数管理',
//         isHidden: false,
//         meta: {
//           icon: "setting",
//           roles: ["admin"]
//         },
//         component: () => import('@/views/system/params.vue'),
//       },
//       {
//         path: 'menu',
//         name: '菜单管理',
//         isHidden: false,
//         meta: {
//           icon: "setting",
//           roles: ["admin"]
//         },
//         component: () => import('@/views/system/menu.vue'),
//       },
//     ],
//   }
// ];

//实例化用户存储

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  ]
})

//添加静态路由
staticRoutes.forEach(route => {
  router.addRoute(route);
});

//获取动态路由
var dr: RouteRecordRaw[] = await getDynamicRoutes()
//添加动态路由
dr.forEach(route => {
  //必须要在路由跳转前(路由守卫前)加载路由组件
  router.addRoute(route);
});

//路由守卫
router.beforeEach(async (to, from, next) => {
  // console.log(to, from);
  if (to.path === '/login') {
    next();
    return;
  }

  // 获取token
  const token = GetToken()
  if (!token) {
    next('/login');
    return;
  }

  next();
})


export default router
