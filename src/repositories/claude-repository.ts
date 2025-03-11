import { BaseAIReviewRepository } from './base-ai-repository';
import {
  SYSTEM_PROMPTS,
  getPromptForEnabledRules,
  AIReviewConfig,
} from '../prompts/system-prompts';

export class ClaudeAIReviewRepository extends BaseAIReviewRepository {
  protected readonly API_URL = 'https://api.anthropic.com/v1/messages';
  protected readonly MODEL_NAME: string;
  private config: AIReviewConfig;

  constructor(config: AIReviewConfig) {
    super();
    this.config = config;
    this.MODEL_NAME = config.model || 'claude-3-5-sonnet-20241022';
  }

  protected async getHeaders(): Promise<HeadersInit> {
    const apiKey = process.env.AI_PROVIDER_API_KEY;

    if (!apiKey) {
      throw new Error('AI_PROVIDER_API_KEY environment variable is not set');
    }

    return {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };
  }

  protected formatRequestBody(prompt: string): unknown {
    const rulePrompts = getPromptForEnabledRules(this.config);

    return {
      model: this.MODEL_NAME,
      system: SYSTEM_PROMPTS,
      messages: [
        {
          role: 'user',
          content: `${rulePrompts}\n\n${prompt}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    };
  }

  protected extractResponseContent(data: any): string {
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error('Unexpected response format from Claude API');
    }

    // Claude API returns content as an array of blocks
    const textBlocks = data.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text);

    const content = textBlocks.join('\n');
    return this.formatResponseWithClickableLinks(content);
  }
}
