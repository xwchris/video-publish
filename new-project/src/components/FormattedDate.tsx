"use client";

import { useEffect, useState } from "react";

interface FormattedDateProps {
  date: string;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const formatted = new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setFormattedDate(formatted);
  }, [date]);

  return <span>{formattedDate}</span>;
}
