import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/appUser',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/appUser/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/appUser',
    method: 'put',
    data
  })
}

export function get(data) {
  return request({
    url: 'api/appUser',
    method: 'get',
    params: data
  })
}

export default { add, edit, del, get }
