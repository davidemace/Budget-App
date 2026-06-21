import { routeRequest } from './router.js';

export default {
  async fetch(request, env, ctx) {
    return routeRequest(request, env, ctx);
  }
};
