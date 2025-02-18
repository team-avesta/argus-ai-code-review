import { BaseAIReviewRepository } from './base-ai-repository';
import {
  SYSTEM_PROMPTS,
  getPromptForEnabledRules,
  AIReviewConfig,
} from '../prompts/system-prompts';

export class OpenAIReviewRepository extends BaseAIReviewRepository {
  protected readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  protected readonly MODEL_NAME = 'gpt-4-turbo-preview';
  private config: AIReviewConfig;

  constructor(config: AIReviewConfig) {
    super();
    this.config = config;
  }

  protected async getHeaders(): Promise<HeadersInit> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
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
      temperature: 0.5,
    };
  }

  protected extractResponseContent(data: any): string {
    const content = data.choices[0].message.content;
    return this.formatResponseWithClickableLinks(content);
  }

  private formatResponseWithClickableLinks(content: string): string {
    // Convert the AI response to include clickable file paths with ESLint format
    const lines = content.split('\n');
    return lines
      .map((line) => {
        // If it's a file path line (doesn't start with spaces), make it clickable
        if (!line.startsWith('  ') && line.trim()) {
          return line;
        }
        // For error lines, keep the format as is
        return line;
      })
      .join('\n');
  }
}
