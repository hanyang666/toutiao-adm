import request from '@/utils/request'

// 获取文章列表
export const getArticle = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

// 获取文章频道
export const getArticleChannels = () => {
  return request({
    method: '',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const getDeleArticle = articleID => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleID}`
  })
}
