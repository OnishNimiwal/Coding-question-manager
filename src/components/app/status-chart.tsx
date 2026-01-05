
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

interface StatusChartProps {
  data: { name: string; value: number; fill: string }[];
}

const chartConfig = {
  solved: { label: 'Solved', color: 'hsl(var(--chart-2))' },
  unsolved: { label: 'Unsolved', color: 'hsl(var(--chart-1))' },
};

export function StatusChart({ data }: StatusChartProps) {
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Overview</CardTitle>
        <CardDescription>Solved vs. Unsolved questions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
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
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
               <Legend content={({ payload }) => {
                 return (
                  <ul className="flex flex-col space-y-1 text-sm text-muted-foreground absolute top-1/2 -translate-y-1/2 right-0">
                    {payload?.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center gap-2">
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
