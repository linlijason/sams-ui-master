import request from '@/utils/request'

export function del(ids) {
  return request({
    url: 'api/matchApply',
    method: 'delete',
    data: ids
  })
}

export function list(data) {
  return request({
    url: 'api/matchApply',
    method: 'get',
    params: data
  })
}

export function getMatchList(data) {
  return request({
    url: 'api/match',
    method: 'get',
    params: data
  })
}

export function exportData(data) {
  return request({
    url: 'api/matchApply/download',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

export default { del, list, getMatchList, exportData }
