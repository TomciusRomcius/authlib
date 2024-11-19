import { sign, verify } from "./signVerify.ts";
import { safeJsonParse } from "./utils.ts";

// For UTF-8 strings
export function stringToBinary(data: string) {
  const buffer = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    buffer[i] = data.charCodeAt(i);
  }

  return buffer;
}

export type JWTToken<T> = {
  header: {
    alg: string;
    type: "JWT";
  };

  payload: T;
};

export default class JWT {
  private strKey: string;
  private key!: CryptoKey;

  public static async create(key: string): Promise<JWT> {
    const jwt = new JWT(key);

    // If initialization of the key fails an error is thrown
    await jwt.initialize();
    return jwt;
  }

  private constructor(key: string) {
    this.strKey = key;
  }

  // Initialize the key
  private async initialize() {
    const keyBytes = stringToBinary(this.strKey);

    this.key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign", "verify"]
    );
  }
  
  public async generateJWT<T>(payload: T): Promise<string> {
    const header = {
      type: "JWT",
      alg: "HS256",
    };

    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    const signature = await sign(this.key, `${headerBase64}.${payloadBase64}`);

    const token = `${headerBase64}.${payloadBase64}.${signature}`;

    return token;
  }

  public async readJWT<T>(token: string): Promise<JWTToken<T>> {
    const tokenParts = token.split(".", 3);
    const header = tokenParts[0];
    const payload = tokenParts[1];
    const signature = tokenParts[2];

    if (!(await verify(this.key, signature, `${header}.${payload}`))) {
      throw new Error("The JWT token has been tampered with");
    }

    const result = {
      header: safeJsonParse(atob(tokenParts[0])),
      payload: safeJsonParse(atob(tokenParts[1])),
    };

    return result;
  }
}