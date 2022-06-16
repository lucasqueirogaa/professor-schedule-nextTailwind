import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../utils/database';

interface ErrorResponseType {
  message: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | object[]>
): Promise<void> => {
  if (req.method === 'GET') {
    const { courses } = req.body;

    if (!courses) {
      res.status(400).json({ message: 'We need a course to search' });

      return;
    }

    const { db } = await connectDb();

    const response = await db
      .collection('users')
      .find({ courses: { $in: [new RegExp(`^${courses}`, 'i')] } })
      .toArray();

    if (response.length === 0) {
      res.status(400).json({ message: 'No teacher with this course.' });

      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ message: 'Wrong request method' });
  }
};
