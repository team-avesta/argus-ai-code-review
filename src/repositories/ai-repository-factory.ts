import { BaseAIReviewRepository } from './base-ai-repository';
import { OpenAIReviewRepository } from './openai-repository';
import { ClaudeAIReviewRepository } from './claude-repository';
import { AIReviewConfig } from '../prompts/system-prompts';

export class AIRepositoryFactory {
  /**
   * Creates an AI repository instance based on the specified model
   * @param config The AI review configuration
   * @returns An instance of the appropriate AI repository
   */
  static createRepository(config: AIReviewConfig): BaseAIReviewRepository {
    const model = config.model || process.env.AI_REVIEW_MODEL || 'gpt-4-turbo-preview';

    // Check if API key is set
    if (!process.env.AI_PROVIDER_API_KEY) {
      console.warn('AI_PROVIDER_API_KEY environment variable is not set');
    }

    // Determine provider based on model name
    if (model.startsWith('claude')) {
      return new ClaudeAIReviewRepository(config);
    } else if (model.startsWith('gpt')) {
      return new OpenAIReviewRepository(config);
    } else {
      // Default to OpenAI if model doesn't match known patterns
      return new OpenAIReviewRepository(config);
    }
  }
}
