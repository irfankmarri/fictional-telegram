"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateImages() {
    setLoading(true);
    const lines = script.split("\n").filter((l) => l.trim() !== "");
    const zip = new JSZip();

    for (let i = 0; i < lines.length; i++) {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: lines[i] }),
      });

      const blob = await res.blob();
      zip.file(`scene_${i + 1}.png`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "all_images.zip");
    setLoading(false);
  }

  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-4">Script → Images Generator</h1>
      <textarea
        className="border p-4 w-full h-60 rounded"
        placeholder="Paste your script here (one scene per line)"
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />
      <button
        onClick={generateImages}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Images"}
      </button>
    </main>
  );
}
