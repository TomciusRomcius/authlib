import { expect } from "jsr:@std/expect/expect";
import { stringToBinary } from "../jwt.ts";
import { sign, verify } from "../signVerify.ts";

async function generateNewKey(keyText: string) {
  const keyBytes = stringToBinary(keyText);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"]
  );

  return key;
}

const keyText = "0a526a90a85596dcb3669fd86963422969edbbf7c4752492d780b78e6355d4ee";

Deno.test("Signing and verifying functions", async (t) => {
  await t.step("should succesfully generate a signature and verify it", async () => {
    const key = await generateNewKey(keyText);
    const data64 = btoa("Im data");
    const dataSign = await sign(key, data64);
    const verification = await verify(key, dataSign, data64);
    expect(verification).toBe(true);
  });

  await t.step("should throw an error if the data has been tampered with", async () => {
    const key = await generateNewKey(keyText);
    const data64 = btoa("Im data");
    const dataSign = await sign(key, data64);
    const chars = [...data64];
    chars[0] = "A";
    chars[1] = "D";
    const newData64 = chars.join('');
    expect(await verify(key, dataSign, data64)).toBe(true);
    expect(await verify(key, dataSign, newData64)).toBe(false);
  });
});