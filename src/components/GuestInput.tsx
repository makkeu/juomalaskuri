'use client';

interface Props {
  adults: number;
  children: number;
  durationHours: number;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onDurationChange: (n: number) => void;
}

export default function GuestInput({
  adults,
  children,
  durationHours,
  onAdultsChange,
  onChildrenChange,
  onDurationChange,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vieraat ja kesto</h2>
      <div className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aikuiset
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={200}
              value={adults}
              onChange={(e) => onAdultsChange(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={1}
              max={500}
              value={adults}
              onChange={(e) => onAdultsChange(Math.max(1, Number(e.target.value)))}
              className="w-20 px-3 py-2 border rounded-lg text-center"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lapset
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={children}
              onChange={(e) => onChildrenChange(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={0}
              max={200}
              value={children}
              onChange={(e) => onChildrenChange(Math.max(0, Number(e.target.value)))}
              className="w-20 px-3 py-2 border rounded-lg text-center"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Juhlan kesto (tuntia)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={12}
              value={durationHours}
              onChange={(e) => onDurationChange(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="number"
              min={1}
              max={24}
              value={durationHours}
              onChange={(e) => onDurationChange(Math.max(1, Number(e.target.value)))}
              className="w-20 px-3 py-2 border rounded-lg text-center"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          Yhteensä <strong>{adults + children}</strong> vierasta, kesto{' '}
          <strong>{durationHours}h</strong>
        </div>
      </div>
    </div>
  );
}
