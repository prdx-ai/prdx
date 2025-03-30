/**
 * Media Generation Provider Registry
 * Central registry for all image and video generation providers
 */

export type MediaType = "image" | "video";

export interface MediaProvider {
  id: string;
  name: string;
  description: string;
  type: MediaType;
  generate: (prompt: string, options?: any) => Promise<MediaGenerationResult>;
  isAvailable: () => boolean;
}

export interface MediaGenerationResult {
  type: MediaType;
  url: string;
  prompt: string;
  revisedPrompt?: string;
  metadata?: Record<string, any>;
}

// Registry to store all available media providers
const mediaRegistry = new Map<string, MediaProvider>();

/**
 * Register a new media provider
 */
export function registerMediaProvider(provider: MediaProvider) {
  mediaRegistry.set(provider.id, provider);
}

/**
 * Get a media provider by ID
 */
export function getMediaProvider(id: string): MediaProvider | undefined {
  return mediaRegistry.get(id);
}

/**
 * Get all registered media providers
 */
export function getAllMediaProviders(): MediaProvider[] {
  return Array.from(mediaRegistry.values());
}

/**
 * Get all media providers by type
 */
export function getMediaProvidersByType(type: MediaType): MediaProvider[] {
  return getAllMediaProviders().filter((provider) => provider.type === type);
}

/**
 * Get all available media providers (those with API keys configured)
 */
export function getAvailableMediaProviders(): MediaProvider[] {
  return getAllMediaProviders().filter((provider) => provider.isAvailable());
}

/**
 * Get available media providers by type
 */
export function getAvailableMediaProvidersByType(
  type: MediaType,
): MediaProvider[] {
  return getAvailableMediaProviders().filter(
    (provider) => provider.type === type,
  );
}

/**
 * Get default media provider for a specific type
 */
export function getDefaultMediaProvider(type: MediaType): string {
  const available = getAvailableMediaProvidersByType(type);
  if (available.length === 0) return "";

  // Prefer OpenAI for images if available
  if (type === "image") {
    const openai = available.find((p) => p.id === "openai-image");
    if (openai) return openai.id;
  }

  // Otherwise return the first available provider
  return available[0].id;
}
