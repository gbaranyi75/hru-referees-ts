import { ReactNode } from "react";

export function LegalProse({ children }: { children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-relaxed text-gray-700 shadow-sm md:p-10 [&_a]:text-indigo-600 [&_a]:underline [&_code]:font-mono [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pb-2">
      {children}
    </article>
  );
}
