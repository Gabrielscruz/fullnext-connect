"use client";

import * as React from "react";
import { Label, Pie, PieChart as PieChartRecharts, Cell } from "recharts";

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
import { formatDurationChart } from "@/utils/utils";
import { useMemo, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";

// Define um tipo para os dados do gráfico
interface DataItem {
  label: string; // Rótulo exibido
  duration: number; // Valor para o gráfico
}

// Função para agrupar e somar os valores de duration por label
const groupByLabelAndSumDuration = (data: any[]) => {
  return data.reduce((acc, curr) => {
    const { label, duration } = curr;

    if (!acc[label]) {
      acc[label] = { label, duration: 0 };
    }

    // Soma o duration de cada item
    acc[label].duration += duration;
    return acc;
  }, {});
};

// Definindo a configuração inicial do gráfico
let chartConfig: ChartConfig = {};

export function PieChart({ data }: any) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
    const { language } = useLanguage(); // obtendo o idioma atual
    
    // Obtendo os textos traduzidos para o idioma atual
    const t = translations[language];
  // Agrupando e somando os valores de duration
  const transformedData: DataItem[] = useMemo(() => Object.values(groupByLabelAndSumDuration(data)), [data]);

  // Calculando o valor total somado
  const totalValue = useMemo(() => {
    return transformedData.reduce((acc, curr) => acc + curr.duration, 0);
  }, [transformedData]);

  // Função para obter a cor dinâmica ou a cor do chartConfig
  const getProductColor = (label: string, index: number) => {
    const chartKey: any = Object.keys(chartConfig).find(
      (key) => chartConfig[key]?.label === label
    );
    return chartConfig[chartKey]?.color || `hsl(var(--chart-${index + 1}))`; // Cor padrão se não estiver no chartConfig
  };

  // Função de clique no gráfico
  const handleClick = useCallback((data: any) => {
    setSelectedCategory(data.label);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t.pieChartTitle}</CardTitle> {/* Tradução para o título */}
        <CardDescription>{t.pieChartDescription}</CardDescription> {/* Tradução para a descrição */}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChartRecharts>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel
                formatter={(value, name) =>
                  `${name} (hh:mm): ${formatDurationChart(Number(value))}`
                }
              />}
            />
            <Pie
              data={transformedData}
              dataKey="duration"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
              stroke="var(--color-your-choice)" // Cor do traço
              onClick={handleClick}
            >
              {transformedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getProductColor(entry.label, index)}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <foreignObject
                        x={(viewBox?.cx || 0) - 50}
                        y={(viewBox?.cy || 0) - 30}
                        width={100}
                        height={60}
                      >
                        <div
                          style={{ textAlign: "center", lineHeight: "1.2em", fontSize: "14px" }}
                        >
                          <span className="text-lg font-bold">
                            {/* Formatando o valor total como horas e minutos */}
                            {formatDurationChart(totalValue)}
                          </span>
                          <span className="block text-muted-foreground">
                            {t.pieChartTotalDuration} {/* Tradução para o total de duração */}
                          </span>
                        </div>
                      </foreignObject>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChartRecharts>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {t.pieChartFooterDescription} {/* Tradução para o footer */}
        </div>
      </CardFooter>
    </Card>
  );
}
