import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../utils/database';

interface ErrorResponseType {
  message: string;
}

interface SucessResponseType {
  name: string;
  _id: string;
  email: string;
  cellphone: string;
  teacher: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SucessResponseType>
): Promise<void> => {
  if (req.method === 'POST') {
    const { name, email, cellphone, teacher } = req.body;

    if (!name || !email || !cellphone || !teacher) {
      res.status(400).json({ message: 'Missing body params' });

      return;
    }

    const { db } = await connectDb();

    await db.collection('users').insertOne({
      name,
      email,
      cellphone,
      teacher,
    });

    res.status(200).json({ message: 'Sucess to insert user!' });
  } else {
    res.status(400).json({ message: 'Wrong request method' });
  }
};
