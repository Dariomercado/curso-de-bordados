import type { ReactNode } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type AuthEmailLayoutProps = {
  previewText: string;
  title: string;
  intro: string;
  ctaLabel: string;
  ctaUrl: string;
  children: ReactNode;
  footerNote?: string;
};

export function AuthEmailLayout({
  previewText,
  title,
  intro,
  ctaLabel,
  ctaUrl,
  children,
  footerNote = "Si no solicitaste este mensaje, puedes ignorarlo con tranquilidad.",
}: AuthEmailLayoutProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={card}>
            <Text style={eyebrow}>Atelier de Bordado</Text>
            <Heading as="h1" style={heading}>
              {title}
            </Heading>
            <Text style={paragraph}>{intro}</Text>

            <Section style={contentSection}>{children}</Section>

            <Section style={buttonSection}>
              <Button href={ctaUrl} style={button}>
                {ctaLabel}
              </Button>
            </Section>

            <Text style={secondaryText}>
              Si el boton no funciona, copia y pega este enlace en tu navegador:
            </Text>
            <Text style={linkText}>{ctaUrl}</Text>

            <Hr style={divider} />

            <Text style={footerText}>{footerNote}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f7f1ea",
  color: "#342b25",
  fontFamily: "Manrope, Arial, sans-serif",
  margin: 0,
  padding: "24px 12px",
};

const container = {
  margin: "0 auto",
  maxWidth: "640px",
  width: "100%",
};

const card = {
  backgroundColor: "#fffaf4",
  border: "1px solid rgba(136, 106, 80, 0.18)",
  borderRadius: "24px",
  padding: "32px",
};

const eyebrow = {
  color: "#8e5c55",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "0.12em",
  margin: "0 0 16px",
  textTransform: "uppercase" as const,
};

const heading = {
  color: "#342b25",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "34px",
  fontWeight: "600",
  lineHeight: "1.2",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#6f6258",
  fontSize: "16px",
  lineHeight: "1.8",
  margin: "0 0 12px",
};

const contentSection = {
  margin: "20px 0 0",
};

const buttonSection = {
  margin: "28px 0 24px",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#8e5c55",
  borderRadius: "999px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "700",
  padding: "14px 24px",
  textDecoration: "none",
};

const secondaryText = {
  color: "#6f6258",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 8px",
};

const linkText = {
  color: "#8e5c55",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: 0,
  wordBreak: "break-all" as const,
};

const divider = {
  borderColor: "rgba(136, 106, 80, 0.18)",
  margin: "28px 0 24px",
};

const footerText = {
  color: "#6f6258",
  fontSize: "13px",
  lineHeight: "1.7",
  margin: 0,
};
