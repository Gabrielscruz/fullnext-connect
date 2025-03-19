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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTheme } from "@/context/themeContext";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";

// Define os tipos para os dados e a configuração do gráfico
interface Item {
  name: string; // Nome do usuário
  qtd: number;  // Quantidade de acessos
}

interface ChartConfigEntry {
  name: string;
  color: string;
}

interface ChartConfigMap {
  [key: string]: ChartConfigEntry;
}

let chartConfig: ChartConfigMap = {}; // Configuração inicial do gráfico

// Função para transformar os dados agrupando por nome e somando a quantidade
const transformForBarChart = (data: Item[]) => {
  const groupedData: { [key: string]: number } = data.reduce(
    (acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = 0;
      }
      acc[item.name] += item.qtd;
      return acc;
    },
    {} as { [key: string]: number } // Garante que o acumulador tenha o tipo correto
  );

  // Transforma o objeto em um array de objetos com as propriedades `name` e `quantity`
  return Object.entries(groupedData).map(([name, quantity]) => ({
    name,
    quantity,
  }));
};

// Componente principal do gráfico
export function BarChartUser({ data }: { data: Item[] }) {
      const { language } = useLanguage(); // obtendo o idioma atual
      
      // Obtendo os textos traduzidos para o idioma atual
      const t = translations[language];

  // Memoiza os dados transformados para evitar recalcular
  const transformedData = useMemo(() => transformForBarChart(data), [data]);

  // Lida com o clique na barra
  const handleClick = (data: { name: string }) => {
    alert(`Você clicou em ${data.name}`); // Exibe o nome ao clicar
  };

  // Obtém a cor do produto ou usa uma cor padrão
  const getProductColor = (index: number) => {
    return `hsl(var(--chart-${index + 2}))` || "hsl(210, 10%, 80%)"; // Cor padrão
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.bar2ChartTitle}</CardTitle> {/* Tradução para o título */}
        <CardDescription>{t.bar2ChartDescription}</CardDescription> {/* Tradução para a descrição */}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          style={{ height: "300px", width: "100%" }}
        >
          <BarChartRecharts data={transformedData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name" // Nome do usuário no eixo X
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  className="bg-base-300"
                />
              }
            />
            <Bar
              dataKey="quantity" // Quantidade no eixo Y
              fill={getProductColor(0)} // Cor da barra
              radius={4}
              onClick={handleClick} // Evento ao clicar na barra
            />
          </BarChartRecharts>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {t.bar2ChartFooterDescription} {/* Tradução para o footer */}
        </div>
      </CardFooter>
    </Card>
  );
}
