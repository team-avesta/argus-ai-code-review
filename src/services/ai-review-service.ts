import { execSync } from 'child_process';
import * as path from 'path';
import { OpenAIReviewRepository } from '../repositories/openai-repository';
import { AIReviewConfig } from '../prompts/system-prompts';

export interface FileDiff {
  path: string;
  content: string;
  lineMap: Map<number, number>;
}

export class AIReviewService {
  private openAI: OpenAIReviewRepository;

  constructor(config: AIReviewConfig) {
    this.openAI = new OpenAIReviewRepository(config);
  }

  async getStagedFilesDiff(): Promise<FileDiff[]> {
    try {
      const repoRoot = execSync('git rev-parse --show-toplevel').toString().trim();
      const gitDiff = execSync('git diff --staged -U0').toString();
      const files: FileDiff[] = [];
      let currentFile: FileDiff | null = null;
      let isInDiff = false;
      let originalLineNumber = 0;
      let isInIgnoredBlock = false;

      gitDiff.split('\n').forEach((line) => {
        if (line.startsWith('diff --git')) {
          if (currentFile) {
            files.push(currentFile);
          }
          const filePath = line.split(' b/')[1];
          if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
            currentFile = {
              path: path.join(repoRoot, filePath),
              content: '',
              lineMap: new Map(),
            };
            isInDiff = false;
            originalLineNumber = 0;
            isInIgnoredBlock = false;
          } else {
            currentFile = null;
          }
        } else if (currentFile && line.startsWith('@@')) {
          isInDiff = true;
          const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
          if (match) {
            originalLineNumber = parseInt(match[2]);
          }
        } else if (currentFile && isInDiff && !line.startsWith('-')) {
          const lineContent = line.startsWith('+') ? line.substring(1) : line;

          if (lineContent.includes('@ai-review-ignore-start')) {
            isInIgnoredBlock = true;
            return;
          }
          if (lineContent.includes('@ai-review-ignore-end')) {
            isInIgnoredBlock = false;
            return;
          }

          if (isInIgnoredBlock) {
            originalLineNumber++;
            return;
          }

          if (line.startsWith('+')) {
            currentFile.lineMap.set(currentFile.content.split('\n').length + 1, originalLineNumber);
            currentFile.content += lineContent + '\n';
            originalLineNumber++;
          } else {
            currentFile.lineMap.set(currentFile.content.split('\n').length + 1, originalLineNumber);
            currentFile.content += lineContent + '\n';
            originalLineNumber++;
          }
        }
      });

      if (currentFile) {
        files.push(currentFile);
      }

      return files;
    } catch (error) {
      console.error('Error getting staged files diff:', error);
      return [];
    }
  }

  async reviewStagedFiles(): Promise<void> {
    const stagedFiles = await this.getStagedFilesDiff();
    if (stagedFiles.length === 0) {
      console.log('No staged TypeScript/React files found.');
      return;
    }

    console.log(`AI reviewing changes in ${stagedFiles.length} files...`);
    await this.openAI.generateBulkReview(stagedFiles);
  }
}
