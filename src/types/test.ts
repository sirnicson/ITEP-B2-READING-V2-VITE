export type TestStatus = 'intro' | 'active' | 'submitted';
export type TestPhase = 'warmup' | 'reading';
export type Difficulty = 'Entry B2' | 'Mid B2' | 'Standard B2';
export type QuestionType = 'main-idea' | 'detail' | 'vocabulary' | 'inference' | 'sequencing';

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  stem: string;
  context?: string;
  options: AnswerOption[];
  correctOptionId: string;
}

export interface VocabularyItem {
  id: string;
  term: string;
  partOfSpeech: string;
  meaning: string;
  turkishMeaning: string;
  simpleMeaning: string;
}

export interface GapFillItem {
  id: string;
  sentence: string;
  correctVocabularyId: string;
}

export interface Warmup {
  stages: Array<'flashcards' | 'matching' | 'gapfill'>;
  passThreshold: number;
  vocabulary: VocabularyItem[];
  gapFill: GapFillItem[];
}

export interface ReadingSection {
  id: string;
  difficulty: Difficulty;
  title: string;
  contextLabel: string;
  suggestedMinutes: number;
  passage: string;
  warmup: Warmup;
  questions: Question[];
}

export interface TestConfig {
  id: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  instructions: string[];
  navigation: {
    allowBack: boolean;
    allowFlagging: boolean;
    allowWarmupReturn: boolean;
  };
  randomization: {
    answerOptions: boolean;
    matchingColumns: boolean;
    gapWordBank: boolean;
  };
  scoring: {
    pointsPerQuestion: number;
  };
  sections: ReadingSection[];
}

export type Responses = Record<string, string>;
export type DisplayedOptionOrders = Record<string, string[]>;
