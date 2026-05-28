import type { ReactElement } from "react";
import { render } from "@react-email/render";

type RenderEmailTemplateInput = {
  template: ReactElement;
  text: string;
};

export async function renderEmailTemplate({
  template,
  text,
}: RenderEmailTemplateInput) {
  const html = await render(template);

  return {
    html,
    text,
  };
}
