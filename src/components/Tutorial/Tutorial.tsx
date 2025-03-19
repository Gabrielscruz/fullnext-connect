'use client'
import { useState } from "react";
import Joyride, { Step } from "react-joyride";

export const Tutorial = () => {
  const [run, setRun] = useState(false);

  // Passos do tutorial
  const steps: Step[] = [
    {
      target: "#perfil", // Classe do elemento a ser destacado
      content: "Aqui você pode visualizar seus relatórios e estatísticas.",
      disableBeacon: true,
    },
    {
      target: "#profile",
      content: "Nesta seção, você pode alterar as configurações do sistema.",
    },
    {
      target: ".botao-criar",
      content: "Clique aqui para criar um novo relatório.",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run} // Usa o estado 'run' para controlar o início do tutorial
      continuous
      showSkipButton={false}
      disableOverlayClose={false} // Impede fechar ao clicar no fundo
      disableCloseOnEsc={false} // Impede fechar ao apertar "ESC"
      spotlightClicks={true} // Avança o tutorial a cada clique no elemento
      styles={{
        options: {
          primaryColor: "var(--p)", // Cor laranja principal
        },
      }}
      showProgress
      callback={(data) => {
        if (data.status === "finished" || data.status === "skipped") {
          setRun(false); // O tutorial é parado quando terminado ou pulado
        }
      }}
    />
  );
};
