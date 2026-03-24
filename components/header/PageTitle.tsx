import { cx } from "class-variance-authority";
import { type ReactNode } from "react";
import { Hamburger } from "./Hamburger";
import { PageTitleContent } from "./PageTitleContent";

export function PageTitle({
  breadcrumbs = [],
  title,
  children: RightContent,
}: {
  breadcrumbs?: Array<{
    name: string;
    href: string;
  }>;
  title: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div
        className={cx(
          "sticky top-0 flex items-center gap-6 border-b px-6 py-4 text-primary backdrop-blur supports-[backdrop-filter]:bg-background/80",
          { "md:py-6": breadcrumbs.length === 0 },
        )}
      >
        <Hamburger />

        <PageTitleContent breadcrumbs={breadcrumbs} title={title}>
          {RightContent}
        </PageTitleContent>
      </div>

      <PageTitleContent breadcrumbs={breadcrumbs} title={title} mobile>
        {RightContent}
      </PageTitleContent>
    </>
  );
}
