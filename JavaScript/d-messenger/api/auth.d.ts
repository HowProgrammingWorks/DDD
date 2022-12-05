declare namespace api {
  const auth: {
    signin(parameters: {
      login: string;
      password: string;
    }): Promise<{ status: string; token: string }>;
    signout(): Promise<{ status: string }>;
    restore(parameters: { token: string }): Promise<{ status: string }>;
  };
}
