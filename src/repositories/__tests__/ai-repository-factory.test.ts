import { AIRepositoryFactory } from '../ai-repository-factory';
import { OpenAIReviewRepository } from '../openai-repository';
import { ClaudeAIReviewRepository } from '../claude-repository';
import { AIReviewConfig } from '../../prompts/system-prompts';

describe('AIRepositoryFactory', () => {
  // Save original environment
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
    delete process.env.AI_REVIEW_MODEL;
    process.env.AI_PROVIDER_API_KEY = 'test-key';
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should create OpenAI repository for gpt models', () => {
    const config: AIReviewConfig = {
      model: 'gpt-4-turbo-preview',
      rules: {},
    };

    const repository = AIRepositoryFactory.createRepository(config);
    expect(repository).toBeInstanceOf(OpenAIReviewRepository);
  });

  it('should create Claude repository for claude models', () => {
    const config: AIReviewConfig = {
      model: 'claude-3-opus-20240229',
      rules: {},
    };

    const repository = AIRepositoryFactory.createRepository(config);
    expect(repository).toBeInstanceOf(ClaudeAIReviewRepository);
  });

  it('should use environment variable if model not specified in config', () => {
    process.env.AI_REVIEW_MODEL = 'claude-3-sonnet-20240229';

    const config: AIReviewConfig = {
      rules: {},
    };

    const repository = AIRepositoryFactory.createRepository(config);
    expect(repository).toBeInstanceOf(ClaudeAIReviewRepository);
  });

  it('should default to OpenAI for unknown model names', () => {
    const config: AIReviewConfig = {
      model: 'unknown-model',
      rules: {},
    };

    const repository = AIRepositoryFactory.createRepository(config);
    expect(repository).toBeInstanceOf(OpenAIReviewRepository);
  });

  it('should default to OpenAI if no model specified', () => {
    const config: AIReviewConfig = {
      rules: {},
    };

    const repository = AIRepositoryFactory.createRepository(config);
    expect(repository).toBeInstanceOf(OpenAIReviewRepository);
  });

  it('should warn if API key is not set', () => {
    // Mock console.warn
    const originalWarn = console.warn;
    console.warn = jest.fn();

    // Remove API key
    delete process.env.AI_PROVIDER_API_KEY;

    const config: AIReviewConfig = {
      model: 'gpt-4',
      rules: {},
    };

    AIRepositoryFactory.createRepository(config);

    expect(console.warn).toHaveBeenCalledWith(
      'AI_PROVIDER_API_KEY environment variable is not set',
    );

    // Restore console.warn
    console.warn = originalWarn;
  });
});
