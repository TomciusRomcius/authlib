import mongoose from "npm:mongoose";
import { generateJWT, readJWT, sign, verify } from "./jwt.ts";

export type AuthConfigType = {
  databaseURL: string;
  authProviders: {};
}

class EmailPassword {
  constructor() {
    
  }
}

class ServerAuth {
  
  public constructor(config: AuthConfigType) {
    this.config = config;
  }
  
  public async initialize() {
    await mongoose.connect(this.config.databaseURL);
  }

  public async signUp() {

  }
  public async signIn() {

  }

  private config: AuthConfigType;
}


let token = await generateJWT({
  username: "Heloo",
  password: "aaa",
});
console.log(await readJWT(token));
