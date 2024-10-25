// import Cookies from 'js-cookie'

export class SessionStorage {
    static  set(key: string, value: string): void {
      sessionStorage.setItem(key, value)
    }

    static get(key: string): string | null {
        return sessionStorage.getItem(key)
    }

    static remove(key: string): void {
        sessionStorage.removeItem(key)
    }

    static setObj(key: string, value: any): void {
        this.set(key, JSON.stringify(value))
    }

    static getObj(key: string): any {
        const value = this.get(key)
        if (value) {
            return JSON.parse(value)
        }
        return null
    }

    static clear(){
        sessionStorage.clear();
    }

}
