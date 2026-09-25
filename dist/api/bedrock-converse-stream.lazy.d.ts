import type { ProviderStreams } from "../types.ts";
/**
 * Overrides the lazily loaded bedrock implementation. Used by the Bun
 * binary build, where dynamic imports cannot be bundled; the build
 * registers a statically imported module instead.
 */
export declare function setBedrockProviderModule(module: ProviderStreams): void;
/**
 * Loads the bedrock implementation through a literal dynamic import so
 * bundlers can follow it into the Node-only AWS SDK while keeping lazy
 * semantics: nothing is loaded until the first stream call.
 */
export declare const bedrockConverseStreamApi: () => ProviderStreams;
//# sourceMappingURL=bedrock-converse-stream.lazy.d.ts.map