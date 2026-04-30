"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
};

export function CopyButton({ text, label = "Copy", copiedLabel = "Copied" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button className="secondary-button" onClick={handleCopy} type="button">
      {copied ? copiedLabel : label}
    </button>
  );
}
