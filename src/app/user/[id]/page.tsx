'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LuPartyPopper } from "react-icons/lu";
import { PiLock } from "react-icons/pi";

import { Container } from "@/components/Grid/Container";
import { Row } from "@/components/Grid/Row";
import { Col } from "@/components/Grid/Col";
import { Input } from "@/components/Input/Input";
import { InputFile } from "@/components/Input/InputFile";
import { InputTextarea } from "@/components/Input/InputTextarea";
import { InputSelect } from "@/components/Input/InputSelect";
import { Button } from "@/components/Button/Button";
import { api } from "@/lib/api";
import { useAlert } from "@/context/alertContext";
import { convertUrl } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";





export default function Update({ params }: any) {
  const router = useRouter()
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);
  const { handleAlert } = useAlert();
  const { language } = useLanguage(); // Obtendo o idioma atual
  const t = translations[language]
  

  const userSchema = z.object({
    name: z.string().nonempty({ message:  t.InputName.message}),
    email: z.string().email({ message: t.email.message}),
    accessControl: z.object({
      value: z.number(),
      label: z.string(),
    }),
    dateOfBirth: z.string().min(10, { message:  t.dateOfBirth.message }),
    updatePassword: z.boolean(),
    password: z.string().optional(),
    passwordRepeat: z.string().optional(),
    about: z.string().optional(),
  }).refine(
    (data: any) => {
      // Valida apenas se `updatePassword` for true
      if (data.updatePassword) {
        // Senha deve ter no mínimo 6 caracteres e as senhas devem coincidir
        return (
          data?.password?.length >= 6 &&
          data?.password === data.passwordRepeat
        );
      }
      return true; // Ignorar validação se updatePassword for false
    },
    {
      message: t.passwordRepeat.message,
      path: ["passwordRepeat"], // Caminho do erro para facilitar o feedback
    }
  );
  type UserFormData = z.infer<typeof userSchema>;


  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });


  
  // Wrap getUser in useCallback
  const getUser = useCallback(async (id: string) => {
    try {
      const { status, data } = await api.get(`user/${id}`);
      if (status === 200) {
        setValue('name', data.user.name);
        setValue('email', data.user.email);
        setValue('updatePassword', false);
        setValue('dateOfBirth', data.user.dateOfBirth.substring(0, 10));
        setValue('accessControl', { value: data.user.accessControl.id, label: data.user.accessControl.name });
        setValue('about', data.user.about);
        const isGoogleImg =  data.user.profileUrl.includes('googleusercontent');
        setAvatarUrl(isGoogleImg ? data.user.profileUrl : convertUrl(data.user.profileUrl));
      }
    } catch (error) {
      handleAlert('alert-error', t.unexpectedError);
    }
  }, [setValue, handleAlert]);

  useEffect(() => {
    if (params.id) getUser(params.id);
  }, [params.id]); // Added getUser to the dependencies

  const dateOfBirth = watch('dateOfBirth');
  const about = watch('about');
  const accessControl: any = watch('accessControl');
  const updatePassword: boolean = watch('updatePassword')

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
        handleAlert('alert-success', t.fileUploadSuccess);
      } catch (error) {
        handleAlert('alert-error',t.fileUploadError);
      }
    }
  };

  // Wrap fetchAccessControlOptions in useCallback
  const fetchAccessControlOptions = useCallback(async () => {
    try {
      const { data, status } = await api.get('/menu/access-control');
      if (status === 200) {
        const AccessControlOptions = data.map((option: any) => {
          return { value: option.id, label: option.name };
        });
        setOptions(AccessControlOptions);
      }
    } catch (error: any) {
      handleAlert('alert-error', error?.message);
    }
  }, [handleAlert]);

  useEffect(() => {
    fetchAccessControlOptions();
  }, [fetchAccessControlOptions]); // Added fetchAccessControlOptions to the dependencies

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await api.put(`user/${params.id}`, data);
      if (response.status === 200) {
        if (avatarFile) await uploadFile(avatarFile, response?.data?.user?.id);
        router.push('/user');
        handleAlert('alert-success', t.userUpdated);
      } else {
        handleAlert('alert-error',t.userUpdatetionFailed);
      }
    } catch (error) {
      handleAlert('alert-error', t.unexpectedError);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    } else {
      handleAlert("alert-error", t.invalidImageFile);
    }
  };


  return (
    <Container>
      <Row>
        <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-8']} isBorderActive>
          <form onSubmit={onSubmit}>
            <Row>
              <Col>
                <Input id="name" type="text" placeholder={t.InputName.placeholder} label={t.InputName.label} error={errors.name?.message}
                  {...register("name")} />
              </Col>
              <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-8']}>
                <Input id="email" type="email" placeholder={t.email.placeholder} label={t.email.label}  error={errors.email?.message}
                  {...register("email")} />
              </Col>
              <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-4']}>
                <Input id="dateOfBirth" type="date" placeholder={t.dateOfBirth.placeholder} label={t.dateOfBirth.label} error={errors.dateOfBirth?.message}
                  {...register("dateOfBirth")} />
              </Col>
              <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-4']}>
                <InputSelect
                  id="accessControl"
                  label={t.accessControl.label}
                  onChange={(option: any) => setValue('accessControl', option)}
                  placeholder={t.accessControl.placeholder}
                  value={accessControl}
                  options={options}
                  error={errors.accessControl?.message}
                />
              </Col>
              <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-8']}>
                <InputFile label={t.profile.label} onChange={handleFileChange} />
              </Col>
              <Col classNameColSpan={['col-span-12', 'md:col-span-12', 'lg:col-span-12']}>
                <div className="form-control w-52">
                  <label className="label cursor-pointer">
                    <span className="label-text">{language === 'en' ? 'Update Password' : 'Atualizar Senha'}</span>
                    <input type="checkbox" className="toggle toggle-secondary" onChange={() => setValue('updatePassword', !updatePassword)} checked={updatePassword} />
                  </label>
                </div>
              </Col>
              {updatePassword && <>
                <Col>
                  <Input id="password" type="password" placeholder={t.password.placeholder} label={t.password.label} error={errors.password?.message}
                    {...register("password")} />
                </Col>
                <Col>
                  <Input id="passwordRepeat" type="password" placeholder={t.passwordRepeat.placeholder} label={t.passwordRepeat.label} error={errors.passwordRepeat?.message}
                    {...register("passwordRepeat")} />
                </Col>
              </>}

              <Col>
                <InputTextarea label={t.about.label} id="about" error={errors.about?.message}
                  {...register("about")} />
              </Col>
              <Col className="flex flex-row justify-end items-end">
                <Button type="submit" className="max-w-xs text-white bg-primary hover:bg-primary hover:brightness-110">
                  {t.submit}
                </Button>
              </Col>
            </Row>
          </form>
        </Col>
        <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-4']} isBorderActive className="h-fit">
          <div className="flex flex-col justify-center w-full items-center p-4 gap-4">
            <div className="avatar ml-4" tabIndex={6}>
              <div className="w-32 mask mask-circle">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="avatar" width={128} height={128} />
                ) : (
                  <Image src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="avatar" width={128} height={128} />
                )}
              </div>
            </div>
            {accessControl?.value && (
              <span className="badge badge-info flex flex-row gap-4 text-lg justify-center p-4">
                {accessControl.label}  <PiLock className="w-6 h-6" />
              </span>
            )}
            {dateOfBirth && <span className="badge badge-neutral p-4 flex flex-row gap-4 text-lg justify-center">
              {dateOfBirth}  <LuPartyPopper className="w-6 h-6 text-purple-500" />
            </span>}
            <p className="font-semibold text-center w-full break-words whitespace-normal max-h-60 overflow-y-auto">
              {about}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
