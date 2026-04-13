interface RedFlagsListProps {
  flags: string[];
}

export default function RedFlagsList({ flags }: RedFlagsListProps) {
  if (!flags.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        🚩 Red Flags Detected
      </h3>
      <ul className="space-y-2">
        {flags.map((flag, i) => (
          <li
            key={i}
            className="flex items-start gap-2 bg-red-50 rounded-lg p-3 text-sm text-gray-700"
          >
            <span className="flex-shrink-0">❌</span>
            <span>{flag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
