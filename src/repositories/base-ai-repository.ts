import * as fs from 'fs/promises';
import chalk from 'chalk';

interface FileDiff {
  path: string;
  content: string;
  lineMap: Map<number, number>;
}

export abstract class BaseAIReviewRepository {
  protected abstract readonly API_URL: string;
  protected abstract readonly MODEL_NAME: string;

  protected abstract getHeaders(): Promise<HeadersInit>;
  protected abstract formatRequestBody(prompt: string): unknown;
  protected abstract extractResponseContent(data: any): string;

  async generateReview(filePath: string): Promise<void> {
    const prompt = await this.buildPrompt(filePath);
    const headers = await this.getHeaders();

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(this.formatRequestBody(prompt)),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`AI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log(this.extractResponseContent(data));
  }

  async generateBulkReview(files: FileDiff[]): Promise<void> {
    const fileContents = files.map(({ path, content, lineMap }) => {
      const lines = content.split('\n');
      const numberedContent = lines
        .map((line, index) => {
          const originalLineNumber = lineMap.get(index + 1) || index + 1;
          return `${originalLineNumber}: ${line}`;
        })
        .join('\n');
      return `\n=== File: ${path} ===\n${numberedContent}`;
    });

    const combinedContent = fileContents.join('\n');
    const prompt = `Review the following changes with line numbers:\n${combinedContent}`;
    const headers = await this.getHeaders();

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(this.formatRequestBody(prompt)),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`AI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log(this.extractResponseContent(data));
  }

  protected async buildPrompt(filePath: string): Promise<string> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const numberedContent = lines.map((line, index) => `${index + 1}: ${line}`).join('\n');
      return `Review the following code with line numbers:\n\n${numberedContent}`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to read file: ${error.message}`);
      }
      throw new Error('Failed to read file: Unknown error');
    }
  }

  protected formatLine(line: string): string {
    // File path line
    if (line.startsWith('/')) {
      return chalk.blue.underline(line);
    }

    // Error line with format: "line:col  error  description  rule"
    if (line.includes('error')) {
      const [location, ...rest] = line.split('  ').filter(Boolean);
      if (location && rest.length > 0) {
        return `${chalk.yellow(location)}  ${chalk.red('error')}  ${chalk.white(rest.join('  '))}`;
      }
    }

    // Explanation lines starting with dash
    if (line.startsWith('-')) {
      return chalk.dim(line);
    }

    // Any other lines
    return chalk.white(line);
  }

  protected formatResponseWithClickableLinks(content: string): string {
    const lines = content.split('\n');
    return lines.map((line) => this.formatLine(line)).join('\n');
  }
}
