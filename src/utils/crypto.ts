import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';

// base64 编码
export function encodeBase64(input: string): string {
    const wordArray = CryptoJS.enc.Utf8.parse(input); // 将输入字符串转换为 WordArray
    const base64String = Base64.stringify(wordArray); // 编码为 Base64 字符串
    return base64String;
}

// base64 解码
export function decodeBase64(encoded: string): string {
    const wordArray = Base64.parse(encoded); // 将 Base64 字符串解析为 WordArray
    const decodedString = CryptoJS.enc.Utf8.stringify(wordArray); // 转换为字符串
    return decodedString;
}

//生成MD5
export function md5sum(input: string): string {
    // 生成 MD5 哈希
    return MD5(input).toString(); // 转换为字符串
}