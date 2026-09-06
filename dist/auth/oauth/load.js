let bundledLoaders;
/** Registers statically bundled OAuth flows for standalone Bun binaries. */
export function registerBundledOAuthFlowLoaders(loaders) {
    bundledLoaders = loaders;
}
/**
 * Loads an OAuth flow module through a literal dynamic import so bundlers
 * can follow it into the Node-only flow code (`node:http` callback servers,
 * `node:crypto` PKCE) while keeping lazy semantics: nothing is loaded
 * until the flow is requested.
 */
export const loadAnthropicOAuth = async () => {
    if (bundledLoaders)
        return bundledLoaders.anthropic();
    return (await import("./anthropic.js")).anthropicOAuth;
};
export const loadOpenAICodexOAuth = async () => {
    if (bundledLoaders)
        return bundledLoaders.openaiCodex();
    return (await import("./openai-codex.js")).openaiCodexOAuth;
};
export const loadGitHubCopilotOAuth = async () => {
    if (bundledLoaders)
        return bundledLoaders.githubCopilot();
    return (await import("./github-copilot.js")).githubCopilotOAuth;
};
export const loadOpenRouterOAuth = async () => {
    if (bundledLoaders)
        return bundledLoaders.openrouter();
    return (await import("./openrouter.js")).openRouterOAuth;
};
export const loadKimiCodingOAuth = async () => {
    if (bundledLoaders)
        return bundledLoaders.kimiCoding();
    return (await import("./kimi-coding.js")).kimiCodingOAuth;
};
export const loadXaiOAuth = async () => {
    if (bundledLoaders)
        return bundledLoaders.xai();
    return (await import("./xai.js")).xaiOAuth;
};
export const loadRadiusOAuth = async (options) => {
    if (bundledLoaders)
        return bundledLoaders.radius(options);
    return (await import("./radius.js")).createRadiusOAuth(options);
};
//# sourceMappingURL=load.js.map