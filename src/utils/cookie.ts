import Cookies from 'js-cookie'

export class CookiesManager {
  static set(key: string, value: string): void {
    Cookies.set(key, value)
  }

  static get(key: string): string | undefined {
    return Cookies.get(key)
  }

  static remove(key: string): void {
    Cookies.remove(key)
  }

  static setObj(key: string, value: any): void {
    Cookies.set(key, JSON.stringify(value))
  }

  static getObj(key: string): any {
    const value = Cookies.get(key)
    if (value) {
      return JSON.parse(value)
    }
    return undefined
  }

}
