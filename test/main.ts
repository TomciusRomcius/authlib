import { PasswordAuth } from "@authlib/main.ts";

console.log(Deno.env.get("AUTH_KEY"));
const auth = await PasswordAuth.create({
  mongoURL: "mongodb://root:rootpassword@mongo-db:27017",
  authKey: Deno.env.get("AUTH_KEY")!,
});

try {
  await auth.signUp("new email", "new password");
}
catch { }
console.log(await auth.signIn("new email", "new password"));

