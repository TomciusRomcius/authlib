import { PasswordAuth } from "@authlib/main.ts";
console.log("ba");

await PasswordAuth.create({
  mongoURL: "mongodb://mongo-db:27017"
});
