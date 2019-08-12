// 获取指定时区的Date对象
const UTCDate = function(time, UTC) {
  let d = new Date(time)
  let localOffset = new Date().getTimezoneOffset() / 60
  d.setHours(d.getHours() + (UTC || -8 - localOffset))
  return d
}

// 给小于10的数前面添加0
const addZero = function(number) {
  var _number = parseInt(number)
  if (_number < 10) {
    return '0' + _number
  }
  return _number
}

// 获取周几
const getWeekDay = function(day) {
  let weekDayObj = {
    '0': '周日',
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六'
  }
  return weekDayObj[day]
}

// 年-月-日 或 年-月 转换成日历数组
const getCanlendar = function(d, needZero) {
  let dateObj = new Date(d)
  let month = dateObj.getMonth() + 1
  let year = dateObj.getFullYear()
  let date = dateObj.getDate()
  let day = dateObj.getDay()
  let nextYear = false
  let nextMonth = false
  if (year > new Date().getFullYear()) {
    nextYear = true
  }
  if (month > new Date().getMonth() + 1) {
    nextMonth = true
  }
  // 获取当月天数
  let totalDays = 30
  if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
    totalDays = 31
  } else if (month === 4 || month === 6 || month === 9 || month === 11) {
    totalDays = 30
  } else if (month === 2) {
    if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
      totalDays = 29
    } else {
      totalDays = 28
    }
  }
  // 获取第一天对应的位置
  let shortOfDate = date - 1
  let firstDay = day - shortOfDate % 7
  if (firstDay < 0) {
    firstDay += 7
  }
  firstDay += 1
  if (firstDay > 7) {
    firstDay = 1
  }
  let canlendar = []
  for (let i = 1; i < firstDay; i++) {
    canlendar.push({
      time: 0,
      date: '',
      today: 0,
      ymd: '',
      day: ''
    })
  }
  for (let i = 1; i <= totalDays; i++) {
    let _date = i
    if (needZero) {
      _date = addZero(_date)
    }
    const _week = getWeekDay((i + firstDay - 2) % 7)
    if (i < date) {
      canlendar.push({
        time: UTCDate(year + '-' + addZero(month) + '-' + addZero(i)).getTime(),
        date: _date,
        today: (nextYear || nextMonth) ? 3 : 1,
        ymd: year + '-' + addZero(month) + '-' + addZero(i),
        day: _week
      })
    }
    if (i === date) {
      canlendar.push({
        time: UTCDate(year + '-' + addZero(month) + '-' + addZero(i)).getTime(),
        date: _date,
        today: (nextYear || nextMonth) ? 3 : 2,
        ymd: year + '-' + addZero(month) + '-' + addZero(i),
        day: _week
      })
    }
    if (i > date) {
      canlendar.push({
        time: UTCDate(year + '-' + addZero(month) + '-' + addZero(i)).getTime(),
        date: _date,
        today: 3,
        ymd: year + '-' + addZero(month) + '-' + addZero(i),
        day: _week
      })
    }
  }
  /* 最终返回日期数组
  例如
  [
    {
      time: 0,
      date: '',
      today: 0,
      ymd: '',
      day: ''
    },
    {
      time: 0,
      date: 1,
      today: 1,
      ymd: '2018-6-1',
      day: '周一'
    },
    {
      time: 0,
      date: 2,
      today: 2,
      ymd: '2018-6-2',
      day: '周二'
    },
    {
      time: 0,
      date: 3,
      today: 3,
      ymd: '2018-6-3',
      day: '周三'
    }
  ]
  today有三个值
  0表示该date对象是空白
  1表示该date对象早于传入对象的date
  2表示该date对象等于传入对象的date
  3表示该date对象晚于传入对象的date */
  return canlendar
}

// 毫秒数转化成天，时，分，秒用于倒计时
const getTime = function(time, zero) {
  // ms
  let day = parseInt(time / (24 * 60 * 60 * 1000))
  time -= day * 24 * 60 * 60 * 1000
  let hour = zero ? addZero(parseInt(time / (60 * 60 * 1000))) : parseInt(time / (60 * 60 * 1000))
  time -= hour * 60 * 60 * 1000
  let minute = zero ? addZero(parseInt(time / (60 * 1000))) : parseInt(time / (60 * 1000))
  time -= minute * 60 * 1000
  let second = zero ? addZero(parseInt(time / (1000))) : parseInt(time / (1000))
  time -= second * 1000
  return {
    day: day == 0 ? 0 : day,
    hour: hour == 0 ? 0 : hour,
    minute: minute == 0 ? 0 : minute,
    second: second == 0 ? 0 : second
  }
}

// 根据时间戳返回 年 月 日 时 分 秒
const getDateObj = function(time, zero) {
  let d = new Date(time)
  let year = d.getFullYear()
  let month = zero ? addZero(d.getMonth() + 1) : d.getMonth() + 1
  let date = zero ? addZero(d.getDate()) : d.getDate()
  let hour = zero ? addZero(d.getHours()) : d.getHours()
  let minute = zero ? addZero(d.getMinutes()) : d.getMinutes()
  let second = zero ? addZero(d.getSeconds()) : d.getSeconds()
  let obj = {
    year,
    month,
    date,
    hour,
    minute,
    second
  }
  obj.ymdhms = obj.year + '-' + obj.month + '-' + obj.date + ' ' + obj.hour + ':' + obj.minute + ':' + obj.second
  obj.ymd = obj.year + '-' + obj.month + '-' + obj.date
  return obj
}

// 获取字符串字符长度
const textLength = function(str, check) {
  // check为true表示验证是否为纯汉字或者非纯汉字
  var realLength = 0
  var len = str.length
  var charCode = -1
  var chinese = 0
  var english = 0
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      if (check) {
        if (chinese != 0) {
          return false
        }
        english++
      }
      realLength += 1
    } else {
      if (check) {
        if (english != 0) {
          return false
        }
        chinese++
      }
      realLength += 2
    }
  }
  if (check) {
    if (chinese > 0) {
      return 'cn'
    } else {
      return 'en'
    }
  } else {
    return realLength
  }
}

// 截取字符串并在截断处添加字符串
const subStrCN = function(str, len, suffix) {
  // subStrCN(title, 66, "...");
  if (!str || !len) {
    return ''
  }
  // 预期计数：中文2字节，英文1字节
  var a = 0
  // 循环计数
  var i = 0
  // 临时字串
  var temp = ''
  var chineseRegex = '/[^\x00-\xff]/g'
  var strLength = str.replace(chineseRegex, '**').length
  var singleChar = ''
  for (i = 0; i < strLength; i++) {
    singleChar = str.charAt(i).toString()
    // 按照预期计数增加2
    if (singleChar.match(chineseRegex) != null) {
      // if (str.charCodeAt(i) > 255) {
      a += 2
    } else {
      a++
    }
    // 如果增加计数后长度大于限定长度，就直接返回临时字符串
    // 截取之后，增加后缀
    if (a > len) {
      if (typeof suffix === 'string' && suffix.length > 0) {
        return temp + suffix
      } else {
        return temp
      }
    } else {
      // 将当前内容加到临时字符串
      temp += singleChar
    }
  }
  // 如果不需要截取，就直接返回源字符串
  return str
}
// 深拷贝
const extend = function() {
  // 深拷贝 例子 extend(true, target, source)
  // 浅拷贝 例子 extend(target, source)
  let option
  let target = arguments[0] || {}
  let i = 1
  let length = arguments.length
  let deep = false
  // 判断是否为深拷贝
  if (typeof(target) === 'boolean') {
    deep = target
    target = arguments[1] || {}
    i++
  }
  // 判断被拷贝对象是Object
  // 陷阱！！typeof(null) === 'object' true
  if (typeof(target) !== 'object' || target === null) {
    target = {}
  }
  // 判断是非为只传了一个参数
  // 只传一个就返回参数的拷贝,因此i从第0个开始
  if (i === length) {
    target = {}
    i--
  }
  // 开始拷贝
  for (; i < length; i++) {
    // 拷贝者需要为一个Object
    option = arguments[i] // {a : 1, b : 2}
    if (option !== null && typeof(option) === 'object') {
      for (var name in option) {
        // 获取被拷贝对象的同名键值
        var src = target[name]
        // 拷贝对象的键值
        var copy = option[name]
        // 防止环引用
        // 如果拷贝对象的键值===被拷贝对象
        // 被拷贝对象可以通过自身的键不停的去找到自身，形成死循环
        if (target === copy) {
          continue
        }
        if (deep && typeof(copy) === 'object' && copy !== null) {
          if (Array.isArray(copy)) {
            src = src && Array.isArray(src) ? src : []
          } else {
            src = src && typeof(src) === 'object' && !Array.isArray(src) ? src : {}
          }
          target[name] = extend(deep, src, copy)
        } else {
          target[name] = copy
        }
      }
    }
  }
  return target
}

// 类型检测，typeof缺陷太大，Object.prototype.toString.call(obj)能解决95%的问题
const type = function (obj) {
  let type = Object.prototype.toString.call(obj)
  type = type.replace(/[\[\]]/g, '')
  return type.split('object ')[1]
}

// 获取地址栏参数对象
const getSearchObj = function (url) {
  let _obj = {}
  let search = url || window.location.search.substring(1)
  let _arr = search.split('&')
  for (let i in _arr) {
    let _key = _arr[i].split('=')[0]
    let _value = _arr[i].split('=')[1]
    _obj[_key] = _value
  }
  return _obj
}

module.exports = {
  // 年-月-日 或 年-月 转换成日历数组
  getCanlendar,
  // 毫秒数转化成天，时，分，秒用于倒计时
  getTime,
  // 根据时间戳返回 年 月 日 时 分 秒
  getDateObj,
  // 获取周几
  getWeekDay,
  // 给小于10的数前面添加0
  addZero,
  // 获取指定时区的Date对象
  UTCDate,
  // 获取字符串字符长度
  textLength,
  // 截取字符串并在截断处添加字符串
  subStrCN,
  // 深拷贝
  extend,
  // 类型检测
  type,
  // 获取地址栏参数对象
  getSearchObj
}