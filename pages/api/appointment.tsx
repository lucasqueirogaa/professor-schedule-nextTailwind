import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../utils/database';

interface User {
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
    }: {
      date: string;
      teacherName: string;
      teacher_id: string;
      studentName: string;
      student_id: string;
      course: string;
      location: string;
      appointmentLink: string;
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

    const parseDate = new Date(date);
    const now = new Date();
    const today = {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    };
    const fullDate = {
      day: parseDate.getDate(),
      month: parseDate.getMonth(),
      year: parseDate.getFullYear(),
    };

    if (
      fullDate.year < today.year ||
      fullDate.month < today.month ||
      fullDate.day < today.day
    ) {
      res.status(400).json({
        message: 'Put a valid date, on the future.',
      });

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

    if (studentCheck.coins === 0) {
      res.status(400).json({
        message: `Studen ${studentName} have 0 coins, you need 1 coin.`,
      });

      return;
    }

    const weekdays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    const requestDay = weekdays[parseDate.getDay()];
    const requestedHour = parseDate.getUTCHours() - 3;
    if (!teacherCheck.availableHours[requestDay]?.includes(requestedHour)) {
      res.status(400).json({
        message: `Teacher ${teacherName} is not available at ${requestDay} in ${requestedHour}`,
      });
      return;
    }

    teacherCheck.appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);

      if (appointmentDate.getTime() === parseDate.getTime()) {
        res.status(400).json({
          message: `Teacher ${teacherName} has an appointment at ${appointmentDate.getDay()}/${appointmentDate.getMonth()}/${
            appointmentDate.getFullYear
          } - ${appointmentDate.getUTCHours() - 3}:00`,
        });
        return;
      }
    });

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
        { $push: { appointments: appointment }, $inc: { coins: 1 } }
      );

    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(student_id) },
        { $push: { appointments: appointment }, $inc: { coins: -1 } }
      );

    res.status(200).json(appointment);
  } else {
    res.status(400).json({ message: 'Wrong request method' });
  }
};
