import "./demo.css";
import { Simple } from "./examples/001-simple";
import { Nested } from "./examples/002-nested";
import { CustomHandle } from "./examples/003-custom-handle";
import { Advanced } from "./examples/009-advanced";

export default function App() {
  return (
    <div>
      <h2 id="simple">Simple</h2>
      <p>Render content by GridStackItem with id selector.</p>
      <Simple />
      <h2 id="nested">Nested</h2>
      <p>Only use gridstack.js native subGridOpts.</p>
      <Nested />
      <h2>Custom Handle</h2>
      <CustomHandle />
      <h2 id="advanced">Advanced</h2>
      <Advanced />
    </div>
  );
}
