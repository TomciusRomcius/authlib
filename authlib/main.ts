import mongoose from "npm:mongoose";
import JWT from "./jwt.ts";

type AuthConfig = {
  mongoURL: string;
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
    this.connection = await mongoose.connect(this.config.mongoURL);
  }

  public async signUp(email: string, password: string): Promise<string> {
    // Add user to the database
    

    // Create a JWT token
    return await this.jwt.generateJWT({ email, password });
  }
  public async signIn(email: string, password: string) {}
}