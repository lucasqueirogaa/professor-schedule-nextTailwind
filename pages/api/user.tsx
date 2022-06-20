import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../utils/database';
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
  if (req.method === 'POST') {
    const {
      name,
      email,
      cellphone,
      teacher,
      courses,
      availableHours,
      availableLocations,
    } = req.body;

    if (!teacher) {
      if (!name || !email || !cellphone) {
        res
          .status(400)
          .json({ message: 'Missing body params for user create' });

        return;
      }
    } else if (teacher) {
      if (
        !name ||
        !email ||
        !cellphone ||
        !courses ||
        !availableHours ||
        !availableLocations
      ) {
        res
          .status(400)
          .json({ message: 'Missing body params for teacher create' });

        return;
      }
    }

    const { db } = await connectDb();

    await db.collection('users').insertOne({
      name,
      email,
      cellphone,
      teacher,
      coins: 1,
      courses: courses || [],
      availableHours: availableHours || {},
      availableLocations: availableLocations || [],
      reviews: [],
      appointments: [],
    });

    res.status(200).json({ message: 'Sucess to insert in DB' });
  } else {
    res.status(400).json({ message: 'Wrong request method' });
  }
};
