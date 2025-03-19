'use client';

import { Container } from "@/components/Grid/Container";
import { Row } from "@/components/Grid/Row";
import { Col } from "@/components/Grid/Col";
import { LineChart } from "./components/LineChart";
import { PieChart } from "./components/PieChart";
import { BarChart } from './components/BarChart';
import { DataTable } from "@/components/DataTable/Datagrid";
import { api } from "@/lib/api";
import { useAlert } from "@/context/alertContext";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { formatDurationChart } from "@/utils/utils";
import { useState, useMemo } from "react";
import { LinkUsageProps, OptionProps } from "./interface";

import { MultiInputSelect } from "@/components/Input/MultiInputSelect";
import { BarChartUser } from "./components/BarChartUser";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "./translations";

export default function LinkUsage() {
    const { handleAlert } = useAlert();
    const [date, setDate] = useState<OptionProps[]>([]);
    const [accessControl, setAccessControl] = useState<OptionProps[]>([]);
    const [user, setUser] = useState<OptionProps[]>([]);
    const [link, setLink] = useState<OptionProps[]>([]);
    const { language } = useLanguage(); // obtendo o idioma atual
    
    // Obtendo os textos traduzidos para o idioma atual
    const t = translations[language];


    const { isLoading, data = [] } = useQuery<LinkUsageProps[]>({
        queryKey: ['reportStage'],
        queryFn: async () => {
            try {
                const { status, data } = await api.get('/report/usage');
                return status === 200 ? data : [];
            } catch (error: any) {
                handleAlert('alert-error', error.message || 'Erro desconhecido');
                return [];
            }
        },
        staleTime: 24 * 60 * 60 * 1000, // 24 horas
    });

    // Gerar opções únicas
    const options = useMemo(() => {
        const uniqueOptions = (key: keyof LinkUsageProps, labelKey: keyof LinkUsageProps) => 
            Array.from(new Map(data.map(item => [item[key], item[labelKey]])))
                .map(([value, label]) => ({
                    value,
                    label: typeof label === 'number' ? label.toString() : labelKey === 'createdAt' ? new Date(label).toLocaleDateString() : label,
                }));

        return {
            date: uniqueOptions('createdAt', 'createdAt'),
            accessControl: uniqueOptions('accessControlId', 'accesscontrolname'),
            link: uniqueOptions('menuLinkId', 'label'),
            user: uniqueOptions('userId', 'name'),
        };
    }, [data]);

    // Filtrar os dados com base nos filtros aplicados
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matches = (options: OptionProps[], key: keyof LinkUsageProps) =>
                !options || options.length === 0 || options.some(opt => `${opt.value}` === `${item[key]}`);

            return (
                matches(date, 'createdAt') &&
                matches(accessControl, 'accessControlId') &&
                matches(link, 'menuLinkId') &&
                matches(user, 'userId')
            );
        });
    }, [data, date, accessControl, link, user]);

    const columns: ColumnDef<LinkUsageProps>[] = [
        {
            accessorKey: 'createdAt',
            header: t.dateRegister, // Tradução para "Date Register"
            cell: ({ getValue }: any) => new Date(getValue()).toLocaleDateString(),
        },
        { accessorKey: 'accesscontrolname', header: t.accessControl }, // Tradução para "Access Control" 
        { accessorKey: 'name', header: t.userName }, // Tradução para "User Name"
        { accessorKey: 'label', header: t.report }, // Tradução para "Report"
        { accessorKey: 'qtd', header: t.quantity }, // Tradução para "Quantity"
        {
            accessorKey: 'duration',
            header: t.duration, // Tradução para "Duration (hh:mm)"
            cell: ({ getValue }: any) => formatDurationChart(getValue()),
        },
    ];

    return (
        <Container>
            <Row>
                {['date', 'link', 'accessControl', 'user'].map((filterKey: string, index) => (
                    <Col
                        key={filterKey}
                        classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-3']}
                    >
                        <MultiInputSelect
                            id={filterKey}
                            label={`${t.chooseFilter} ${t.labels[filterKey]}`} // Tradução para "Choose your"
                            onChange={ 
                                filterKey === 'date'
                                    ? setDate
                                    : filterKey === 'link'
                                    ? setLink
                                    : filterKey === 'accessControl'
                                    ? setAccessControl
                                    : setUser
                            }
                            placeholder={`${t.chooseFilter} ${t.labels[filterKey]}`} // Tradução para "Choose your"
                            options={options[filterKey as keyof typeof options]}
                            value={ 
                                filterKey === 'date'
                                    ? date
                                    : filterKey === 'link'
                                    ? link
                                    : filterKey === 'accessControl'
                                    ? accessControl
                                    : user
                            }
                        />
                    </Col>
                ))}

                <Col isBorderActive>
                    <LineChart data={filteredData} />
                </Col>
                <Col classNameColSpan={['col-span-12', 'md:col-span-7', 'lg:col-span-8']} isBorderActive>
                    <BarChart data={filteredData} />
                </Col>
                <Col classNameColSpan={['col-span-12', 'md:col-span-5', 'lg:col-span-4']} isBorderActive>
                    <PieChart data={filteredData} />
                </Col>
                <Col classNameColSpan={['col-span-12', 'md:col-span-12', 'lg:col-span-12']} isBorderActive>
                    <BarChartUser data={filteredData} />
                </Col>
                <Col classNameColSpan={['col-span-12', 'md:col-span-12', 'lg:col-span-12']} isBorderActive>
                    <DataTable data={filteredData} columns={columns} isLoading={isLoading} />
                </Col>
            </Row>
        </Container>
    );
}
