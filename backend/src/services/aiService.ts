import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
// Using Gemini 2.5 Flash - the most balanced model with 1M token context
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

export async function generateSummary({ text, title }: GenerateSummaryParams) {
  const prompt = `Create a comprehensive summary of the following text. Focus on key points, main ideas, and important details. Format it in a clear, organized way with bullet points or paragraphs. The summary should be in language which was used in the original text.

Text to summarize:
${text}`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text();

  return {
    title: title || 'Summary',
    content: summary,
  };
}

export async function generateQuiz({ text, title, questionCount = 5  }: GenerateQuizParams) {
  const prompt = `Create a quiz with  multiple-choice questions based on the following text. 
For each question provide:
- The question
- 4 answer options
- The correct answer (MUST be the exact full text of one of the options, not a letter)
- A brief explanation of why that answer is correct

IMPORTANT: The correctAnswer field must contain the EXACT FULL TEXT of the correct option, not just a letter.

Format your response as JSON array with this structure:
[
  {
    "question": "Question text here?",
    "options": ["First option text", "Second option text", "Third option text", "Fourth option text"],
    "correctAnswer": "Second option text",
    "explanation": "Explanation here"
  }
]

Text for quiz:
${text}`;

  const result = await model.generateContent(prompt);
  let responseText = result.response.text();
  
  // Remove markdown code blocks if present
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const questions = JSON.parse(responseText);

  return {
    title: title || 'Quiz',
    questions,
  };
}

export async function generateFlashcards({ text, title, cardCount = 10 }: GenerateFlashcardsParams) {
  const prompt = `Create ${cardCount} flashcards based on the following text. 
Each flashcard should have:
- Front: A question or term
- Back: The answer or definition

Format your response as JSON array with this structure:
[
  {
    "front": "Question or term",
    "back": "Answer or definition"
  }
]

Text for flashcards:
${text}`;

  const result = await model.generateContent(prompt);
  let responseText = result.response.text();
  
  // Remove markdown code blocks if present
  responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  const flashcards = JSON.parse(responseText);

  return {
    title: title || 'Flashcards',
    flashcards,
  };
}
