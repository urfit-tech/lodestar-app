import CryptoJS from 'crypto-js'

/**
 * Converts an ArrayBuffer to a WordArray.
 * @param {ArrayBuffer} arrayBuffer - The ArrayBuffer to convert.
 * @returns {CryptoJS.lib.WordArray} - The converted WordArray.
 */
const convertArrayBufferToWordArray = (arrayBuffer: ArrayBuffer): CryptoJS.lib.WordArray => {
  return CryptoJS.lib.WordArray.create(arrayBuffer as unknown as number[])
}

/**
 * Pads a hex string to a specified length.
 * @param {string} hexString - The hex string to pad.
 * @param {number} targetLength - The target length of the string.
 * @returns {string} - The padded hex string.
 */
const padHexString = (hexString: string, targetLength: number): string => {
  return hexString.length < targetLength ? hexString.padEnd(targetLength, '0') : hexString
}

/**
 * Generates a cryptographic key using PBKDF2.
 * @param {string} hexString - The hexadecimal string for generating the key.
 * @param {number} keySize - The size of the key.
 * @returns {CryptoJS.lib.WordArray} - The generated cryptographic key.
 */
const generateCryptoKey = (hexString: string, keySize: number): CryptoJS.lib.WordArray => {
  const paddedHexString = padHexString(hexString, keySize * 8)
  const salt = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_EBOOK_SALT as string)
  const iterations = Number(process.env.REACT_APP_EBOOK_ITERATION)

  return CryptoJS.PBKDF2(paddedHexString, salt, {
    keySize: keySize,
    iterations: iterations,
  })
}

/**
 * Performs the AES decryption.
 * @param {string} encryptedBase64 - The encrypted data in Base64 format.
 * @param {CryptoJS.lib.WordArray} key - The cryptographic key.
 * @param {CryptoJS.lib.WordArray} iv - The initialization vector.
 * @returns {ArrayBuffer} - The decrypted data as ArrayBuffer.
 */
const performDecryption = (
  encryptedBase64: string,
  key: CryptoJS.lib.WordArray,
  iv: CryptoJS.lib.WordArray,
): ArrayBuffer => {
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return convertWordArrayToArrayBuffer(decrypted.words)
}

/**
 * Converts a WordArray to an ArrayBuffer.
 * @param {Array<number>} wordArray - The WordArray to convert.
 * @returns {ArrayBuffer} - The converted ArrayBuffer.
 */
const convertWordArrayToArrayBuffer = (wordArray: Array<number>): ArrayBuffer => {
  const byteArray = new Uint8Array(wordArray.length * 4)
  for (let i = 0; i < wordArray.length; i++) {
    byteArray[i * 4] = (wordArray[i] >> 24) & 0xff
    byteArray[i * 4 + 1] = (wordArray[i] >> 16) & 0xff
    byteArray[i * 4 + 2] = (wordArray[i] >> 8) & 0xff
    byteArray[i * 4 + 3] = wordArray[i] & 0xff
  }

  return byteArray.buffer
}

/**
 * Decrypts encrypted data using AES algorithm.
 * @param {ArrayBuffer} encryptedData - The data to be decrypted.
 * @param {string} keyHex - The hexadecimal string of the key.
 * @param {string} ivHex - The hexadecimal string of the initialization vector (IV).
 * @returns {ArrayBuffer} - The decrypted data.
 */
export const decryptData = (encryptedData: ArrayBuffer, keyHex: string, ivHex: string): ArrayBuffer => {
  const encryptedWordArray = convertArrayBufferToWordArray(encryptedData)
  const key = generateCryptoKey(keyHex, 256 / 32) // refer to lodestar-server setting
  const iv = generateCryptoKey(ivHex, 128 / 32) // refer to lodestar-server setting

  const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedWordArray)
  return performDecryption(encryptedBase64, key, iv)
}
