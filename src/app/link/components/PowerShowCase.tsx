'use client'
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";


export default function PowerShowCase({ powerBiCredential }: any) {

    return (
        <PowerBIEmbed
            embedConfig={{
                type: 'report',
                id: powerBiCredential?.id,
                embedUrl: powerBiCredential?.embedUrl,
                accessToken: powerBiCredential?.accessToken,
                tokenType: models.TokenType.Embed,
                settings: {
                    panes: {
                        filters: {
                            expanded: false,
                            visible: false,
                        },
                        pageNavigation: {
                            visible: false,
                        },
                        visualizations: {
                            visible: true,
                        },
                    },
                },
            }}

            eventHandlers={
                new Map([
                    ['loaded', function () { console.log('Report loaded'); }],
                    ['rendered', function () { console.log('Report rendered'); }],
                    ['error', function (event: any) { console.log(event.detail); }],
                ])
            }
            cssClassName={`h-[500px] w-full rounded-lg`} // Adicionando dimensões aqui
            getEmbeddedComponent={(embeddedReport: any) => {
                //const Window: any = window;
                //Window.report = embeddedReport;
            }}
        />
    )
}