import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";

type JWTToken = {
  header: {
    alg: string;
    type: "JWT";
  };
  payload: {
    username: string;
    password: string;
  };
};

const key = await crypto.subtle.generateKey(
  {
    name: "HMAC",
    hash: { name: "SHA-256" },
  },
  true,
  ["sign", "verify"]
);

// Returns a base64 key
export async function sign(data64: string): Promise<string> {
  const textEncoder = new TextEncoder();
  const buf = await crypto.subtle.sign(
    {
      name: "HMAC",
    },
    key,
    textEncoder.encode(data64)
  );
  const bufArray = new Uint8Array(buf);
  const base64String = btoa(String.fromCharCode(...bufArray));
  return base64String;
}

export async function verify(
  signature64: string,
  data64: string
): Promise<boolean> {
  const textEncoder = new TextEncoder();
  const binarySignature = atob(signature64);
  const signatureBuffer = new Uint8Array(binarySignature.length);
  for (let i = 0; i < binarySignature.length; i++) {
    signatureBuffer[i] = binarySignature.charCodeAt(i);
  }
  const dataBuffer = textEncoder.encode(data64);

  return await crypto.subtle.verify(
    {
      name: "HMAC",
    },
    key,
    signatureBuffer,
    dataBuffer
  );
}

export async function generateJWT(
  username: string,
  password: string
): Promise<string> {
  const header = {
    type: "JWT",
    alg: "HS256",
  };

  const payload = {
    username,
    password,
  };

  const headerBase64 = encodeBase64(JSON.stringify(header));
  const payloadBase64 = encodeBase64(JSON.stringify(payload));
  const signature = await sign(`${headerBase64}.${payloadBase64}`);

  const token = `${headerBase64}.${payloadBase64}.${signature}`;

  return token;
}

export async function readJWT(token: string): Promise<JWTToken> {
  // TODO: add a limit
  const tokenParts = token.split(".", 3);
  const header = tokenParts[0];
  const payload = tokenParts[1];
  const signature = tokenParts[2];

  if (!(await verify(signature, `${header}.${payload}`))) {
    throw new Error("The JWT token has been tampered with");
  }

  const result = {
    header: JSON.parse(atob(tokenParts[0])),
    payload: JSON.parse(atob(tokenParts[1])),
  };
  return result;
}
