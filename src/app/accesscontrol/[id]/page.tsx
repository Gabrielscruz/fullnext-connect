'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PiSealCheck, PiXLight } from 'react-icons/pi';

import { useAlert } from '@/context/alertContext';
import { Col } from '@/components/Grid/Col';
import { Container } from '@/components/Grid/Container';
import { Row } from '@/components/Grid/Row';
import { Input } from '@/components/Input/Input';
import { InputCheckbox } from '@/components/Input/InputCheckbox';
import { Button } from '@/components/Button/Button';

import { accessLinkProps } from '../interface';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '../translations';

const accessControlSchema = z.object({
  name: z.string().nonempty({ message: 'category is required' }),
});

type accessControlFormData = z.infer<typeof accessControlSchema>;

export default function Update({ params }: any) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [links, setLinks] = useState<any[]>([]);
  const { handleAlert } = useAlert();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<accessControlFormData>({
    resolver: zodResolver(accessControlSchema),
  });

  const name = watch('name');

  const fetchData = async () => {
    try {
      const { status, data } = await api.get('/access/control/links');
      const itens = data.map((link: accessLinkProps) => {
        return { ...link, menuLinkId: link.id, checked: false };
      });
      return itens
    } catch (error: any) {
      handleAlert('alert-error', error.message || 'Erro desconhecido');
      return []
    }
  };

  const selectAll = (checked: boolean) => {
    const checkedAll = links.map((link) => {
      return { ...link, checked };
    });
    setLinks(checkedAll);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = {
        ...data,
        links: links.filter((link) => link.checked === true).map((link) => {
          return {
            menuLinkId: link.id
          }
        })
      }
      const response = await api.put(`accesscontrol/${params.id}`, formData);
      if (response.status === 201) {
        router.push('/accesscontrol');
        handleAlert('alert-success', response.data.message);
      } else {
        handleAlert('alert-error', response.data.message);
      }
    } catch (error) {
      handleAlert('alert-error', 'An unexpected error occurred');
    }
  });


  const getAccessControl = useCallback(async (id: number) => {
    try {
      const { status, data } = await api.get(`accesscontrol/${id}`)
      if (status === 200) {
        setValue('name', data.accessControl.name);
        const Alllinks = await fetchData()
        const itens = Alllinks.map((link: any) => {
          return { ...link, checked: data.accessControl.accessLinks.some((accessLink: any) => accessLink.menuLinkId === link.menuLinkId) };
        });
        setLinks(itens);
      }
    } catch (error) {
      // handle error
    }
  }, [setValue]);

  useEffect(() => {
    if (params?.id) getAccessControl(params.id);
  }, [params?.id, getAccessControl]);

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Row isBorderActive>
          <Col>
            <Input
              id="name"
              type="text"
              placeholder={t.enter_access_control}
              label={t.access_control}
              value={name}
              error={errors.name?.message}
              {...register('name')}
            />
          </Col>
          <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-6']}>
            <Button type="button" className="bg-blue-500 hover:bg-blue-700 w-20 text-white" onClick={() => selectAll(true)}>
              <PiSealCheck />  {t.select_all}
            </Button>
          </Col>
          <Col classNameColSpan={['col-span-12', 'md:col-span-6', 'lg:col-span-6']}>
            <Button type="button" className="bg-red-500 hover:bg-red-700 w-20 text-white" onClick={() => selectAll(false)}>
              <PiXLight /> {t.deselect_all}
            </Button>
          </Col>
          <Col className="flex flex-col gap-2 overflow-auto h-80 p-6" isBorderActive>
            {links.map((link) => (
              <InputCheckbox
                key={link.id}
                id={String(link.menuLinkId)}
                defaultIcon={link.defaultIcon}
                label={link.label}
                name={link.label}
                checked={link.checked}
                onChange={(event) => {
                  const index = links.findIndex((linkItem) => linkItem.menuLinkId === link.id);
                  if (index !== -1) {
                    const linksCurrent = [...links];
                    linksCurrent[index].checked = event.target.checked;
                    setLinks(linksCurrent);
                  }
                }}
              />
            ))}
          </Col>
          <Col className="flex flex-row justify-end items-end">
            <Button type="submit" className="max-w-xs text-white btn bg-primary hover:bg-primary hover:brightness-110">
              {t.submit}
            </Button>
          </Col>
        </Row>
      </form>
    </Container>
  );
}
