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
import { InputSelect } from "@/components/Input/InputSelect";
import { Button } from "@/components/Button/Button";
import { api } from "@/lib/api";
import { useAlert } from "@/context/alertContext";
import { useRouter } from "next/navigation";
import { translations } from "../translations";
import { useLanguage } from "@/context/LanguageContext";
import { InputTextarea } from "@/components/Input/InputTextarea";

export default function Create() {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);
  const { handleAlert } = useAlert();
  const { language } = useLanguage(); // Obtendo o idioma atual
  const t = translations[language]


  const userSchema = z.object({
    name: z.string().nonempty({ message: t.InputName.message }),
    email: z.string().email({ message: t.email.message }),
    accessControl: z.object({
      value: z.number(),
      label: z.string(),
    }),
    dateOfBirth: z.string().min(10, { message: t.dateOfBirth.message }),
    password: z.string().min(6, { message: t.password.message }),
    passwordRepeat: z.string().min(6, { message: t.passwordRepeat.message }),
    about: z.string().optional(),
  }).refine((data) => data.password === data.passwordRepeat, {
    message: t.passwordRepeat.message,
    path: ["passwordRepeat"],
  });

  type UserFormData = z.infer<typeof userSchema>;

  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const dateOfBirth = watch('dateOfBirth');
  const about = watch('about');
  const accessControl: any = watch('accessControl');

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
        handleAlert('alert-error', t.fileUploadError);
      }
    }
  };

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await api.post('user', data);
      if (response.status === 200) {
        await uploadFile(avatarFile, response?.data?.user?.id);
        router.push('/user');
        handleAlert('alert-success', t.userCreated);
      } else {
        handleAlert('alert-error', t.userCreationFailed);
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

  useEffect(() => {
    fetchAccessControlOptions();
  }, [fetchAccessControlOptions]);



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
                <Input id="email" type="email" placeholder={t.email.placeholder} label={t.email.label} error={errors.email?.message}
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
                  options={options}
                  value={accessControl}
                  error={errors.accessControl?.message}
                />
              </Col>
              <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-8']}>
                <InputFile label={t.profile.label} onChange={handleFileChange} />
              </Col>
              <Col>
                <Input id="password" type="password" placeholder={t.password.placeholder} label={t.password.label} error={errors.password?.message}
                  {...register("password")} />
              </Col>
              <Col>
                <Input id="passwordRepeat" type="password" placeholder={t.passwordRepeat.placeholder} label={t.passwordRepeat.label} error={errors.passwordRepeat?.message}
                  {...register("passwordRepeat")} />
              </Col>
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
