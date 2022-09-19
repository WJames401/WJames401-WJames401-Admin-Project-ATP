//获取品牌管理数据
import request from '@/utils/request';
//获取品牌列表接口  
export const reqTradeMarkList = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get',
})

//添加品牌和修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //带给服务器修改携带ID
    if (tradeMark.id) {
        return request({ url: `admin/product/baseTrademark/update`, method: 'put', data: tradeMark })
    } else {
        return request({ url: `admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
    }
}

//删除品牌
export const reqDeleteTradeMark = (id) => request({ url: `admin/product/baseTrademark/remove/${id}`, method: 'delete' })