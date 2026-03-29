/**
 * 扁平数组树形化
 * @param {*} arr 数据源
 * @param {*} id id字段名 默认 'id'
 * @param {*} parentId 父节点字段名 默认 'parentId'
 * @param {*} children 孩子节点字段名 默认 'children'
 */
export const handleTree = (arr, id, parentId, children) => {
  // 配置字段名参数
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    children: children || 'children'
  }

  // 建立映射
  const map = {}
  arr.forEach(item => {
    const id = item[config.id]
    map[id] = item
    if (!item[config.children]) {
      item[config.children] = []
    }
  });

  // 构造树型结构
  const tree = []
  arr.forEach(item => {
    const parentId = item[config.parentId]
    const children = config.children

    if (parentId === 0) {
      tree.push(item)
    } else {
      map[parentId][children].push(item)
    }
  });
  return tree
}

// 日期格式化
export const parseTime = (time, pattern) => {
  if (!time) return null

  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 时间格式化
export const formatTime = (time, option) => {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}