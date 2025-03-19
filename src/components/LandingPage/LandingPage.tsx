import Navbar from "./components/Navbar";
import MainHero from "./components/MainHero";

import Background from '@/assets/imgs/background.svg'
import Card from "./components/Card";
import CardImg from '@/assets/imgs/card1.png';
import Card2Img from '@/assets/imgs/card2.png';
import Card3Img from '@/assets/imgs/card3.png';
import Card4Img from '@/assets/imgs/card4.png';
import Card5Img from '@/assets/imgs/card5.png';
import Card6Img from '@/assets/imgs/card6.png';

import { PiChartLineUp, PiCirclesFourFill, PiCommandBold, PiEye, PiLock } from "react-icons/pi";
import { useLanguage } from "@/context/LanguageContext"; // Importando o contexto de idioma
import { translations } from "./translations";

export default function LandingPage() {
    const { language } = useLanguage(); // Obtendo o idioma atual
    const t = translations[language];  // Usando as traduções de acordo com o idioma

    const cards = [
        {
            title: t.cardTitles.customizedAccess, // Traduzido
            description: t.cardDescriptions.customizedAccess, // Traduzido
            imgSrc: CardImg,
            icon: PiLock,
            gradient: "bg-gradient-to-b from-primary to-orange-800"
        },
        {
            title: t.cardTitles.accessMonitoring, // Traduzido
            description: t.cardDescriptions.accessMonitoring, // Traduzido
            imgSrc: Card2Img,
            icon: PiEye,
            gradient: "bg-gradient-to-b from-primary to-orange-800"
        },
        {
            title: t.cardTitles.productivityTools, // Traduzido
            description: t.cardDescriptions.productivityTools, // Traduzido
            imgSrc: Card3Img,
            icon: PiChartLineUp,
            gradient: "bg-gradient-to-b from-primary to-orange-800"
        },
        {
            title: t.cardTitles.completeCustomization, // Traduzido
            description: t.cardDescriptions.completeCustomization, // Traduzido
            imgSrc: Card4Img,
            icon: PiCirclesFourFill,
            gradient: "bg-gradient-to-b from-primary to-orange-800"
        },
        {
            title: t.cardTitles.costSavings, // Traduzido
            description: t.cardDescriptions.costSavings, // Traduzido
            imgSrc: Card5Img,
            icon: undefined,
            gradient: "bg-gradient-to-b from-primary to-orange-800"
        },
        {
            title: t.cardTitles.multiTenancy, // Traduzido
            description: t.cardDescriptions.multiTenancy, // Traduzido
            imgSrc: Card6Img,
            icon: PiCommandBold,
            gradient: "bg-gradient-to-b from-primary to-orange-800"
        }
    ];

    return (
        <div className="absolute bg-base-100 top-0 left-0 right-0 bottom-0 z-50 p-2 overflow-auto backdrop-blur-lg"
            style={{
                backgroundImage: `url(${Background.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
            <Navbar />
            <main className="max-w-[1200px] m-auto">
                <MainHero />
                <div className="h-screen w-full flex flex-row gap-4 justify-between flex-wrap">
                    {cards.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title} // Traduzido
                            description={card.description} // Traduzido
                            imgSrc={card.imgSrc}
                            gradient={card.gradient}
                            icon={card.icon}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
