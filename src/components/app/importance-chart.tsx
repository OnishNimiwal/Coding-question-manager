
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

interface ImportanceChartProps {
  data: { name: string; value: number; fill: string }[];
}

const chartConfig = {
  important: { label: 'Important' },
  normal: { label: 'Normal' },
};

export function ImportanceChart({ data }: ImportanceChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importance</CardTitle>
        <CardDescription>Important vs. Normal</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="min-h-[150px] w-full max-w-[250px]">
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={40}
                    paddingAngle={5}
                    className="cursor-pointer"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <Legend content={({ payload }) => {
                    return (
                    <ul className="text-sm text-muted-foreground space-y-1">
                        {payload?.map((entry, index) => (
                        <li key={`item-${index}`} className="flex items-center gap-2 cursor-pointer">
                            <span className="h-2 w-2 rounded-full" style={{backgroundColor: entry.color}} />
                            <span>{entry.value} ({data[index].value})</span>
                        </li>
                        ))}
                    </ul>
                    )
                }} layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
