import { useEffect, useState } from "react";

export default function Timer({ seconds }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <h3>Time Left: {time}</h3>;
}
