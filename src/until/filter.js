const orderMap = value => {
    switch (value) {
        case 0:
            return '待支付'
        case 1:
            return '已支付'
        case 2:
            return '配货完成'
        case 3:
            return '出库成功'
        case 4:
            return '交易成功'
        case -1:
            return '手动关闭'
        case -2:
            return '商家关闭'
        case -3:
            return '用户退款'
        case -4:
            return '退款成功'
        default:
            return '未知状态'
    }
}
const time = value => {
    return value
        .toLocaleString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
}

export { orderMap, time }
