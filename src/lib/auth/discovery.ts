export interface IDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint: string;
  jwks_uri: string;
  introspection_endpoint: string;
}

export interface IJWK {
    alg: string;
    e: string;
    n: string;
    kid: string;
    kty: string;
    use: string;
}
