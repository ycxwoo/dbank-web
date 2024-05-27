import { CookiesManager } from '@/utils/cookie'

const TokenKey = 'Admin-Token'

export function SetToken(token: string) {
  return CookiesManager.set(TokenKey, token)
}

export function GetToken() {
  return CookiesManager.get(TokenKey)
}

export function RemoveToken() {
  return CookiesManager.remove(TokenKey)
}
