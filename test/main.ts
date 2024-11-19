import { PasswordAuth } from "@authlib/main.ts";

const auth = await PasswordAuth.create({
  mongoURL: "mongodb://root:rootpassword@mongo-db:27017"
});

try {
  await auth.signUp("new email", "new password");
}
catch { }
console.log(await auth.signIn("new email", "new password"));

