import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/token';

const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

	const payload = verifyToken(token);
	if (!payload || !payload.fid) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

	req.fuserId = payload.fid;
	next();
};

export default auth;
