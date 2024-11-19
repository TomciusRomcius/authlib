/* 
__proto__ is disabled in Deno, but just in case, 
will add this safer JSON parse function :)
*/
const reviver = (key: string, value: any) =>
  key === "__proto__" ? undefined : value;

export function safeJsonParse(jsonText: string) {
  return JSON.parse(jsonText, reviver);
}
