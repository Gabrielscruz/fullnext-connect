'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col } from "@/components/Grid/Col";
import { Container } from "@/components/Grid/Container";
import { Row } from "@/components/Grid/Row";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { api } from "@/lib/api";
import { useAlert } from "@/context/alertContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "../translations";


export default function PowerBiCredentialForm() {
  const { language } = useLanguage();
  const t = translations[language];

  const router = useRouter()
  const { handleAlert } = useAlert();

  const powerBiCredentialSchema = z.object({
    name: z.string().nonempty({ message: t.errors.name}),
    clientId: z.string().nonempty({ message: t.errors.clientId }),
    clientSecret: z.string().nonempty({ message: t.errors.clientSecret }),
    tenantId: z.string().nonempty({ message: t.errors.tenantId }),
  });
  type powerBiCredentialFormData = z.infer<typeof powerBiCredentialSchema>;

  const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm<powerBiCredentialFormData>({
    resolver: zodResolver(powerBiCredentialSchema),
  });

  const name = watch('name')
  const clientId = watch('clientId');
  const clientSecret = watch('clientSecret');
  const tenantId = watch('tenantId');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await api.post('/powerbi/credential', data);
      if (response.status === 200) {
        handleAlert('alert-success', t.alerts.successMessage);
        router.push('/credential');
      } else {
        handleAlert('alert-error', t.alerts.failureMessage);
      }
    } catch (error) {
      handleAlert('alert-error', t.alerts.unexpectedError);
    }
  });


  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Row isBorderActive>
          <Col classNameColSpan={['col-span-12']}>
            <Input
              id="Name"
              type="text"
              placeholder={t.input.name.placeholder}
              label={t.input.name.label}
              value={name}
              error={errors.name?.message}
              {...register("name")}
            />
          </Col>
          <Col classNameColSpan={['col-span-12']}>
            <Input
              id="ClientId"
              type="text"
              placeholder={t.input.clientId.placeholder}
              label={t.input.clientId.label}
              value={clientId}
              error={errors.clientId?.message}
              {...register("clientId")}
            />
          </Col>
          <Col classNameColSpan={['col-span-12', 'md:col-span-12']}>
            <Input
              id="clientSecret"
              type="text"
              placeholder={t.input.clientSecret.placeholder}
              label={t.input.clientSecret.label}
              value={clientSecret}
              error={errors.clientSecret?.message}
              {...register("clientSecret")}
            />
          </Col>
          <Col classNameColSpan={['col-span-12', 'md:col-span-12']}>
            <Input
              id="tenantId"
              type="text"
              placeholder={t.input.tenantId.placeholder}
              label={t.input.tenantId.label}
              value={tenantId}
              error={errors.tenantId?.message}
              {...register("tenantId")}
            />
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