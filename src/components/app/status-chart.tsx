
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

type FilterType = 'all' | 'solved' | 'unsolved' | 'important';

interface StatusChartProps {
  data: { name: string; value: number; fill: string }[];
  onSegmentClick: (filter: FilterType) => void;
}

const chartConfig = {
  solved: { label: 'Solved' },
  unsolved: { label: 'Unsolved' },
};

export function StatusChart({ data, onSegmentClick }: StatusChartProps) {
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const handlePieClick = (pieData: any) => {
    if (pieData.name === 'Solved') {
        onSegmentClick('solved');
    } else if (pieData.name === 'Unsolved') {
        onSegmentClick('unsolved');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Overview</CardTitle>
        <CardDescription>Solved vs. Unsolved questions</CardDescription>
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
                onClick={handlePieClick}
                className="cursor-pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} className="focus:outline-none focus:ring-2 focus:ring-ring" />
                ))}
              </Pie>
               <Legend content={({ payload }) => {
                 return (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {payload?.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center gap-2 cursor-pointer" onClick={() => handlePieClick(data[index])}>
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
