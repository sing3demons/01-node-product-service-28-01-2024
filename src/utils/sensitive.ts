// export {
//     maskNumber: (mobileNo: string):string => `${mobileNo.substring(0, 3)}-xxx-${mobileNo.substring(7, 11)}`

import ignoreCase from './ignore.js'

// }
interface Sensitive {
  maskNumber(mobileNo: string): string
  maskEmail(email: string): string
  maskPassword(password: string): string
  masking(item: any): void
}

const sensitive: Sensitive = {
  maskNumber: (mobileNo: string): string => {
    if (mobileNo.length >= 10) {
      return `${mobileNo.substring(0, 3)}-xxx-${mobileNo.substring(7, 11)}`
    }
    return mobileNo
  },
  maskEmail: (email: string): string => {
    // email
    const rex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    if (!rex.test(email)) {
      return email
    } else {
      let [first, second] = email.split('@')
      if (first.length > 2) {
        const mask = first.substring(3, first.length)
        const notMask = first.substring(0, 3)
        first = notMask + 'X'.repeat(mask.length)
      } else {
        first = first.replace(first.substring(1, first.length), 'X'.repeat(first.length - 1))
      }
      return `${first}@${second}`
    }
  },
  maskPassword: (password: string): string => password.replace(password, '********'),
  masking: (item: any) => {
    for (const key in item) {
      if (ignoreCase.equal(key, 'password')) {
        item[key] = sensitive.maskPassword(item[key])
      } else if (ignoreCase.equal(key, 'email')) {
        item[key] = sensitive.maskEmail(item[key])
      } else if (ignoreCase.equal(key, 'mobileNo')) {
        item[key] = sensitive.maskNumber(item[key])
      } else if (ignoreCase.equal(key, 'phone')) {
        item[key] = sensitive.maskNumber(item[key])
      } else if (typeof item[key] === 'object') {
        sensitive.masking(item[key])
      }
    }
  }
}

export default sensitive
