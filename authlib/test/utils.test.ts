import { expect } from "jsr:@std/expect/expect";
import { safeJsonParse } from "../utils.ts";

Deno.test("Safe JSON parse", async (t) => {
  await t.step("should correctly parse normal JSON objects", () => {
    const obj = {
      name: "Justin",
      age: 25,
      country: "Germany",
    };
    const parsed = safeJsonParse(JSON.stringify(obj));

    expect(parsed.name).toBe(obj.name);
    expect(parsed.age).toBe(obj.age);
    expect(parsed.country).toBe(obj.country);
  });

  await t.step("should prevent prototype poisoning", () => {
    const json = '{"__proto__":{"admin": true}}';
    expect(safeJsonParse(json)).toEqual({});
  });
});
