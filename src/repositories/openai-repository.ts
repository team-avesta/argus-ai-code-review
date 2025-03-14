import { BaseAIReviewRepository } from './base-ai-repository';
import {
  SYSTEM_PROMPTS,
  getPromptForEnabledRules,
  AIReviewConfig,
} from '../prompts/system-prompts';

export class OpenAIReviewRepository extends BaseAIReviewRepository {
  protected readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  protected readonly MODEL_NAME: string;
  private config: AIReviewConfig;

  constructor(config: AIReviewConfig) {
    super();
    this.config = config;
    this.MODEL_NAME = config.model || 'gpt-4-turbo-preview';
  }

  protected async getHeaders(): Promise<HeadersInit> {
    const apiKey = process.env.AI_PROVIDER_API_KEY;

    if (!apiKey) {
      throw new Error('AI_PROVIDER_API_KEY environment variable is not set');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
  }

  protected formatRequestBody(prompt: string): unknown {
    const rulePrompts = getPromptForEnabledRules(this.config);

    return {
      model: this.MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS,
        },
        {
          role: 'user',
          content: `${rulePrompts}\n\n${prompt}`,
        },
      ],
      temperature: 0.1,
    };
  }

  protected extractResponseContent(data: any): string {
    const content = data.choices[0].message.content;
    return this.formatResponseWithClickableLinks(content);
  }
}
