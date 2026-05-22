"use client";

import React, { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResumeUploadTrigger() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        // Handle file drop for ResumeVersion ingestion
      }}
      className={cn(
        "relative flex flex-col items-center justify-center p-xl border border-dashed rounded-xl transition-all duration-200 cursor-pointer w-full max-w-lg mx-auto",
        isDragging 
          ? "border-ai bg-ai/5 scale-[1.02]" 
          : "border-hairline bg-surface-1 hover:bg-surface-2 hover:border-border-strong"
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        <UploadCloud className="w-5 h-5 text-text-secondary" />
      </div>
      
      <h3 className="text-sm font-semibold text-text-primary mb-1">
        Upload master resume
      </h3>
      <p className="text-xs text-text-tertiary text-center max-w-[280px]">
        We will parse this to initialize your ATS engine and construct your baseline Career Graph.
      </p>

      <button className="mt-4 flex items-center gap-2 bg-surface-3 hover:bg-surface-4 text-text-primary text-xs font-medium px-4 py-2 rounded-md transition-all duration-75 active:scale-[0.95] border border-hairline">
        <FileText className="w-3.5 h-3.5" />
        Select PDF
      </button>
    </div>
  );
}
