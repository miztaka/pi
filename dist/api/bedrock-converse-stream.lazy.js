import { lazyApi } from "./lazy.js";
let bedrockModuleOverride;
/**
 * Overrides the lazily loaded bedrock implementation. Used by the Bun
 * binary build, where dynamic imports cannot be bundled; the build
 * registers a statically imported module instead.
 */
export function setBedrockProviderModule(module) {
    bedrockModuleOverride = module;
}
/**
 * Loads the bedrock implementation through a literal dynamic import so
 * bundlers can follow it into the Node-only AWS SDK while keeping lazy
 * semantics: nothing is loaded until the first stream call.
 */
export const bedrockConverseStreamApi = () => lazyApi(async () => bedrockModuleOverride ?? (await import("./bedrock-converse-stream.js")));
//# sourceMappingURL=bedrock-converse-stream.lazy.js.map