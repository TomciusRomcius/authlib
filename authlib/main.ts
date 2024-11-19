import mongoose from "npm:mongoose";
import JWT, { type JWTToken } from "./jwt.ts";
import UserModel from "./models/userModel.ts";

type AuthConfig = {
  mongoURL: string;
  authKey: string; 
};

export class PasswordAuth {
  jwt!: JWT;
  config: AuthConfig;
  connection!: mongoose.Mongoose;
  public static async create(config: AuthConfig): Promise<PasswordAuth> {
    const passwordAuth = new PasswordAuth(config);
    await passwordAuth.initialize();
    return passwordAuth;
  }

  private constructor(config: AuthConfig) {
    this.config = config;
  }

  private async initialize(): Promise<void> {
    console.log("Connecting");
    // TODO: read key from a config file
    this.jwt = await JWT.create(this.config.authKey);
    this.connection = await mongoose.connect(
      "mongodb://root:rootpassword@127.0.0.1:27017"
    );
    console.log("Connected");
  }

  public async authenticate<T>(jwtToken: string): Promise<JWTToken<T> | null> {
    try {
      return await this.jwt.readJWT(jwtToken);
    } catch {
      return null;
    }
  }

  public async signUp(email: string, password: string): Promise<string> {
    // TODO: Implement password encryption
    if (password.length < 8) throw new Error("Password too short!");
    const user = new UserModel({ email, password });
    await user.save();
    return await this.jwt.generateJWT({ email });
  }

  public async signIn(email: string, password: string): Promise<string | null> {
    const selectedUser = await UserModel.findOne({ email });
    if (selectedUser?.password === password) {
      console.log("WOO");
      return await this.jwt.generateJWT({ email });
    } else return null;
  }
}
