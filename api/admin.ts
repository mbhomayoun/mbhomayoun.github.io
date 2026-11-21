import { handleAdminRequest, type BackendEnv } from '../backend/admin-core';

export const config = {
  runtime: 'edge',
};

function getEnv(): BackendEnv {
  return {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_REPO: process.env.GITHUB_REPO,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  };
}

export default async function handler(req: Request): Promise<Response> {
  return handleAdminRequest(req, getEnv());
}
