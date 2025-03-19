import { useRouter } from "next/navigation";
import { Modal } from "../Modal/Modal";
import { useTenant } from "@/context/tenantContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthentication } from "@/context/authenticationContext";

interface BlockProps {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    admin?: boolean;
}

export const Block = ({ isModalOpen, setIsModalOpen, admin = false }: BlockProps) => {
    const router = useRouter();
    const { tenantId } = useTenant();
    const { signOut } =  useAuthentication();
    const { language } = useLanguage();

    const messages = {
        pt: {
            admin: {
                title: "🚫 Acesso Bloqueado – Pagamento Obrigatório",
                description:
                    "Para continuar gerenciando os relatórios e dashboards da sua organização no FullNext, é necessário regularizar o pagamento.",
                button: "Regularizar pagamento",
            },
            user: {
                title: "🚫 Acesso Bloqueado",
                description:
                    "O acesso à plataforma foi bloqueado. Para mais informações, entre em contato com o administrador da sua organização.",
                button: "Sair",
            },
            contact: "Precisa de ajuda? Entre em contato pelo e-mail fullnextconnect@gmail.com",
        },
        en: {
            admin: {
                title: "🚫 Access Blocked – Payment Required",
                description:
                    "To continue managing your organization's reports and dashboards on FullNext, you need to update your payment.",
                button: "Update Payment",
            },
            user: {
                title: "🚫 Access Blocked",
                description:
                    "Access to the platform has been blocked. For more information, please contact your organization's administrator.",
                button: "Logout",
            },
            contact: "Need help? Contact us at fullnextconnect@gmail.com",
        },
    };

    const { title, description, button } = admin ? messages[language].admin : messages[language].user;

    return (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} Activeclose={false}>
            <div className="p-6 text-center text-white flex justify-center flex-col items-center w-full">
                <h1 className="text-2xl font-bold text-red-600">{title}</h1>
                <p className="mt-4 text-gray-500">{description}</p>
                
                {admin ? (
                    <button
                        type="button"
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
                        onClick={() => {
                            router.push(`/payment/${tenantId}`);
                            setIsModalOpen(false);
                        }}
                    >
                        {button}
                    </button>
                ) : (
                    <button
                    type="button"
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
                    onClick={signOut}
                >
                    {button}
                </button>
                )}
                
                <p className="mt-4 text-sm text-gray-500">{messages[language].contact}</p>
            </div>
        </Modal>
    );
};
