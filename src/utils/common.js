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

// 时间日期格式化
export const formatDate = () => {
  
}