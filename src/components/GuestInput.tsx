'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import IntensitySelector from '@/components/IntensitySelector';
import { IntensityLevel } from '@/lib/types';

interface Props {
  adults: number;
  children: number;
  durationHours: number;
  intensity: IntensityLevel;
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onDurationChange: (n: number) => void;
  onIntensityChange: (v: IntensityLevel) => void;
}

export default function GuestInput({
  adults,
  children,
  durationHours,
  intensity,
  onAdultsChange,
  onChildrenChange,
  onDurationChange,
  onIntensityChange,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Vieraat ja kesto</h2>
      <p className="text-sm text-muted-foreground mb-6">Säädä vieraiden määrää ja juhlan kestoa</p>

      <div className="space-y-8 max-w-md">
        {/* Adults */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="adults">Aikuiset</Label>
            <span className="text-sm font-semibold tabular-nums">{adults}</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              value={[adults]}
              onValueChange={(v) => onAdultsChange(Array.isArray(v) ? v[0] : v)}
              min={1}
              max={200}
              step={1}
              className="flex-1"
            />
            <Input
              id="adults"
              type="number"
              min={1}
              max={500}
              value={adults}
              onChange={(e) => onAdultsChange(Math.max(1, Number(e.target.value)))}
              className="w-20 text-center"
            />
          </div>
        </div>

        {/* Children */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="children">Lapset</Label>
            <span className="text-sm font-semibold tabular-nums">{children}</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              value={[children]}
              onValueChange={(v) => onChildrenChange(Array.isArray(v) ? v[0] : v)}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <Input
              id="children"
              type="number"
              min={0}
              max={200}
              value={children}
              onChange={(e) => onChildrenChange(Math.max(0, Number(e.target.value)))}
              className="w-20 text-center"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="duration">Kesto (tuntia)</Label>
            <span className="text-sm font-semibold tabular-nums">{durationHours} h</span>
          </div>
          <div className="flex items-center gap-3">
            <Slider
              value={[durationHours]}
              onValueChange={(v) => onDurationChange(Array.isArray(v) ? v[0] : v)}
              min={1}
              max={12}
              step={1}
              className="flex-1"
            />
            <Input
              id="duration"
              type="number"
              min={1}
              max={24}
              value={durationHours}
              onChange={(e) => onDurationChange(Math.max(1, Number(e.target.value)))}
              className="w-20 text-center"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          Yhteensä{' '}
          <span className="font-semibold text-foreground">{adults + children}</span>{' '}
          vierasta, kesto{' '}
          <span className="font-semibold text-foreground">{durationHours} h</span>
        </div>

        <Separator />

        <IntensitySelector value={intensity} onChange={onIntensityChange} />
      </div>
    </div>
  );
}
