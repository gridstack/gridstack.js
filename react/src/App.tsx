import "./demo.css";
import { Simple0 } from "./examples/000-simple";
import { Simple } from "./examples/001-simple";
import { Nested } from "./examples/002-nested";
import { CustomHandle } from "./examples/003-custom-handle";
import { Advanced } from "./examples/009-advanced";
import { DragIn } from "./examples/004-drag-in";

export default function App() {
  return (
    <div>
      <h2 id="simple0">Simple</h2>
      <p>Render content by GridStackItem with id selector.</p>
      <Simple0 />
      <h2 id="simple">Simple With Toolbar</h2>
      <p>With toolbar</p>
      <Simple />
      <h2 id="nested">Nested</h2>
      <p>Only use gridstack.js native subGridOpts.</p>
      <Nested />
      <h2>Custom Handle</h2>
      <CustomHandle />
      <h2 id="drag-in">Drag In (Copy)</h2>
      <DragIn />
      <h2 id="advanced">Advanced</h2>
      <Advanced />
    </div>
  );
}
