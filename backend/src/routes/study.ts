import { Router, type Request, type Response } from 'express';
import prisma from '../prisma.js';
import { generateSummary, generateQuiz, generateFlashcards } from '../services/aiService.js';
import multer from 'multer';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});

async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === 'text/plain') {
    return file.buffer.toString('utf-8');
  }
  throw new Error('Unsupported file type. Please upload a text file.');
}

router.post('/summaries', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { userId, title, text, sourceType } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    let sourceData = '';
    let contentToSummarize = '';

    if (sourceType === 'file') {
      if (!req.file) {
        res.status(400).json({ error: 'File is required when sourceType is file' });
        return;
      }
      sourceData = req.file.originalname;
      contentToSummarize = await extractTextFromFile(req.file);
    } else {
      if (!text) {
        res.status(400).json({ error: 'Text is required when sourceType is text' });
        return;
      }
      sourceData = text;
      contentToSummarize = text;
    }

    // Generate summary using AI
    const aiResult = await generateSummary({ text: contentToSummarize, title });

    // Save to database
    const summary = await prisma.summary.create({
      data: {
        userId,
        title: aiResult.title,
        content: aiResult.content,
        sourceType,
        sourceData,
      },
    });

    res.json(summary);
  } catch (error: any) {
    console.error('Error creating summary:', error);
    
    // Handle specific AI API errors
    if (error?.status === 503) {
      res.status(503).json({ 
        error: 'AI service is temporarily overloaded. Please try again in a moment.',
        details: 'The AI model is experiencing high traffic. Please wait a few seconds and try again.'
      });
    } else if (error?.status === 429) {
      res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        details: 'Too many requests. Please wait a moment before trying again.'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create summary',
        details: error?.message || 'An unexpected error occurred'
      });
    }
  }
});

// CREATE Quiz
router.post('/quizzes', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { userId, title, text, sourceType, questionCount } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    let sourceData = '';
    let contentForQuiz = '';

    if (sourceType === 'file') {
      if (!req.file) {
        res.status(400).json({ error: 'File is required when sourceType is file' });
        return;
      }
      sourceData = req.file.originalname;
      contentForQuiz = await extractTextFromFile(req.file);
    } else {
      if (!text) {
        res.status(400).json({ error: 'Text is required when sourceType is text' });
        return;
      }
      sourceData = text;
      contentForQuiz = text;
    }

    // Generate quiz using AI
    const aiResult = await generateQuiz({ 
      text: contentForQuiz, 
      title,
      questionCount: questionCount ? parseInt(questionCount) : 5 
    });

    // Save to database
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        title: aiResult.title,
        sourceType,
        sourceData,
        questions: {
          create: aiResult.questions.map((q: any, index: number) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            order: index,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    res.json(quiz);
  } catch (error: any) {
    console.error('Error creating quiz:', error);
    
    // Handle specific AI API errors
    if (error?.status === 503) {
      res.status(503).json({ 
        error: 'AI service is temporarily overloaded. Please try again in a moment.',
        details: 'The AI model is experiencing high traffic. Please wait a few seconds and try again.'
      });
    } else if (error?.status === 429) {
      res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        details: 'Too many requests. Please wait a moment before trying again.'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create quiz',
        details: error?.message || 'An unexpected error occurred'
      });
    }
  }
});

// CREATE Flashcard Set
router.post('/flashcards', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { userId, title, text, sourceType, cardCount } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    let sourceData = '';
    let contentForFlashcards = '';

    if (sourceType === 'file') {
      if (!req.file) {
        res.status(400).json({ error: 'File is required when sourceType is file' });
        return;
      }
      sourceData = req.file.originalname;
      contentForFlashcards = await extractTextFromFile(req.file);
    } else {
      if (!text) {
        res.status(400).json({ error: 'Text is required when sourceType is text' });
        return;
      }
      sourceData = text;
      contentForFlashcards = text;
    }

    // Generate flashcards using AI
    const aiResult = await generateFlashcards({ 
      text: contentForFlashcards, 
      title,
      cardCount: cardCount ? parseInt(cardCount) : 10 
    });

    // Save to database
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        userId,
        title: aiResult.title,
        sourceType,
        sourceData,
        flashcards: {
          create: aiResult.flashcards.map((card: any, index: number) => ({
            front: card.front,
            back: card.back,
            order: index,
          })),
        },
      },
      include: {
        flashcards: true,
      },
    });

    res.json(flashcardSet);
  } catch (error: any) {
    console.error('Error creating flashcards:', error);
    
    // Handle specific AI API errors
    if (error?.status === 503) {
      res.status(503).json({ 
        error: 'AI service is temporarily overloaded. Please try again in a moment.',
        details: 'The AI model is experiencing high traffic. Please wait a few seconds and try again.'
      });
    } else if (error?.status === 429) {
      res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        details: 'Too many requests. Please wait a moment before trying again.'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create flashcards',
        details: error?.message || 'An unexpected error occurred'
      });
    }
  }
});

// GET user's summaries
router.get('/summaries/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const summaries = await prisma.summary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(summaries);
  } catch (error) {
    console.error('Error fetching summaries:', error);
    res.status(500).json({ error: 'Failed to fetch summaries' });
  }
});

// GET single summary
router.get('/summaries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const summary = await prisma.summary.findUnique({
      where: { id },
    });

    if (!summary) {
      res.status(404).json({ error: 'Summary not found' });
      return;
    }

    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});


// GET user's quizzes
router.get('/quizzes/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const quizzes = await prisma.quiz.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        questions: true,
      },
    });

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// GET single quiz
router.get('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// GET user's flashcard sets
router.get('/flashcards/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const flashcardSets = await prisma.flashcardSet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        flashcards: true,
      },
    });

    res.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard sets' });
  }
});

// GET single flashcard set
router.get('/flashcards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id },
      include: {
        flashcards: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!flashcardSet) {
      res.status(404).json({ error: 'Flashcard set not found' });
      return;
    }

    res.json(flashcardSet);
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard set' });
  }
});

// DELETE summary
router.delete('/summaries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.summary.delete({
      where: { id },
    });

    res.json({ message: 'Summary deleted successfully' });
  } catch (error) {
    console.error('Error deleting summary:', error);
    res.status(500).json({ error: 'Failed to delete summary' });
  }
});

// DELETE quiz
router.delete('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.quiz.delete({
      where: { id },
    });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// DELETE flashcard set
router.delete('/flashcards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.flashcardSet.delete({
      where: { id },
    });

    res.json({ message: 'Flashcard set deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard set:', error);
    res.status(500).json({ error: 'Failed to delete flashcard set' });
  }
});

export default router;
