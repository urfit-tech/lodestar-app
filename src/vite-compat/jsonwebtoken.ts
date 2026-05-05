import { decodeJwtPayload } from '../helpers/jwt'

const jsonwebtoken = {
  decode: decodeJwtPayload,
}

export const decode = decodeJwtPayload
export default jsonwebtoken
