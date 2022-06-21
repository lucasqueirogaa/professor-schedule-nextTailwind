import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../utils/database';
import { ObjectId } from 'mongodb';

interface ErrorResponseType {
  message: string;
}

interface SucessResponseType {
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
  coins: number;
  courses: string[];
  availableHours: Record<string, number[]>;
  availableLocations: string[];
  reviews: Record<string, unknown[]>;
  appointments: {
    date: string;
  }[];
  _id: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SucessResponseType | object[]>
): Promise<void> => {
  if (req.method === 'GET') {
    const email = req.query.email as string;

    if (!email) {
      res.status(400).json({ message: 'We need a email for find the user' });

      return;
    }

    const { db } = await connectDb();

    const response = await db.collection('users').find({ email }).toArray();

    if (response.length === 0) {
      res.status(400).json({ message: `User with email ${email} not fround.` });

      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ message: 'Wrong request method' });
  }
};
