'use client'
import { Container } from "@/components/Grid/Container";
import { Row } from "@/components/Grid/Row";
import { Col } from "@/components/Grid/Col"
import { DataTable } from "./components/DataTable";
import { PiPlus } from "react-icons/pi";
import Link from "next/link";
import { Filter } from "@/components/Filter/Filter";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "./translations";

export default function user() {
  const { language } = useLanguage();
  const t = translations[language]

  return (
    <Container>
      <Filter menuLinkId={1} />
      <div className="flex flex-row w-full justify-end">
        <Link className="btn bg-primary hover:bg-primary hover:brightness-110 btn-wide text-white" href={"/user/create"}>
          <PiPlus /> {t.buttonAdd.name}
        </Link>
      </div>
      <Row>
        <Col>
          <DataTable />
        </Col>
      </Row>
    </Container>
  );
}
