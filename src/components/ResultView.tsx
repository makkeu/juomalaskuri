'use client';

import { useState } from 'react';
import { Printer, ChevronDown, ChevronUp } from 'lucide-react';
import { ShoppingList, DrinkCategory } from '@/lib/types';
import { DRINKS } from '@/lib/drinkData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  result: ShoppingList;
}

const PHASE_LABELS: Record<DrinkCategory, string> = {
  [DrinkCategory.WELCOME]: '🥂 Alkumalja',
  [DrinkCategory.DINNER]: '🍽️ Ruoka',
  [DrinkCategory.EVENING]: '🌙 Ilta',
};

const PHASE_ORDER = [DrinkCategory.WELCOME, DrinkCategory.DINNER, DrinkCategory.EVENING];

export default function ResultView({ result }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { items, alkoTotal, estoniaTotal, savings } = result;

  const alcoholic = items.filter((i) => DRINKS[i.drinkType].isAlcoholic);
  const nonAlcoholic = items.filter((i) => !DRINKS[i.drinkType].isAlcoholic);

  // Which phases actually appear in any breakdown
  const activePhases = PHASE_ORDER.filter((phase) =>
    items.some((i) => i.phaseBreakdown && i.phaseBreakdown[phase] !== undefined)
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Ostoslista</h2>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuote</TableHead>
                <TableHead className="text-right w-16">Määrä</TableHead>
                <TableHead className="text-right w-20">Alko</TableHead>
                <TableHead className="text-right w-20">Viro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alcoholic.length > 0 && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell
                    colSpan={4}
                    className="py-1.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Alkoholilliset
                  </TableCell>
                </TableRow>
              )}
              {alcoholic.map((item) => {
                const info = DRINKS[item.drinkType];
                return (
                  <TableRow key={item.drinkType}>
                    <TableCell className="py-3">
                      <span className="font-medium">{info.name}</span>
                      <span className="text-muted-foreground text-xs ml-1.5">{item.unit}</span>
                    </TableCell>
                    <TableCell className="text-right font-semibold py-3">{item.quantity}</TableCell>
                    <TableCell className="text-right py-3 tabular-nums">
                      {(item.quantity * item.alkoPriceEach).toFixed(0)} €
                    </TableCell>
                    <TableCell className="text-right py-3 tabular-nums">
                      {(item.quantity * item.estoniaPriceEach).toFixed(0)} €
                    </TableCell>
                  </TableRow>
                );
              })}

              {nonAlcoholic.length > 0 && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell
                    colSpan={4}
                    className="py-1.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Alkoholittomat
                  </TableCell>
                </TableRow>
              )}
              {nonAlcoholic.map((item) => {
                const info = DRINKS[item.drinkType];
                return (
                  <TableRow key={item.drinkType}>
                    <TableCell className="py-3">
                      <span className="font-medium">{info.name}</span>
                      <span className="text-muted-foreground text-xs ml-1.5">{item.unit}</span>
                    </TableCell>
                    <TableCell className="text-right font-semibold py-3">{item.quantity}</TableCell>
                    <TableCell className="text-right py-3 tabular-nums">
                      {(item.quantity * item.alkoPriceEach).toFixed(0)} €
                    </TableCell>
                    <TableCell className="text-right py-3 tabular-nums">
                      {(item.quantity * item.estoniaPriceEach).toFixed(0)} €
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Phase breakdown toggle */}
      {activePhases.length > 1 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowBreakdown((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showBreakdown ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Erittely vaiheittain
          </button>

          {showBreakdown && (
            <Card className="overflow-hidden mt-2">
              <CardHeader className="py-2 px-4 bg-muted/40">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Arvioitu tarve vaiheittain (annoksina)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tuote</TableHead>
                      {activePhases.map((phase) => (
                        <TableHead key={phase} className="text-right w-24 text-xs">
                          {PHASE_LABELS[phase]}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const info = DRINKS[item.drinkType];
                      const hasBreakdown = activePhases.some(
                        (p) => item.phaseBreakdown?.[p] !== undefined
                      );
                      if (!hasBreakdown) return null;
                      return (
                        <TableRow key={item.drinkType}>
                          <TableCell className="py-2 text-sm">{info.name}</TableCell>
                          {activePhases.map((phase) => {
                            const servings = item.phaseBreakdown?.[phase];
                            return (
                              <TableCell key={phase} className="text-right py-2 tabular-nums text-sm">
                                {servings !== undefined ? Math.round(servings) : '—'}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Separator className="my-6" />

      {/* Price comparison */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Hintavertailu
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Alko (Suomi)</p>
              <p className="text-2xl font-bold tabular-nums">{alkoTotal.toFixed(0)} €</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Viro</p>
              <p className="text-2xl font-bold tabular-nums">{estoniaTotal.toFixed(0)} €</p>
            </CardContent>
          </Card>
        </div>
        {savings > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-green-700 font-medium">Säästö Virosta ostettaessa</p>
              <p className="text-3xl font-bold text-green-700 tabular-nums mt-1">
                {savings.toFixed(0)} €
              </p>
              <p className="text-xs text-green-600 mt-1">
                {((savings / alkoTotal) * 100).toFixed(0)} % halvempi
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Print button */}
      <div className="mt-6 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" />
          Tulosta ostoslista
        </Button>
      </div>
    </div>
  );
}
