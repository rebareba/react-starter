const rule = {
  mobile: /^1[3456789]\d{9}$/,
  mail: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+(.[a-zA-Z0-9_-])+/,
  // 长度为2-31的大小写英文、中文-、_、.、和空格
  name: /^[\u4e00-\u9fa5a-zA-Z0-9-_.\s]{2,31}$/,
  // 长度为2-31的大小写英文、中文-_
  username: /^[\u4e00-\u9fa5a-zA-Z0-9-_]{2,31}$/,
  // 数字，长度为5
  verify: /^[0-9]{5}$/,
  range: (range) => RegExp(`/^{${range.join(',')}}$/`),
}
export default (type, value, range = [2, 12]) => {
  // 如果类型为range 则运行对应方法
  if (type === 'range') return RegExp(`^.{${range}}.$`).test(value)
  return rule[type] ? rule[type].test(value) : RegExp(type).test(value)
}
