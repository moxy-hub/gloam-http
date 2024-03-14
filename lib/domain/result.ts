/**
 * 后端返回基类
 */
export interface Result<T = any> {
  status: number
  success: boolean
  message: string
  data: T
}

/**
 * 后端返回数据类型
 */
export interface WebData<T = any> extends Result<T> {
}

/**
 * 后端返回集合数据类型
 */
export interface WebList<T = any> extends Result<Array<T>> {
  data: Array<T>
}

/**
 * 后端返回分页数据类型
 */
export interface WebPage<T = any> extends Result<Array<T>> {
  data: Array<T>
  pageNum: number
  pageSize: number
  total: number
}
