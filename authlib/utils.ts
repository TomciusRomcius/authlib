/* 
__proto__ is disabled in Deno, but just in case, 
will add this safer JSON parse function :)
*/

// deno-lint-ignore no-explicit-any
const reviver = (key: string, value: any) =>
  key === "__proto__" ? undefined : value;

// deno-lint-ignore no-explicit-any
export function safeJsonParse(jsonText: string): any {
  return JSON.parse(jsonText, reviver);
}
