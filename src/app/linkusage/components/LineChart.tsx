"use client";
import { format } from "date-fns";
import { CartesianGrid, Line, LineChart as LineChartComponent, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDurationChart } from "@/utils/utils";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";



// Função para transformar os dados
const transformForLineChart = (data: any) => {
  const groupedByDate = data.reduce((acc: any, item: any) => {
    const createdAt = new Date(item.createdAt);
    const formattedDate = format(createdAt, "dd MMM yyyy");

    if (!acc[formattedDate]) {
      acc[formattedDate] = {
        date: formattedDate,
        totalQuantity: 0,
        totalDuration: 0,
      };
    }

    acc[formattedDate].totalQuantity += item.qtd;
    acc[formattedDate].totalDuration += item.duration;
    return acc;
  }, {});

  return Object.values(groupedByDate);
};

// Definição de configurações do gráfico


export function LineChart({ data }: any) {
  const { language } = useLanguage(); // obtendo o idioma atual

  // Obtendo os textos traduzidos para o idioma atual
  const t = translations[language];
  // Memoiza a transformação dos dados
  const transformedData = useMemo(() => transformForLineChart(data), [data],);

  const chartConfig = {
    totalQuantity: {
      label: t.numberOfAccesses, // Tradução para "Number of Accesses"
      color: "hsl(var(--chart-1))",
    },
    totalDuration: {
      label: t.accessDuration, // Tradução para "Access Duration (hh:mm)"
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.lineChartTitle}</CardTitle> {/* Tradução para o título */}
        <CardDescription>{t.lineChartDescription}</CardDescription> {/* Tradução para a descrição */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{ height: "250px", width: "100%" }}>
          <LineChartComponent
            accessibilityLayer
            data={transformedData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Abrevia os meses
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value, name) =>
                name === "totalDuration"
                  ? `${chartConfig.totalDuration.label}: ${formatDurationChart(Number(value))}`
                  : `${chartConfig.totalQuantity.label}: ${value}`
              }
            />
            <Line
              dataKey="totalQuantity"
              type="natural"
              stroke={chartConfig.totalQuantity.color}
              strokeWidth={3}
              dot={{
                fill: chartConfig.totalQuantity.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="totalDuration"
              type="natural"
              stroke={chartConfig.totalDuration.color}
              strokeWidth={3}
              dot={{
                fill: chartConfig.totalDuration.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChartComponent>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
