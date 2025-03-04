import { useState } from "react";

type CounterProps = {
  label: string;
};

export function Counter(props: CounterProps) {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {props.label} {count}
    </button>
  );
}
