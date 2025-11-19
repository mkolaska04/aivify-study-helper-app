interface GenerateSummaryParams {
    text: string;
    title?: string;
}
interface GenerateQuizParams {
    text: string;
    title?: string;
    questionCount?: number;
}
interface GenerateFlashcardsParams {
    text: string;
    title?: string;
    cardCount?: number;
}
export declare function generateSummary({ text, title }: GenerateSummaryParams): Promise<{
    title: string;
    content: string;
}>;
export declare function generateQuiz({ text, title, questionCount }: GenerateQuizParams): Promise<{
    title: string;
    questions: any;
}>;
export declare function generateFlashcards({ text, title, cardCount }: GenerateFlashcardsParams): Promise<{
    title: string;
    flashcards: any;
}>;
export {};
//# sourceMappingURL=aiService.d.ts.map