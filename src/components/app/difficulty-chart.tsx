
'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface DifficultyChartProps {
  data: { name: string; value: number }[];
}

const chartConfig = {
  questions: {
    label: 'Questions',
  },
  easy: {
    label: 'Easy',
    color: 'hsl(var(--chart-2))',
  },
  medium: {
    label: 'Medium',
    color: 'hsl(var(--chart-4))',
  },
  hard: {
    label: 'Hard',
    color: 'hsl(var(--chart-1))',
  },
  beginner: {
    label: 'Beginner',
    color: 'hsl(var(--chart-3))',
  },
  advanced: {
    label: 'Advanced',
    color: 'hsl(var(--chart-5))',
  },
};

// Function to get color from config, falling back to a default
const getColor = (name: string) => {
    const key = name.toLowerCase();
    if (key in chartConfig) {
        return (chartConfig as any)[key].color;
    }
    return 'hsl(var(--chart-1))';
};


export function DifficultyChart({ data }: DifficultyChartProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(item => ({...item, fill: getColor(item.name)}));

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Difficulty Breakdown</CardTitle>
        <CardDescription>Distribution of questions by difficulty.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[150px] w-full">
            <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        allowDecimals={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="value" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
