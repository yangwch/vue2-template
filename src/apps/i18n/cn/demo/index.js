export default {
  gamelist: `{
    title: '游戏列表',
    collectionName: 'GameList',
    add: true,
    edit: true,
    columns: [
      {title: '名称', field: 'gameName', width: 150},
      {title: '公司名称', field: 'compony', width: 200},
      {title: '下载量', field: 'downloadNumber', type: 'number', width: 70, align: 'center'},
      {title: '发布时间', field: 'publishDate', type: 'date', width: 150, format: 'YYYY-MM-DD'},
      {title: '说明', field: 'remark', type: 'textarea'}
    ]
  }`
}