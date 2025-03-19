'use client'
import { useEffect, useState } from "react";
import { PiUserGearLight, PiGearLight } from "react-icons/pi";

import nothingImg from '@/assets/imgs/nothingImg.png';
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import Image from "next/image";
import { api } from "@/lib/api";
import { useAuthentication } from "@/context/authenticationContext";
import { useLanguage } from "@/context/LanguageContext";
import { convertUrl } from "@/utils/utils";
import ptImg from '@/assets/imgs/pt.png';
import enImg from '@/assets/imgs/en.png';

import { useAlert } from "@/context/alertContext";
import { useTheme } from "@/context/themeContext";

export const translations = {
  en: {
    navbar: {
      logoAlt: "Dashboard Image",
      settings: "Settings",
      profile: 'Profile',
      subscription: 'Subscription',
      logout: "Logout",
      searchPlaceholder: "Search...",
    },
    profile: {
      profilePicture: "Profile Picture",
      changePicture: "Change Picture",
      deletePicture: "Delete Picture",
      name: "Name",
      aboutMe: "About Me",
      bio: "Bio",
      updatePassword: "Update Password",
      password: "Password",
      repeatPassword: "Repeat Password",
      confirmPassword: "Confirm Password",
      saveChanges: "Save Changes",
      nameRequired: "Name is required.",
      passwordRequired: "Password is required.",
      passwordsDoNotMatch: "Passwords do not match.",
      userUpdated: "User updated successfully!",
      userUpdateFailed: "Failed to update user.",
      unexpectedError: "An unexpected error occurred.",
    },
    settings: {
      language: "Change language",
      theme: 'Change theme'
    }
  },
  pt: {
    navbar: {
      logoAlt: "Imagem do Painel",
      settings: "Configurações",
      profile: 'Perfil',
      subscription: 'Assinatura',
      logout: "Sair",
      searchPlaceholder: "Pesquisar...",
    },
    profile: {
      profilePicture: "Foto de Perfil",
      changePicture: "Alterar Foto",
      deletePicture: "Excluir Foto",
      name: "Nome",
      aboutMe: "Sobre Mim",
      bio: "Biografia",
      updatePassword: "Atualizar Senha",
      password: "Senha",
      repeatPassword: "Repetir Senha",
      confirmPassword: "Confirmar Senha",
      saveChanges: "Salvar Alterações",
      nameRequired: "O nome é obrigatório.",
      passwordRequired: "A senha é obrigatória.",
      passwordsDoNotMatch: "As senhas não coincidem.",
      userUpdated: "Usuário atualizado com sucesso!",
      userUpdateFailed: "Falha ao atualizar o usuário.",
      unexpectedError: "Ocorreu um erro inesperado.",
    },
    settings: {
      language: "Alterar linguagem",
      theme: 'Alterar tema'
    }
  },
};

interface ProfileProps extends React.HTMLAttributes<HTMLDialogElement> {
  isModalProfileOpen: boolean;
  setIsModalProfileOpen: (value: boolean) => void;
}

export const Profile = ({ isModalProfileOpen, setIsModalProfileOpen }: ProfileProps) => {
  const { user } = useAuthentication();
  const { language, handleLanguage } = useLanguage();
  const { theme, handleTheme } = useTheme()
  const { handleAlert } = useAlert();
  const navbar = translations[language].navbar; // Obtenha as traduções do perfil
  const settings = translations[language].settings; // Obtenha as traduções do perfil
  const t = translations[language].profile; // Obtenha as traduções do perfil

  const [step, setStep] = useState(1);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);

  const [fileImg, setFileImg] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const getProfile = async () => {
    try {
      const response = await api.get('profile');
      if (response.status === 200) {
        const { user: userData } = response.data;
        const isGoogleImg: boolean = userData?.profileUrl?.includes('googleusercontent');
        if (userData?.profileUrl) setPreviewUrl(isGoogleImg ? userData?.profileUrl : convertUrl(userData?.profileUrl));
        setName(userData.name);
        setEmail(userData.email);
        setAbout(userData.about);
      }
    } catch (error) {
      handleAlert('alert-error', t.unexpectedError); // Exibe mensagem de erro
    }
  }

  useEffect(() => {
    if (isModalProfileOpen) getProfile()
  }, [isModalProfileOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileImg(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File | null, userId: number) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await api.put(`/user/upload/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        handleAlert('alert-error', t.unexpectedError); // Exibe mensagem de erro
      }
    }
  };

  const validateFields = () => {
    if (!name.trim()) {
      handleAlert('alert-warning', t.nameRequired); // Nome é obrigatório
      return false;
    }
    if (isUpdatePassword) {
      if (!password.trim() || !confirmPassword.trim()) {
        handleAlert('alert-warning', t.passwordRequired); // Senha é obrigatória
        return false;
      }
      if (password !== confirmPassword) {
        handleAlert('alert-warning', t.passwordsDoNotMatch); // Senhas não coincidem
        return false;
      }
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateFields()) return; // Valida os campos antes de enviar

    try {
      const response = await api.put('profile', {
        name,
        about,
        isUpdatePassword,
        password,
      });
      if (response.status === 200 && user?.id) {
        await uploadFile(fileImg, user?.id);
        handleAlert('alert-success', t.userUpdated); // Exibe mensagem de sucesso
      } else {
        handleAlert('alert-warning', t.userUpdateFailed); // Exibe mensagem de erro
      }
    } catch (error) {
      handleAlert('alert-error', t.unexpectedError); // Exibe mensagem de erro
    }
  };

  return (
    <Modal isModalOpen={isModalProfileOpen} setIsModalOpen={setIsModalProfileOpen}>
      <main className="flex flex-col flex-1 w-full h-full">
        <nav className="flex flex-col w-full h-[90px] border-base-300 border-b-[0.5px] gap-2">
          <button type="button" className="flex flex-col h-full w-52 border-base-300 border-r-[0.5px]"></button>
        </nav>
        <div className="flex flex-1 flex-row">
          <aside className="flex flex-col w-52 h-full border-base-300 border-[0.5px] gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`h-11 w-full ${step === 1 && 'border-r-2 border-primary bg-base-300'} flex flex-row gap-4 items-center p-4`}>
              <PiUserGearLight className="w-6 h-6" /> {navbar.profile}
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`h-11 w-full ${step === 2 && 'border-r-2 border-primary bg-base-300'} flex flex-row gap-4 items-center p-4`}>
              <PiGearLight className="w-6 h-6" /> {navbar.settings}
            </button>
          </aside>
          <article className="flex flex-1 w-full h-full">
            <div className="w-full h-[580px] p-8 overflow-auto">
              {step === 1 && (
                <>
                  {/* Foto de perfil */}
                  <div className="flex flex-1 flex-row p-4 gap-4 items-center">
                    <div className="flex flex-col gap-2 items-center">
                      <h3 className="font-bold text-base-content">{t.profilePicture}</h3>
                      <Image
                        src={previewUrl || nothingImg}
                        alt="Profile"
                        className="bg-gray-500 rounded-md w-28 h-28 object-cover"
                        width={112}
                        height={112}
                      />
                    </div>
                    <div className="flex flex-row gap-2">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        id="fileInput"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="fileInput" className="btn bg-primary hover:bg-primary hover:brightness-110 cursor-pointer text-white">
                        {t.changePicture}
                      </label>
                      <button
                        type="button"
                        className="btn btn-error btn-outline"
                        onClick={() => {
                          setFileImg(null);
                          setPreviewUrl(null);
                        }}
                      >
                        {t.deletePicture}
                      </button>
                    </div>
                  </div>
                  <div className="w-full p-4 gap-2 items-center">
                    <Input id="name" type="text" placeholder={t.name} label={t.name} name="name" value={name} className="w-full" onChange={(event) => setName(event.target.value)} />
                  </div>
                  {/* Sobre mim */}
                  <div className="flex w-full flex-row p-4 gap-2 items-center">
                    <label htmlFor="bio" className="flex flex-col gap-2 w-full font-bold">
                      {t.aboutMe}
                      <textarea
                        id="bio"
                        className="textarea h-32 w-full bg-base-200 border-base-300 border-[0.5px]"
                        placeholder={t.bio}
                        value={about}
                        onChange={(event) => setAbout(event.target.value)}
                      />
                    </label>
                  </div>
                  {/* Atualizar senha */}
                  <div className="flex w-full flex-row p-4 gap-2 items-center">
                    <label className="cursor-pointer flex flex-row gap-2">
                      <span className="label-text">{t.updatePassword}</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-secondary"
                        checked={isUpdatePassword}
                        onChange={() => { setIsUpdatePassword(!isUpdatePassword) }} />
                    </label>
                  </div>

                  {isUpdatePassword && (
                    <div className="flex flex-col w-full gap-2 p-4">
                      <Input id="new-password" type="password" placeholder={t.password} label={t.password} name="newPassword" value={password} onChange={(event) => setPassword(event.target.value)} />
                      <Input id="confirm-password" type="password" placeholder={t.repeatPassword} label={t.confirmPassword} name="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    </div>
                  )}

                  <div className="flex flex-row justify-end p-4">
                    <button type="button" className="btn bg-primary hover:bg-primary hover:brightness-110 text-white" onClick={onSubmit}>{t.saveChanges}</button>
                  </div>

                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col w-full h-full gap-2 justify-start">
                      <span className="bg-primary w-fit p-2 rounded-md text-white shadow-md">{email}</span>
                    </div>
                    <div className="flex flex-col gap-2 items-start justify-start">
                      <label className="font-bold">{settings.theme}</label>
                      <button type="button" className="swap swap-rotate px-4" onClick={() => handleTheme(theme === 'fullnest-dark' ? 'fullnest-light' : 'fullnest-dark')}>
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" className="theme-controller" value="synthwave" />

                        {/* sun icon */}
                        <svg
                          className={`${theme === 'fullnest-light' ? 'swap-on' : 'swap-off'} h-10 w-10 fill-current`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24">
                          <path
                            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>

                        {/* moon icon */}
                        <svg
                          className={`${theme === 'fullnest-dark' ? 'swap-on' : 'swap-off'} h-10 w-10 fill-current`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24">
                          <path
                            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                      </button>
                    </div>

                    <div>
                      <label className="font-bold">{settings.language}</label>
                      <div className="flex flex-row w-full h-fit p-4 gap-2 justify-start">
                        <button type="button" onClick={() => handleLanguage('pt')} className={`relative ${language === 'pt' && "px-2 bg-primary rounded-md"}`}>
                          <Image
                            src={ptImg}
                            alt="pt"
                            width={100}
                            height={100}

                          />
                          <span className="absolute top-2 right-2 btn btn-neutral btn-sm">pt</span>
                        </button>

                        <button type="button" onClick={() => handleLanguage('en')} className={`relative ${language === 'en' && "px-2 bg-primary rounded-md"}`}>
                          <Image
                            src={enImg}
                            alt="en"
                            width={100}
                            height={100}

                          />
                          <span className="absolute top-2 right-2 btn btn-neutral btn-sm">en</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </article>
        </div>
      </main>
    </Modal>
  );
};