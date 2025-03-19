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
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";



export default function LinksForm() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter()
  const { handleAlert } = useAlert();

  const linkSchema = z.object({
    title: z.string().nonempty({ message: t.error.title }),
    defaultIcon: z.string().nonempty({ message: t.error.defaultIcon }),
    activeIcon: z.string().nonempty({ message: t.error.activeIcon }),
  });
  type LinkFormData = z.infer<typeof linkSchema>;

  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
  });

  const title = watch('title');
  const defaultIcon = watch('defaultIcon');
  const activeIcon = watch('activeIcon');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await api.post('/module', data);
      if (response.status === 200) {
        handleAlert('alert-success', response.data.message);
        router.push('/module');
      } else {
        handleAlert('alert-error', 'Failed to create link');
      }
    } catch (error) {
      handleAlert('alert-error', 'An unexpected error occurred');
    }
  });


  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Row isBorderActive>
          <Col classNameColSpan={['col-span-12']}>
            <Input
              id="module"
              type="text"
              placeholder={t.input.module.placeholder}
              label={t.input.module.label}
              value={title}
              error={errors.title?.message}
              {...register("title")}
            />
          </Col>
          <Col classNameColSpan={['col-span-12', 'md:col-span-6']}>
            <InputSelectIcon
              id="defaultIcon"
              label={t.input.defaultIcon.label}
              value={defaultIcon}
              onChange={(option) => setValue('defaultIcon', option.label)}
              placeholder={t.input.defaultIcon.placeholder}
            />
          </Col>
          <Col classNameColSpan={['col-span-12', 'md:col-span-6']}>
            <InputSelectIcon
              id="activeIcon"
              label={t.input.activeIcon.label}
              value={activeIcon}
              onChange={(option) => setValue('activeIcon', option.label)}
              placeholder={t.input.activeIcon.placeholder}
            />
          </Col>
          <Col className="flex flex-row justify-end items-end">
            <Button type="submit" className="max-w-xs text-white bg-primary hover:bg-primary hover:brightness-110">
              {t.submit}
            </Button>
          </Col>
        </Row>
      </form>
    </Container>
  );
}