var xdebug = window.myDebug('COIN:reducer:post');

export const utilPostStatusToString = (status) => {
    var statusString = '';
    switch (status) {
    case 0: statusString = '草案'; break;
    case 1: statusString = '等待审核'; break;
    case 2: statusString = '已发布'; break;
    case 3: statusString = '审核失败'; break;
    case 4: statusString = '已下架'; break;
    case 5: statusString = '等待中签号'; break;
    case 6: statusString = '已结束'; break;
    default: statusString = '未知'; break;
    }
    return statusString;
}
