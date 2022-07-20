import axios from "axios";
import store from "@/store";
import router from "@/router";
import { Modal ,message} from 'ant-design-vue';

// 创建axios实例
const conf = {
    baseURL: 'http://139.198.191.246:9090/',
    timeout: 90000, // 请求超时时间
    withCredentials:false
  };
  
  const service = axios.create(conf);

// request拦截器
service.interceptors.request.use(
    config => {
      if (localStorage.getItem("token")) {
        config.headers["Authorization"] = localStorage.getItem("token"); // 让每个请求携带自定义token 请根据实际情况自行修改
      }else{
        router.push('login')
      }
        return config;
    },
    error => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error);
    } 
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = JSON.parse(JSON.stringify(response.data))
    if(res.msg=="授权失败"){
      router.push('login')
    }
    // if(res.code!=='200'){
    //   router.push('login')
    // }
    return res;
  }
)
// service.interceptors.response.use(
//     response => {
//       /**
//        * code为非200是抛错 可结合自己业务进行修改
//        */
//       return response
//     },
//     error => {
//       if (
//         error.response &&
//         error.response.status &&
//         error.response.status === 401
//       ) {
//         message.error({
//           content: "你已被登出，可以取消继续留在该页面，或者重新登录！"
//         });
//       } else {
//         message.error({
//           content: error.message
//         });
//       }
//       console.log("err" + error); // for debug
//       return Promise.reject(error);
//     }
//   );
  
  export default service;
  export { conf };