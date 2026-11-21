import { handleAdminRequest, type BackendEnv } from '../../backend/admin-core';

export default {
  async fetch(request: Request, env: BackendEnv): Promise<Response> {
    return handleAdminRequest(request, env);
  },
};
