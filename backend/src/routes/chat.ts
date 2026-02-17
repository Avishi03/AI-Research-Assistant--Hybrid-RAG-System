import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import saveMsg from '../utils/save';
import Chat from '../models/chat';

// delete in the future
const GEMINI_API_KEY = 'AIzaSyD336MYSkpfIK0J6kAbgse9D32jblhtsdk';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const router = Router();

router.post('/generate', async (req, res, next) => {
	try {
		const text = req.body.message;

		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('X-Accel-Buffering', 'no');
		res.flushHeaders();

		let generated = ''

		const fastApiUrl = 'http://localhost:5432/chat/response'; // Adjust URL as needed
		const response = await fetch(fastApiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_query: text }),
		});

		if (!response.ok) {
			throw new Error(`FastAPI error: ${response.statusText}`);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('Failed to get response stream');
		}

		const decoder = new TextDecoder();
		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = JSON.parse(line.slice(6));
					if (data.error) {
						throw new Error(data.error);
					}
					if (data.chunk) {
						generated += data.chunk;
						res.write(`data: ${JSON.stringify({ chunk: data.chunk, finished: false })}\n\n`);
					}
					if (data.finished) {
						generated = data.entire_msg || generated;
						res.write(`data: ${JSON.stringify({ chunk: data.entire_msg, finished: true })}\n\n`);
					}
				}
			}
		}
	} catch (e: any) {
		console.log('Error in /generate endpoint:', e)
		res.write(
			`data: ${JSON.stringify({
				error: e.message || 'An unexpected error occurred',
				finished: true,
				timestamp: Date.now(),
			})}\n\n`
		);
	} finally {
		res.end()
	}
})

router.post('/:id', async (req, res, next) => {
	try {
		const fuserId = req.fuserId;
		const message = req.body.message;
		const chatId = req.params.id;

		let generated = '';

		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.flushHeaders();

		const response = await ai.models.generateContentStream({
			model: 'gemini-2.0-flash-001',
			contents: `${message}`,
		});

		for await (const chunk of response) {
			generated += chunk.text;
			res.write(
				`data: ${JSON.stringify({
					chunk: chunk.text,
					finished: false,
				})}\n\n`
			);
		}

		const savedChatId = await saveMsg(
			fuserId || '',
			message,
			generated,
			chatId || ''
		);
		if (!savedChatId) {
			throw new Error('Failed to save chat');
		}

		res.write(
			`data: ${JSON.stringify({
				entire_msg: generated,
				finished: true,
				chatId: savedChatId,
			})}\n\n`
		);
	} catch (e: any) {
		console.error('Stream error:', e);
		res.write(
			`data: ${JSON.stringify({
				error: e.message || 'An unexpected error occurred',
				finished: true,
				timestamp: Date.now(),
			})}\n\n`
		);
	} finally {
		res.end();
	}
});

router.get('/chats', async (req, res, next) => {
	try {
		const fuserId = req.fuserId;
		const chats = await Chat.find({ fuser: fuserId })
			.sort({ createdAt: -1 })
			.limit(10);
		const formattedChats = chats.map(chat => {
			return {
				_id: chat._id,
				title: chat.title,
				createdAt: chat.createdAt,
			}
		})
		res.json({
			msg: 'Chats found successfully',
			chats: formattedChats,
		});
	} catch (e: any) {
		console.log(e);
		res.status(500).json({ message: e.message || 'Something went wrong' });
	}
});

export default router;

router.get('/:id', async (req, res, next) => {
	try {
		const chatId = req.params.id;
		const chat = await Chat.findById(chatId);
		if (!chat) {
			throw new Error('Chat not found');
		}
		res.json({
			msg: 'Chat found successfully',
			chat: chat,
		});
	} catch (e: any) {
		console.log(e);
		res.status(500).json({ message: e.message || 'Something went wrong' });
	}
});