import jwt from 'jsonwebtoken';
const privateKey = <string>process.env.PRIVATE_KEY;
const publicKey = <string>process.env.PUBLIC_KEY;

export function signJWT(object: string | object | Buffer, options?: jwt.SignOptions | undefined) {
  // console.log(privateKey);
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
}
