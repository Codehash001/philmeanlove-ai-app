// components/NamespaceInput.js
import { useState } from "react";

export default function NamespaceInput({ onNamespaceChange }) {
  const [namespace, setNamespace] = useState("");

  const handleNamespaceChange = (event) => {
    setNamespace(event.target.value);
  };

  const handleSubmit = () => {
    onNamespaceChange(namespace);
  };

  return (
    <div>
      <input
        type="text"
        value={namespace}
        onChange={handleNamespaceChange}
        placeholder="Enter the namespace"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
