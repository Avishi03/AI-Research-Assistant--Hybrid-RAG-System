import Router from 'express';
import User from '../models/user';
import { generateToken } from '../utils/token';

const router = Router();

router.post('/signin', async (req, res, next) => {
  try {
    const { fid } = req.body;

    const user = await User.findOne({ fid: fid });

    if (!user) {
      try {
        const newUser = new User({ fid: fid });
        await newUser.save();
      } catch (error) {
        res.status(500).json({
          message: 'User creation failed',
        });
        return;
      }
    }

    const token = generateToken(fid);
    if (!token) {
      throw new Error('Token generation failed');
    }

    res.status(200).json({
      message: 'User found',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
});

export default router;
