import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../utils/database';
import { ObjectId } from 'mongodb';

interface ErrorResponseType {
  message: string;
}

interface SucessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: boolean;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SucessResponseType>
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
  } else if (req.method === 'GET') {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ message: 'We need a id for find the user' });

      return;
    }

    const { db } = await connectDb();

    const response = await db
      .collection('users')
      .findOne({ _id: new ObjectId(id) });

    if (!response) {
      res.status(400).json({ message: 'User not found, put a valid id!' });

      return;
    }

    // Different type but working
    res.status(200).json(response);
  } else {
    res.status(400).json({ message: 'Wrong request method' });
  }
};
