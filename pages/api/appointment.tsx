import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../utils/database';

interface ErrorResponseType {
  message: string;
}

interface SucessResponseType {
  date: string;
  teacherName: string;
  teacher_id: string;
  studentName: string;
  student_id: string;
  course: string;
  location: string;
  appointmentLink: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SucessResponseType>
): Promise<void> => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      res.status(400).json({ message: 'Login to make a appointment' });

      return;
    }

    const {
      date,
      teacherName,
      teacher_id,
      studentName,
      student_id,
      course,
      location,
      appointmentLink,
    } = req.body;

    if (
      !date ||
      !teacherName ||
      !teacher_id ||
      !studentName ||
      !student_id ||
      !course ||
      !location
    ) {
      res.status(400).json({ message: 'Missing parameter on request body' });

      return;
    }

    const { db } = await connectDb();

    const teacherCheck = await db
      .collection('users')
      .findOne({ _id: new ObjectId(teacher_id) });

    if (!teacherCheck) {
      res.status(400).json({
        message: `Teacher ${teacherName} with id ${teacher_id} does not exist `,
      });

      return;
    }

    const studentCheck = await db
      .collection('users')
      .findOne({ _id: new ObjectId(student_id) });

    if (!studentCheck) {
      res.status(400).json({
        message: `Student ${studentName} with id ${student_id} does not exist `,
      });

      return;
    }

    const appointment = {
      date,
      teacherName,
      teacher_id,
      studentName,
      student_id,
      course,
      location,
      appointmentLink: appointmentLink || '',
    };

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(teacher_id) },
        { $push: { appointments: appointment } }
      );

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(student_id) },
        { $push: { appointments: appointment } }
      );

    res.status(200).json(appointment);
  } else {
    res.status(400).json({ message: 'Wrong request method' });
  }
};
