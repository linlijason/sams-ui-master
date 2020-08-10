import request from '@/utils/request'

export function review(data) {
  return request({
    url: 'api/register/review/commit',
    method: 'post',
    data: data
  })
}

export function detail(data) {
  return request({
    url: 'api/register/review/detail',
    method: 'get',
    params: data
  })
}
// 生產vip編碼
export function generateVipNumber(type) {
  return request({
    url: 'api/register/review/detail',
    method: 'get',
    params: { type }
  })
}

export function remoeveMember(type, id) {
  return request({
    url: `api/app/${type}/delete`,
    method: 'post',
    data: {
      id
    }
  })
}

export function saveMember(type, data) {
  return request({
    url: `api/app/${type}/edit`,
    method: 'post',
    data: data
  })
}

export function getInfoByID(type, id) {
  return request({
    url: `api/app/${type}/getById?id=${id}`,
    method: 'get'
  })
}

export function chineseName2Pinyin(chineseName) {
  return request({
    url: `/api/app/basicUserInfo/toPinyin?chineseName=${chineseName}`,
    method: 'get'
  })
}
export default { review, detail, remoeveMember, saveMember, generateVipNumber, getInfoByID, chineseName2Pinyin }
