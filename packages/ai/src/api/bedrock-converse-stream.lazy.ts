import type { ProviderStreams } from "../types.ts";
import { lazyApi } from "./lazy.ts";

let bedrockModuleOverride: ProviderStreams | undefined;

/**
 * Overrides the lazily loaded bedrock implementation. Used by the Bun
 * binary build, where dynamic imports cannot be bundled; the build
 * registers a statically imported module instead.
 */
export function setBedrockProviderModule(module: ProviderStreams): void {
	bedrockModuleOverride = module;
}

/**
 * Loads the bedrock implementation through a literal dynamic import so
 * bundlers can follow it into the Node-only AWS SDK while keeping lazy
 * semantics: nothing is loaded until the first stream call.
 */
export const bedrockConverseStreamApi = (): ProviderStreams =>
	lazyApi(async () => bedrockModuleOverride ?? ((await import("./bedrock-converse-stream.ts")) as ProviderStreams));
