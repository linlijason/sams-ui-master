import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/appNews',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/appNews/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/appNews',
    method: 'put',
    data
  })
}

export function searchTop(title) {
  return request({
    url: '/api/appBanner/news',
    method: 'get',
    params: { title }
  })
}

export default { add, edit, del, searchTop }
