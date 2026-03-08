'use client';

import { Printer } from 'lucide-react';
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

const CATEGORY_LABELS: Record<string, string> = {
  [DrinkCategory.WELCOME]: '🥂 Alkumalja',
  [DrinkCategory.DINNER]: '🍽️ Ruokajuomat',
  [DrinkCategory.EVENING]: '🌙 Iltajuomat',
  non_alcoholic: '💧 Alkoholittomat',
};

const categoryOrder = [
  DrinkCategory.WELCOME,
  DrinkCategory.DINNER,
  DrinkCategory.EVENING,
  'non_alcoholic',
];

export default function ResultView({ result }: Props) {
  const { items, alkoTotal, estoniaTotal, savings } = result;

  const grouped = items.reduce(
    (acc, item) => {
      const key = item.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Ostoslista</h2>

      <div className="space-y-6">
        {categoryOrder.map((cat) => {
          const catItems = grouped[cat];
          if (!catItems || catItems.length === 0) return null;
          return (
            <Card key={cat} className="overflow-hidden">
              <CardHeader className="py-3 px-4 bg-muted/40">
                <CardTitle className="text-sm font-semibold">
                  {CATEGORY_LABELS[cat] ?? cat}
                </CardTitle>
              </CardHeader>
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
                    {catItems.map((item) => {
                      const info = DRINKS[item.drinkType];
                      return (
                        <TableRow key={`${item.drinkType}-${item.category}`}>
                          <TableCell className="py-3">
                            <span className="font-medium">{info.name}</span>
                            <span className="text-muted-foreground text-xs ml-1.5">
                              {item.unit}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-semibold py-3">
                            {item.quantity}
                          </TableCell>
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
          );
        })}
      </div>

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
