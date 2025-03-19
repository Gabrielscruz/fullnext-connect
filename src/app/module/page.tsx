'use client'
import { Col } from "@/components/Grid/Col";
import { Container } from "@/components/Grid/Container";
import { Row } from "@/components/Grid/Row";
import { PiPlus } from "react-icons/pi";
import { DataTable } from "./components/DataTable";
import Link from "next/link";
import { Filter } from "@/components/Filter/Filter";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "./translations";

export default function LinkPowerBi() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <Container>
      <Filter menuLinkId={5} />
      <div className="flex flex-row w-full justify-end">
        <Link className="btn bg-primary hover:bg-primary hover:brightness-110 btn-wide text-white" href={"/module/create"}>
          <PiPlus /> {t.buttonAdd.name}
        </Link>
      </div>
      <Row>
        <Col>
          <DataTable />
        </Col>
      </Row>
    </Container>
  )
}