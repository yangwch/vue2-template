import Mmbs from 'mmbs'
import { mmbsURL, appId } from '@/config/env'

Mmbs.initialize(appId)
Mmbs.serverURL = mmbsURL

export default {
  /**
   * 保存
   * @param collectionName {String} - 集合名称
   * @param obj {Object} - 保存的对象
   */
  save (collectionName, obj) {
    var Score = Mmbs.Object.extend(collectionName)
    var scoreObj = new Score()
    return new Promise((resolve, reject) => {
      scoreObj.save(obj, {
        success (model) {
          resolve(model)
        },
        error (model, error) {
          if (process.env.NODE_ENV == 'development') {
            console.error(`save ${collectionName} error`, error)
          }
          reject(error)
        }
      })
    })
  },
  /** 
   * 更新数据
   * objectId {String} - 数据id
   * data {Object} - 对象
  */
  update (collectionName, objectId, data) {
    var score = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(score)
    return new Promise((resolve, reject) => {
      query.get(objectId, {
        success (score) {
          // 保存
          score.save(data, {
            success (result) {
              resolve(result)
            },
            error (error) {
              reject(error)
            }
          })
        },
        error (error) {
          reject(error)
        }
      })
    })
  },
  /**
   * 删除
   * collectionName {String} - 集合名称
   * objectId {String} - 对象id
   */
  delete (collectionName, objectId) {
    var score = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(score)
    return new Promise((resolve, reject) => {
      query.get(objectId, {
        success (score) {
          score.destroy({
            success (result) {
              resolve(result)
            },
            error (error) {
              reject(error)
            }
          })
        },
        error (error) {
          reject(error)
        }
      })
    })
  },
  /**
   * 查询，分页，条件
   * collectionName {String} - 集合名称
   * options {Object} - 选项
   */
  query (collectionName, options = {page: 1, rows: 15, params: {}}) {
    var score = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(score)
    let paramNames = Object.getOwnPropertyNames(options.params || {})
    if (paramNames.length) {
      paramNames.map(item => {
        let val = options.params[item]
        if (val && typeof val === 'string') {
          query.matches(item, new RegExp(val))
        } else if (val && typeof val === 'object') {
          query[val.type] && query[val.type](val.field || item, val.value)
        }
      })
    }
    let page = options.page || 1,
      limit = options.rows || 15,
      skip = (page - 1) * limit
    return new Promise((resolve, reject) => {
      query.count({
        success (count) {
          query.limit(limit)
          query.skip(skip)
          query.find({
            success (results) {
              resolve({
                result: {
                  total: count,
                  rows: results
                }
              })
            },
            error (error) {
              reject(error)
            }
          })
        },
        error (error) {
          reject(error)
        }
      })
    })
  },
  /* 查找列表所有记录 */
  find (collectionName) {
    var score = Mmbs.Object.extend(collectionName)
    var query = new Mmbs.Query(score)
    return new Promise((resolve, reject) => {
      query.find({
        success (results) {
          resolve(results)
        },
        error (error) {
          if (process.env.NODE_ENV == 'development') {
            console.error(`find ${collectionName} error`, error)
          }
          reject(error)
        }
      })
    })
  },
  /**
   * 登录
   * data {Object} - 提交对象
   */
  login (data) {
    return new Promise((resolve, reject) => {
      Mmbs.User.logIn(data.username, data.password, {
        success: resolve,
        error: reject
      })
    })
  },
  // Mmbs实例
  getMmbs () {
    return Mmbs
  }
}