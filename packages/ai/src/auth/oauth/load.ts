import type { OAuthAuth } from "../types.ts";

type OAuthFlowLoaders = {
	anthropic: () => OAuthAuth | Promise<OAuthAuth>;
	openaiCodex: () => OAuthAuth | Promise<OAuthAuth>;
	githubCopilot: () => OAuthAuth | Promise<OAuthAuth>;
	openrouter: () => OAuthAuth | Promise<OAuthAuth>;
	kimiCoding: () => OAuthAuth | Promise<OAuthAuth>;
	meta: () => OAuthAuth | Promise<OAuthAuth>;
	xai: () => OAuthAuth | Promise<OAuthAuth>;
	radius: (options: { name: string; gateway: string }) => OAuthAuth | Promise<OAuthAuth>;
};

let bundledLoaders: OAuthFlowLoaders | undefined;

/** Registers statically bundled OAuth flows for standalone Bun binaries. */
export function registerBundledOAuthFlowLoaders(loaders: OAuthFlowLoaders): void {
	bundledLoaders = loaders;
}

/**
 * Loads an OAuth flow module through a literal dynamic import so bundlers
 * can follow it into the Node-only flow code (`node:http` callback servers,
 * `node:crypto` PKCE) while keeping lazy semantics: nothing is loaded
 * until the flow is requested.
 */
export const loadAnthropicOAuth = async (): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.anthropic();
	return ((await import("./anthropic.ts")) as { anthropicOAuth: OAuthAuth }).anthropicOAuth;
};

export const loadOpenAICodexOAuth = async (): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.openaiCodex();
	return ((await import("./openai-codex.ts")) as { openaiCodexOAuth: OAuthAuth }).openaiCodexOAuth;
};

export const loadGitHubCopilotOAuth = async (): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.githubCopilot();
	return ((await import("./github-copilot.ts")) as { githubCopilotOAuth: OAuthAuth }).githubCopilotOAuth;
};

export const loadOpenRouterOAuth = async (): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.openrouter();
	return ((await import("./openrouter.ts")) as { openRouterOAuth: OAuthAuth }).openRouterOAuth;
};

export const loadKimiCodingOAuth = async (): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.kimiCoding();
	return ((await import("./kimi-coding.ts")) as { kimiCodingOAuth: OAuthAuth }).kimiCodingOAuth;
};

export const loadMetaOAuth = async (): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.meta();
	return ((await import("./meta.ts")) as { metaOAuth: OAuthAuth }).metaOAuth;
};

export const loadXaiOAuth = async (): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.xai();
	return ((await import("./xai.ts")) as { xaiOAuth: OAuthAuth }).xaiOAuth;
};

export const loadRadiusOAuth = async (options: { name: string; gateway: string }): Promise<OAuthAuth> => {
	if (bundledLoaders) return bundledLoaders.radius(options);
	return (
		(await import("./radius.ts")) as {
			createRadiusOAuth: (input: { name: string; gateway: string }) => OAuthAuth;
		}
	).createRadiusOAuth(options);
};
