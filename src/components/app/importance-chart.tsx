
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Star } from 'lucide-react';

interface ImportanceChartProps {
  data: { name: string; value: number; fill: string }[];
}

const chartConfig = {
  important: { label: 'Important' },
  normal: { label: 'Normal' },
};

export function ImportanceChart({ data }: ImportanceChartProps) {
  if (!data || data.length === 0) return null;

  const importantData = data.find(d => d.name === 'Important');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Important</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{importantData?.value || 0}</div>
        <p className="text-xs text-muted-foreground">
            {data.reduce((acc, curr) => acc + curr.value, 0)} total questions
        </p>
      </CardContent>
    </Card>
  );
}
