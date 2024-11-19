import { expect } from "jsr:@std/expect";
import JWT from "../jwt.ts";

const key = "0a526a90a85596dcb3669fd86963422969edbbf7c4752492d780b78e6355d4ee";

Deno.test("JWT logic", async (t) => {
  await t.step("create() should succesfully create a JWT instance", async () => {
    const jwt = await JWT.create(key);
    expect(jwt instanceof JWT).toBe(true);
        
    const payload = {
      username: "testuser",
      password: "testpass"
    };

    const token = await jwt.generateJWT(payload);
    
    // Check token structure
    const parts = token.split('.');
    expect(parts.length).toBe(3);
    
    // Verify each part is base64 encoded
    expect(typeof parts[0]).toBe('string');
    expect(typeof parts[1]).toBe('string');
    expect(typeof parts[2]).toBe('string');
    
    // Decode and verify header
    const header = JSON.parse(atob(parts[0]));
    expect(header.type).toBe("JWT");
    expect(header.alg).toBe("HS256");
  });

  await t.step("readJWT() should correctly read and verify a valid token", async () => {
    const jwt = await JWT.create(key);
    const payload = {
      username: "testuser",
      password: "testpass"
    };
    const token = await jwt.generateJWT(payload);
    const tokenDecoded = await jwt.readJWT(token);
    expect(tokenDecoded.payload.username).toBe(payload.username);
    expect(tokenDecoded.payload.password).toBe(payload.password);
  });

  await t.step("readJWT() should reject tokens that have been tampered with", async () => {
    const jwt = await JWT.create(key);
    const originalPayload = {
      username: "testuser",
      password: "testpass"
    };
    const payload = {
      username: "testuser",
      password: "testpass"
    };
    
    const token = await jwt.generateJWT(payload);
    const tamperedToken = token.slice(0, -1) + "X"; // Tamper with the signature
    await expect(jwt.readJWT(tamperedToken)).rejects.toThrow("The JWT token has been tampered with");
  });
});