import request from "@/utils/request";

const http = {
  get(url, params) {
    return request({
      url: url,
      method: 'get',
      params: params
    })
  },
  post(url, data, config) {
    return request({
      url: url,
      method: 'post',
      headers: config || {'Content-Type': 'application/json;charset=UTF-8'},
      data: data
    })
  },
  downFile(url, data, method='post') {
    return request({
      url: url,
      method: method,
      responseType: 'blob',
      data: data
    })
  },
  delete(url, data) {
    return request({
      url: url,
      method: 'delete',
      data: data
    })
  },
  put(url, data) {
    return request({
      url: url,
      method: 'put',
      data: data
    })
  }
};

export default http;
