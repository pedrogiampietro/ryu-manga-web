import React from "react";

interface MangaSummaryProps {
  summary: string;
}

const MangaSummary: React.FC<MangaSummaryProps> = ({ summary }) => {
  return (
    <div className="p-4 max-w-3xl mx-auto bg-zinc-900 shadow-md rounded-lg mt-4">
      <h2 className="text-xl font-bold">Resumo</h2>
      <p className="mt-2 text-gray-700">{summary}</p>
    </div>
  );
};

export default MangaSummary;
