import { Router, type Request, type Response } from 'express';
import prisma from '../prisma.js';

const router = Router();

// Get user by email
router.get('/user/email/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user by id
router.get('/user/id/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        sessions: true,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create user
router.post('/user', async (req: Request, res: Response) => {
  try {
    const { email, name, image, emailVerified } = req.body;
    const user = await prisma.user.create({
      data: {
        email,
        name,
        image,
        emailVerified: emailVerified ? new Date(emailVerified) : null,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/user/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    const { email, name, image, emailVerified } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        email,
        name,
        image,
        emailVerified: emailVerified ? new Date(emailVerified) : null,
      },
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/user/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    await prisma.user.delete({
      where: { id },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get session and user
router.get('/session/:sessionToken', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.params.sessionToken;
    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token is required' });
    }
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: true,
      },
    });
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Create session
router.post('/session', async (req: Request, res: Response) => {
  try {
    const { sessionToken, userId, expires } = req.body;
    const session = await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires: new Date(expires),
      },
    });
    res.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Update session
router.put('/session/:sessionToken', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.params.sessionToken;
    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token is required' });
    }
    const { expires } = req.body;
    const session = await prisma.session.update({
      where: { sessionToken },
      data: {
        expires: new Date(expires),
      },
    });
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Delete session
router.delete('/session/:sessionToken', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.params.sessionToken;
    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token is required' });
    }
    await prisma.session.delete({
      where: { sessionToken },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Link account
router.post('/account', async (req: Request, res: Response) => {
  try {
    const { userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token } = req.body;
    const account = await prisma.account.create({
      data: {
        userId,
        type,
        provider,
        providerAccountId,
        refresh_token,
        access_token,
        expires_at,
        token_type,
        scope,
        id_token,
      },
    });
    res.json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Get account
router.get('/account/:provider/:providerAccountId', async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider;
    const providerAccountId = req.params.providerAccountId;
    if (!provider || !providerAccountId) {
      return res.status(400).json({ error: 'Provider and providerAccountId are required' });
    }
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });
    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

export default router;