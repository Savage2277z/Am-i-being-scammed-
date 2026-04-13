interface SafeIndicatorsListProps {
  indicators: string[];
}

export default function SafeIndicatorsList({
  indicators,
}: SafeIndicatorsListProps) {
  if (!indicators.length) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        ✅ Safe Indicators
      </h3>
      <ul className="space-y-2">
        {indicators.map((indicator, i) => (
          <li
            key={i}
            className="flex items-start gap-2 bg-green-50 rounded-lg p-3 text-sm text-gray-700"
          >
            <span className="flex-shrink-0">✅</span>
            <span>{indicator}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
