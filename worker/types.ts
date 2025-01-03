export interface Env {
  CHANNELS: KVNamespace;
  CACHE_KEY: string;
  IPV6_URL: string;
  IPV4_URL: string;
}

export interface CacheOptions {
  ttl?: number;
}