'use client'
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";

import logoDark from "@/assets/imgs/fullnextDark.svg";
import logoWhite from "@/assets/imgs/fullnextWhite.svg";
import BackgroundDark from '@/assets/imgs/backgroundReportDark.png';
import BackgroundWhite from '@/assets/imgs/backgroundReportWhite.png';
import { useTheme } from "@/context/themeContext";
import { CreateMultiInputSelect } from "@/components/Input/CreateMultiInputSelect";
import { Input } from "@/components/Input/Input";
import { useAlert } from "@/context/alertContext";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import axios from "axios";
import { PiPlusCircleFill } from "react-icons/pi";
import { InputFile } from "@/components/Input/InputFile";
import { AuthenticationContext } from "@/context/authenticationContext";
import { useLanguage } from "@/context/LanguageContext";
const LadingComponent = dynamic(() => import("@/components/Loading/Loading"), { ssr: false });

const SVGComponent = ({ color = "#6c63ff" }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 489.48" role="img">
            <path
                d="M317.06,205.26a205.98,205.98,0,0,0-77.68,15.07c-.99.41-1.99.82-2.99,1.23A206.78,206.78,0,0,0,110,412.32v225.94a9.01,9.01,0,0,0,9,9l.18.02c173.47,31.5,342.11,47.46,501.37,47.46q3.58,0,7.16-.01c156.55-.48,308.99-16.44,453.08-47.45l.21-.02a9.01,9.01,0,0,0,9-9v-424a9.01,9.01,0,0,0-9-9Z"
                transform="translate(-110 -205.26)"
                fill={color}
            />
            <path
                d="M855.8,385.45a5.95,5.95,0,0,0,0,11.89H1004.89a5.95,5.95,0,1,0,.19-11.89q-.1,0-.19,0Z"
                transform="translate(-110 -205.26)"
                fill="#3f3d56"
            />
            <circle cx="751.82" cy="50.39" r="6.39" fill="#fff" opacity="0.4" />
            <circle cx="778.44" cy="50.39" r="6.39" fill="#fff" opacity="0.4" />
            <circle cx="805.07" cy="50.39" r="6.39" fill="#fff" opacity="0.4" />
            <path
                d="M770.16,580.72a35.27,35.27,0,1,1,35.27-35.27A35.31,35.31,0,0,1,770.16,580.72Z"
                transform="translate(-110 -205.26)"
                fill="#3f3d56"
            />
            <path
                d="M783.68,542.07H773.54V531.92a3.38,3.38,0,0,0-6.76,0v10.14H756.63a3.38,3.38,0,0,0,0,6.76h10.14v10.14a3.38,3.38,0,0,0,6.76,0V548.83h10.14a3.38,3.38,0,1,0,0-6.76Z"
                transform="translate(-110 -205.26)"
                fill="#fff"
            />
        </svg>
    );
};

interface searchParamsProps {
    searchParams: {
        name: string | undefined;
        email: string | undefined;
    };
}
export default function Organization({ searchParams }: searchParamsProps) {
    const { theme } = useTheme();
    const { signIn } = useContext(AuthenticationContext);
    const { handleAlert } = useAlert();
    const { language, translateText } = useLanguage();
    const [channels, setChannels] = useState<string[]>([]);
    const [nameChannelOther, setNameChannelOther] = useState<string>('');
    const [industries, setIndustries] = useState<string[]>([]);

    const [nameIndustrieOther, setNameIndustrieOther] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [isOtherChannelOpen, setIsOtherChannelOpen] = useState<boolean>(false);
    const [isOtherIndustryOpen, setIsOtherIndustryOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emails, setEmails] = useState<any[]>([]);

    const [color, setColor] = useState<string>('#E88C30');
    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState<string>('');

    const { data: session, status } = useSession();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const totalSteps = 5;

    useEffect(() => {
        if (status === "unauthenticated" ) {
            if (searchParams?.email === undefined) {
                router.replace('/');
            }
            
        }
    }, [status, router]);

    if (status === "loading" || !session) return null;

    function toggleSelection(list: string[], setList: Function, option: string) {
        setList(list.includes(option) ? list.filter(item => item !== option) : [...list, option]);
    }

    function nextStep() {
        if (step === 1 && channels.length === 0 && !nameChannelOther.trim()) {
            handleAlert("alert-warning", language === 'en' ? "Please select or specify how you heard about us." : "Selecione ou especifique como você ficou sabendo de nós.");
            return;
        }

        if (step === 2 && industries.length === 0 && !nameIndustrieOther.trim()) {
            handleAlert("alert-warning", language === 'en' ? "Please select or specify your industry." : "Selecione ou especifique seu setor.");
            return;
        }


        if (step === 4) {
            const organizationName = (document?.getElementById("organizationName") as HTMLInputElement)?.value.trim();
            if (!organizationName) {
                handleAlert("alert-warning", language === 'en' ? "Please enter your organization name." : "Insira o nome da sua organização.");
                return;
            }
        }

        if (step === 5) {
            if (!file) {
                handleAlert("alert-warning", language === 'en' ? "Please insert your image and color in the organization." : "Por favor, insira sua imagem e cor na organização.");
                return;
            }

            // Verifica se o tipo MIME é de imagem
            if (!file.type.startsWith("image/")) {
                handleAlert("alert-warning", language === 'en' ? "Invalid file type. Please upload an image." : "Tipo de arquivo inválido. Por favor, carregue uma imagem.");
                return;
            }
        }

        if (step < totalSteps) setStep(step + 1);
        if (step === totalSteps) onSave();
    }


    function prevStep() {
        if (step > 1) setStep(step - 1);
    }

    const progressWidth = `${(step / totalSteps) * 100}%`;

    const communicationChannels = language === 'en' ? [
        "Snapchat", "Outdoor", "Friend/Colleague", "Reddit", "YouTube",
        "Facebook/Instagram", "TikTok", "Search Engine (Google, Bing, etc.)",
        "Software Review Sites", "LinkedIn", "TV/Streaming (Hulu, NBC, etc.)"
    ] : [
        "Snapchat", "Outdoor", "Amigo/Colega", "Reddit", "YouTube",
        "Facebook/Instagram", "TikTok", "Motor de Busca (Google, Bing, etc.)",
        "Sites de Avaliação de Software", "LinkedIn", "TV/Streaming (Hulu, NBC, etc.)"
    ]
        ;

    const industryOptions = language === 'en' ? [
        "Information Technology", "Healthcare", "Education", "Retail", "Manufacturing",
        "Financial Services", "Consulting", "Real Estate", "Tourism & Hospitality",
        "Entertainment", "Agribusiness", "Logistics & Transportation", "Energy",
        "Food & Beverage", "Telecommunications", "E-commerce", "Marketing & Advertising",
        "Fashion & Apparel Retail", "Construction", "Automotive"
    ] : [
        "Tecnologia da Informação", "Saúde", "Educação", "Varejo", "Manufatura",
        "Serviços Financeiros", "Consultoria", "Imobiliário", "Turismo & Hospitalidade",
        "Entretenimento", "Agroindústria", "Logística & Transporte", "Energia",
        "Alimentos & Bebidas", "Telecomunicações", "E-commerce", "Marketing & Publicidade",
        "Moda & Varejo de Roupas", "Construção", "Automotivo"
    ]
        ;


    const uploadFile = async (name: string, color: string) => {
        const formData = new FormData();
        formData.append("file", file!); // Confirm file exists with '!'
        await api.put(`/organization/upload?name=${name}&color=${color}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    };

    const onSave = async () => {
        setIsLoading(true);
        const password = uuidv4()
        const MIN_LOADING_TIME = 3000; // 30 segundos
        const startTime = Date.now();
        const nameOrg = name.toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replaceAll(' ', '_')

        try {
            const { status, data } = await api.post("organization", {
                channels: nameChannelOther === '' ? channels : [...channels, nameChannelOther],
                industries: nameIndustrieOther === '' ? industries : [...industries, nameIndustrieOther],
                emails,
                name: nameOrg,
                user: (searchParams?.email ? { ...searchParams, password } : { ...session?.user, password })
            });
            if (status === 200) {
                await uploadFile(nameOrg, color.replace('#', ''))
                await signIn(
                    {
                        email: String(searchParams?.email || session?.user?.email),
                        password,
                        tenant: nameOrg
                    }
                )
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                handleAlert("alert-warning", error.response?.data?.message || error.message);
            } else {
                handleAlert("alert-warning", error);
            }
        } finally {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

            setTimeout(() => {
                setIsLoading(false);
            }, remainingTime);
        }
    };

    const colors = [
        '#1B4CB3', '#2662D9', '#3A7BFF', '#5C8CFF', // Azul
        '#C41E58', '#E23670', '#FF4F8A', '#FF709F', // Rosa
        '#8F3BB7', '#AF57DB', '#C87EFF', '#DA9CFF', // Roxo
        '#C76F1E', '#E88C30', '#FFA64D', '#FFB870', // Laranja
        '#1F956E', '#2EB88A', '#52D6AA', '#76E4C3', // Verde-água
        '#066529', '#098637', '#1CAF5F', '#3FCC82', // Verde
        '#5C422B', '#765337', '#967251', '#B08E6E', // Marrom
        '#A01313', '#C81D1D', '#E63939', '#FF6666', // Vermelho
        '#B89A00', '#D4B200', '#F2CA00', '#FFDE33', // Amarelo
        '#9A64C1', '#B877D8', '#D08CFF', '#F1B0FF', // Lilás
        '#00A0A0', '#00B8B8', '#00D0D0', '#66E0E0', // Turquesa
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event?.target?.files?.[0];
        if (files && files.type.startsWith('image/')) {
            setFile(files);
            setUrl(URL.createObjectURL(files));
        } else {
            handleAlert("alert-error", 'img invalida');
        }
    };



    return (
        <div className="absolute inset-0 flex items-center justify-center p-4">
            {isLoading && <LadingComponent />}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: theme === 'fullnest-light' ? `url(${BackgroundWhite.src})` : `url(${BackgroundDark.src})` }} />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <article className="relative z-10 h-[750px] w-[920px] bg-base-200 rounded-md flex flex-col gap-4 shadow-lg p-4 justify-between">
                <header className="flex justify-between items-center text-lg">
                    <Image src={theme === 'fullnest-light' ? logoWhite : logoDark} alt="Dashboard Logo" className="h-28 w-fit" />
                    <p className="font-semibold">{`${language === 'en' ? 'Welcome' : 'Bem-vindo'}, ${searchParams?.name || session.user?.name}`}</p>
                </header>
                <main className="flex flex-col gap-8 h-full p-4">
                    {step === 1 && (
                        <>
                            <h2 className="text-4xl font-bold text-center">{language === 'en' ? 'How did you hear about us?' : 'Como você ficou sabendo de nós?'}</h2>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {communicationChannels.map((option) => (
                                    <button key={option} className={`btn ${channels.includes(option) ? 'bg-primary text-white' : 'btn-outline'}`} onClick={() => toggleSelection(channels, setChannels, option)}>
                                        {option}
                                    </button>
                                ))}
                                <button className={`btn ${isOtherChannelOpen ? 'border-primary text-white' : 'border-white'} hover:bg-primary`} onClick={() => setIsOtherChannelOpen(!isOtherChannelOpen)}>
                                    {language === 'en' ? 'Other' : 'Outro'}
                                </button>
                            </div>
                            {isOtherChannelOpen && (
                                <Input
                                    id="otherChannel"
                                    name="otherChannel"
                                    placeholder={language === 'en' ? 'Specify' : 'Especificar'}
                                    className="w-full"
                                    type="text"
                                    value={nameChannelOther}
                                    onChange={(event) => setNameChannelOther(event.target.value)}
                                />
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-4xl font-bold text-center">{language === 'en' ? "What is your company's industry?" : 'Qual é o setor da sua empresa?'}</h2>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {industryOptions.map(async (option) => (
                                    <button key={option} className={`btn ${industries.includes(option) ? 'bg-primary text-white' : 'btn-outline'}`} onClick={() => toggleSelection(industries, setIndustries, option)}>
                                        {option}
                                    </button>
                                ))}
                                <button className={`btn ${isOtherIndustryOpen ? 'border-primary text-white' : 'border-white'} hover:bg-primary`} onClick={() => setIsOtherIndustryOpen(!isOtherIndustryOpen)}>{language === 'en' ? 'Other' : 'Outro'}</button>
                            </div>
                            {isOtherIndustryOpen && (
                                <Input id="otherIndustry" name="otherIndustry" placeholder={language === 'en' ? 'Specify' : 'Especificar'} className="w-full" type="text" value={nameIndustrieOther} onChange={(event) => setNameIndustrieOther(event.target.value)} />
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="text-4xl font-bold text-center">{language === 'en' ? 'Invite people to your workspace:' : 'Convide pessoas para seu espaço de trabalho:'}</h2>
                            <CreateMultiInputSelect id="email" onChange={setEmails} options={emails} value={emails} placeholder="Enter email" />
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h2 className="text-4xl font-bold text-center">{language === 'en' ? 'Organization Name' : 'Nome da organização'}</h2>
                            <Input id="organizationName" name="organizationName" placeholder={language === 'en' ? 'Organization Name' : 'Nome da organização'} className="w-full" type="text" onChange={(event) => setName(event.target.value)} value={name} />
                        </>
                    )}

                    {step === 5 && (
                        <>
                            <div className="flex flex-col items-cente  justify-between gap-4">
                                <h2>{language === 'en' ? 'Decide your Logo ?' : 'Decidir seu logotipo?'}</h2>
                                <div className="h-[80px] w-full flex flex-row">
                                    <InputFile onChange={handleFileChange} />
                                    <Image
                                        src={url}
                                        alt="logo"
                                        className={`h-32 w-fit mx-auto rounded-md`}
                                        width={128} height={128}
                                    />
                                </div>
                                <h2>{language === 'en' ? 'Decide your color ?' : 'Decidir sua cor?'}</h2>
                                <div className="flex flex-row ">
                                    <div className="flex flex-row gap-2 flex-wrap w-[550px] h-fit items-start justify-start">
                                        <label htmlFor="color" className="w-7 h-7 rounded-md border-none bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 flex justify-center items-center">
                                            <input id="color" type="color" value={color} className="hidden" onChange={(event) => setColor(event.target.value)} />
                                            <PiPlusCircleFill className="text-black w-6 h-6" />
                                        </label>
                                        {colors.map((colorMap) => <div style={{ background: colorMap }} className={`w-7 h-7 rounded-md ${colorMap === color && 'border-2'} `} onClick={() => setColor(colorMap)} />)}
                                    </div>
                                    <SVGComponent color={color} />
                                </div>

                            </div>
                        </>
                    )}
                </main>
                <footer>
                    <div className="w-full bg-base-300 h-2">
                        <div className="bg-primary h-2" style={{ width: progressWidth }} />
                    </div>
                    <div className="flex justify-between mt-4">
                        <button className="btn btn-outline" onClick={prevStep} disabled={step === 1}>{language === 'en' ? '< Previous' : '< Anterior'}</button>
                        <button className={`btn ${step === totalSteps ? 'bg-primary text-white' : 'btn-outline'}  hover:bg-primary hover:brightness-110`} onClick={nextStep}>{step === totalSteps ? `${language === 'en' ? 'Finish' : 'Terminar'}` : `${language === 'en' ? 'Next >' : 'Próximo>'}`}</button>
                    </div>
                </footer>
            </article>
        </div>
    );
}
