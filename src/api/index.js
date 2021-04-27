import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const getCartList = query => {
    return request({
        url: '/api/admin/cart/getCartList',
        method: 'get',
        params: query
    });
};

export const editCart = query => {
    return request({
        url: '/api/admin/cart/editCart',
        method: 'post',
        params: query
    });
};

export const deleteCart = query => {
    return request({
        url: '/api/admin/cart/deleteCart',
        method: 'delete',
        params: query
    });
};

export const getOrderList = query => {
    return request({
        url: '/api/admin/order/getOrderList',
        method: 'get',
        params: query
    });
};

export const getOrderGoodList = query => {
    return request({
        url: '/api/admin/order/getOrderGoodList',
        method: 'get',
        params: query
    });
};

export const getOrderAddress = query => {
    return request({
        url: '/api/admin/order/getOrderAddress',
        method: 'get',
        params: query
    });
};

export const deleteOrder = query => {
    return request({
        url: '/api/admin/order/deleteOrder',
        method: 'delete',
        params: query
    });
};

export const getUserList = query => {
    return request({
        url: '/api/admin/user/getUserList',
        method: 'get',
        params: query
    });
};
export const editUser = query => {
    return request({
        url: '/api/admin/user/editUser',
        method: 'post',
        params: query
    });
};
export const deleteUser = query => {
    return request({
        url: '/api/admin/user/deleteUser',
        method: 'delete',
        params: query
    });
};



