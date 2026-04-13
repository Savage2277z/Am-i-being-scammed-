interface ActionStepsProps {
  steps: string[];
}

export default function ActionSteps({ steps }: ActionStepsProps) {
  if (!steps.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        📋 What To Do Now
      </h3>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 text-sm text-gray-700"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a1a2e] text-white text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
