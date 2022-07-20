import http from '@/utils/http';


// 分页查询Banner列表
export const getBannerList = (query) => {
 return http.get(`/api/auth/banner/page`,query);
}

// 根据ID删除Banner记录
export const delBannerById = (id) => {
  return http.delete(`/api/auth/banner/delete/${id}`,);
}


// 根据ID查询Banner详情
export const getBannerDetailById = (id) => {
  return http.get(`/api/auth/banner/detail/${id}`,);
}


// 新增Banner记录
export const addBanner = (params) => {
  return http.post(`/api/auth/banner/save`,params);
}
    
// 更新Banner记录
export const updateBanner = (params) => {
  return http.post(`/api/auth/banner/update`,params);
}
//游戏----------------------------------------------------------
// 分页查询游戏列表
export const getGameList = (query) => {
  return http.get(`/api/auth/game/page`,query);
}

// 根据ID删除Game记录
export const delGameById = (id) => {
  return http.delete(`/api/auth/game/delete/${id}`,);
}


// 根据ID查询Game详情
export const getGamerDetailById = (id) => {
  return http.get(`/api/auth/game/detail/${id}`,);
}


// 新增Game记录
export const addGame = (params) => {
  return http.post(`/api/auth/game/save`,params);
}
    
// 更新Game记录
export const updateGame = (params) => {
  return http.post(`/api/auth/game/update`,params);
}