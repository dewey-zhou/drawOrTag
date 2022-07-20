import http from '@/utils/http';


// 登录接口
export const login = (params) => {
  return http.post(`/api/noauth/sys/login`,params);
}