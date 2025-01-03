import { ApiHandler } from './handlers/apiHandler';
import { ChannelService } from './services/channelService';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const handler = new ApiHandler(env);
    return handler.handleRequest();
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const service = new ChannelService(env);
    await service.fetchAndCacheChannels();
  },
};