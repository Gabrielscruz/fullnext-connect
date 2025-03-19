'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col } from "@/components/Grid/Col";
import { Container } from "@/components/Grid/Container";
import { Row } from "@/components/Grid/Row";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { useCallback, useEffect, useState } from "react";
import { InputSelectIcon } from "@/components/Input/InputSelectIcon";
import { api } from "@/lib/api";
import { useAlert } from "@/context/alertContext";
import { ButtonLink } from "@/components/Sidebar/Sidebar/ButtonLink";
import { InputSelect } from "@/components/Input/InputSelect";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";
const PowerShowCase = dynamic(() => import('../components/PowerShowCase'), { ssr: false });


export default function Update({ params }: any) {
  const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language];

    
  const [isExpanded, setIsExpanded] = useState(false);
  const [optionsCredential, setOptionsCredential] = useState<any[]>([]);
  const [optionsModules, setOptionsModules] = useState<any[]>([]);
  const [powerBiCredential, setPowerBiCredential] = useState<any>(null);
  const { handleAlert } = useAlert();


  const linkSchema = z.object({
    label: z.string().nonempty({ message: t.errors.labelRequired }),
    href: z.string().nonempty({ message: t.errors.hrefRequired }),
    defaultIcon: z.string().nonempty({ message: t.errors.defaultIconRequired }),
    activeIcon: z.string().nonempty({ message: t.errors.activeIconRequired }),
    selectedType: z.object({
      value: z.number(),
      label: z.string(),
    }),
    selectedModule: z.object({
      value: z.number(),
      label: z.string(),
    }),
    selectedCredential: z.object({
      value: z.number(),
      label: z.string(),
    }),
  });
  type LinkFormData = z.infer<typeof linkSchema>;

  
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
  });

  const label = watch("label");
  const href = watch("href");
  const defaultIcon = watch("defaultIcon");
  const activeIcon = watch("activeIcon");
  const selectedModule:any = watch("selectedModule");
  const selectedCredential: any = watch('selectedCredential');
  const selectedType: any = watch('selectedType');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await api.put(`menu/links/${params.id}`, data);
      if (response.status === 201) {
        handleAlert("alert-success", t.alerts.successMessageUpdated);
        router.push("/link");
      } else {
        handleAlert("alert-error", t.alerts.failureMessage);
      }
    } catch (error) {
      handleAlert("alert-error", t.alerts.unexpectedError);
    }
  });

  const fetchModuleOptions = useCallback(async () => {
    try {
      const { data, status } = await api.get("/menu/module");
      if (status === 200) {
        const ModuleOptions = data.map((option: any) => {
          return { value: option.id, label: option.title };
        });
        setOptionsModules(ModuleOptions);
      }
    } catch (error: any) {
      handleAlert("alert-error", error?.message);
    }
  }, [handleAlert]);

  const fetchCredentialOptions = useCallback(async () => {
    try {
      const { data, status } = await api.get("/powerbi/all/credential");
      if (status === 200) {
        const CredentialOptions = data.map((option: any) => {
          return { value: option.id, label: option.name };
        });
        setOptionsCredential(CredentialOptions);
      }
    } catch (error: any) {
      handleAlert("alert-error", error?.message);
    }
  }, [handleAlert]);

  const getMenuLink = useCallback(
    async (id: number) => {
      try {
        const { status, data } = await api.get(`/menu/link/${id}`);
        if (status === 200) {
          const { label, href, defaultIcon, activeIcon, module, powerBiCredential, menuLinkType } = data.link;
          setValue("label", label);
          setValue("href", href);
          setValue("defaultIcon", defaultIcon);
          setValue("activeIcon", activeIcon);
          setValue("selectedModule", { value: module.id, label: module.title });
          setValue("selectedCredential", { value: powerBiCredential.id, label: powerBiCredential.name })
          setValue("selectedType", { value: menuLinkType.id, label: menuLinkType.name})
        }
      } catch (error) {
        // handle error
      }
    },
    [setValue]
  );
  
  const getPowerBiCredential = async (powerBiCredentialId: number, href: string) => {
    try {
      const { data, status } = await api.post(`/report/showcase/${powerBiCredentialId}`, {
        href
      });
      if (status === 200) {
        setPowerBiCredential(data)
      }
    } catch (error: any) {
      setPowerBiCredential(undefined)
      handleAlert("alert-error", error?.message);
    }
  }

  useEffect(() => {
    fetchModuleOptions();
    fetchCredentialOptions();
    if (params?.id) getMenuLink(params?.id);
  }, [params?.id]);

  useEffect(() => {
    if (href && selectedCredential) getPowerBiCredential(selectedCredential.value, href)
  }, [href, selectedCredential])

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Row isBorderActive>
          <Col classNameColSpan={["col-span-8"]}>
          <Input
              id="label"
              type="text"
              placeholder={t.placeholders.label}
              label={t.labels.label}
              error={errors.label?.message}
              {...register("label")}
            />
          </Col>
          <Col classNameColSpan={["col-span-4"]}>
          <InputSelect
              id="type"
              label={t.labels.type}
              onChange={(option: any) => setValue("selectedType", option)}
              placeholder={t.placeholders.type}
              options={[{value: 2, label: 'Power bi'}, {value: 3, label: 'Tableau'}]}
              value={selectedType}
              error={errors.selectedType?.message}
            />
          </Col>
          <Col classNameColSpan={["col-span-12", "md:col-span-6", "lg:col-span-6"]}>
          <Input
              id="href"
              type="text"
              placeholder={t.placeholders.href}
              label={t.labels.href}
              error={errors.href?.message}
              {...register("href")}
            />
          </Col>
          <Col classNameColSpan={["col-span-12", "md:col-span-4", "lg:col-span-4"]}>
          <InputSelect
              id="selectedCredential"
              label={t.labels.credential}
              onChange={(option: any) => setValue("selectedCredential", option)}
              placeholder={t.placeholders.credential}
              options={optionsCredential}
              value={selectedCredential}
              error={errors.selectedCredential?.message}
            />
          </Col>
          <Col classNameColSpan={["col-span-12", "md:col-span-4", "lg:col-span-2"]}>
          <InputSelect
              id="selectedModule"
              label={t.labels.module}
              onChange={(option: any) => setValue("selectedModule", option)}
              placeholder={t.placeholders.module}
              options={optionsModules}
              value={selectedModule}
              error={errors.selectedModule?.message}
            />
          </Col>
          <Col classNameColSpan={["col-span-12", "md:col-span-6"]}>
          <InputSelectIcon
              id="defaultIcon"
              label={t.labels.defaultIcon}
              value={defaultIcon}
              onChange={(option) => setValue("defaultIcon", option.label)}
              placeholder={t.placeholders.defaultIcon}
            />
          </Col>
          <Col classNameColSpan={["col-span-12", "md:col-span-6"]}>
          <InputSelectIcon
              id="activeIcon"
              label={t.labels.activeIcon}
              value={activeIcon}
              onChange={(option) => setValue("activeIcon", option.label)}
              placeholder={t.placeholders.activeIcon}
            />
          </Col>
          <Col classNameColSpan={["col-span-12", "md:col-span-2"]}>
            <div className="h-40 p-4 mb-4">
              <div className="form-control max-w-32">
                <label className="label cursor-pointer">
                <span className="label-text">{t.labels.expand}</span>
                  <input
                    type="checkbox"
                    checked={isExpanded}
                    className="checkbox"
                    onChange={() => setIsExpanded(!isExpanded)}
                  />
                </label>
              </div>
              <div className="flex flex-col gap-4 z-10">
                <ButtonLink
                  label={label}
                  href={href}
                  defaultIcon={defaultIcon}
                  disabled
                  activeIcon={activeIcon}
                  isExpanded={isExpanded}
                  tabIndex={1}
                  id={1}
                  type={1}
                />
                <ButtonLink
                  isActiveIcon
                  label={label}
                  href={href}
                  defaultIcon={defaultIcon}
                  activeIcon={activeIcon}
                  isExpanded={isExpanded}
                  disabled
                  tabIndex={1}
                  id={1}
                  type={1}
                />
              </div>
            </div>
          </Col>
          <Col classNameColSpan={["col-span-12", "md:col-span-10"]} isBorderActive>
            {(powerBiCredential?.id === undefined || href === undefined) ? (
              <div className="h-[500px] w-full rounded-lg bg-primary flex justify-center items-center">
                <h2 className="text-3xl font-extralight">{t.errors.invalidCredentialOrHref}</h2>
                </div>
            ) : (
              <PowerShowCase powerBiCredential={powerBiCredential} />
            )}
           
          </Col>
          <Col className="flex flex-row justify-end items-end">
            <Button type="submit" className="max-w-xs text-white bg-primary hover:bg-primary hover:brightness-110">
            {t.buttons.submit}
            </Button>
          </Col>
        </Row>
      </form>
    </Container>
  );
}
