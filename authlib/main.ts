import mongoose from "npm:mongoose";
import JWT, { generateJWT, readJWT, sign, verify } from "./jwt.ts";

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

const jwt = await JWT.create("ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb");

let token = await jwt.generateJWT({
  username: "Heloo",
  password: "aaa",
});
console.log(await jwt.readJWT(token));
