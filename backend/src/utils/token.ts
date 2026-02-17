import jwt from 'jsonwebtoken';

export const generateToken: (fid: string) => string | null = (id: string) => {
  try {
    const token = jwt.sign({ fid: id }, process.env.JWT_SECRET as string);

    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const verifyToken: (token: string) => { fid: string } | null = (
  tokenValue: string
) => {
  try {
    const token = tokenValue.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as { fid: string };
  } catch (error) {
    console.log(error);
    return null;
  }
};
