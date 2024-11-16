// Returns a base64 signature
export async function sign(key: CryptoKey, data64: string): Promise<string> {
  const textEncoder = new TextEncoder();
  const buf = await crypto.subtle.sign(
    {
      name: "HMAC",
    },
    key,
    textEncoder.encode(data64)
  );
  const bufArray = new Uint8Array(buf);
  const base64signature = btoa(String.fromCharCode(...bufArray));
  return base64signature;
}

export async function verify(
  key: CryptoKey,
  signature64: string,
  data64: string,
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
