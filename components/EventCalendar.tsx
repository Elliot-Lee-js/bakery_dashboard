"use client"

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function EventCalendar() {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="border border-gray-300 rounded-md">
      <Calendar className="bg-white p-4 rounded-lg" onChange={onChange} value={value} />
    </div>
  );
}