declare namespace api.auth {
  function signin(parameters: {
    login: string;
    password: string;
  }): Promise<{ status: string; token: string }>;
  function signout(): Promise<{ status: string }>;
  function restore(parameters: { token: string }): Promise<{ status: string }>;
}
