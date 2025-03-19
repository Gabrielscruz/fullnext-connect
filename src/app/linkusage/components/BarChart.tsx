"use client";

import {
  Bar,
  BarChart as BarChartRecharts,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTheme } from "@/context/themeContext";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";

// Define the types
interface Item {
  label: string; // Corresponds to the "label" field in the data
  qtd: number; // Corresponds to the "qtd" field in the data
}

interface ChartConfigEntry {
  label: string;
  color: string;
}

interface ChartConfigMap {
  [key: string]: ChartConfigEntry;
}

let chartConfig: ChartConfigMap = {};

// Function to transform data for the bar chart
const transformForBarChart = (data: Item[]) => {
  const uniqueData = data.reduce((acc, item) => {
    // If the label already exists, sum the quantities
    if (acc[item.label]) {
      acc[item.label].qtd += item.qtd;
    } else {
      acc[item.label] = { label: item.label, qtd: item.qtd };
    }
    return acc;
  }, {} as Record<string, Item>);

  // Return the unique data as an array
  return Object.values(uniqueData);
};

export function BarChart({ data }: { data: Item[] }) {
      const { language } = useLanguage();
      const t = translations[language];
  

  const transformedData = useMemo(() => transformForBarChart(data), [data]);

  const getProductColor = useMemo(() => {
    return (index: number) => `hsl(var(--chart-${index + 1}))`;
  }, []);

  const handleClick = (data: any) => {
    alert(`You clicked on ${data.label}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.barChartTitle}</CardTitle> {/* Tradução para o título */}
        <CardDescription>{t.barChartDescription}</CardDescription> {/* Tradução para a descrição */}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          style={{ height: "300px", width: "100%" }}
        >
          <BarChartRecharts
            data={transformedData}
            accessibilityLayer
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={({ x, y, payload }) => {
                // Evitar duplicação de rótulos
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#666"
                    fontSize={12}
                    fontWeight="500"
                  >
                    {payload.value}
                  </text>
                );
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  className="bg-base-300"
                />
              }
              formatter={(value, name) =>
                name === "qtd" ? `${t.barChartTooltipLabel}: ${value}` : value
              }
            />
            <Bar
              dataKey="qtd"
              fill={getProductColor(0)} // Dynamic color
              radius={4}
              onClick={handleClick}
            />
          </BarChartRecharts>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {t.barChartFooterDescription} {/* Tradução para o footer */}
        </div>
      </CardFooter>
    </Card>
  );
}
