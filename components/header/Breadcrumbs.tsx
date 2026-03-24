import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cx } from "class-variance-authority";
import { Fragment } from "react";

export default function Breadcrumbs({
  crumbs,
  mobile,
}: {
  crumbs: Array<{ name: string; href: string }>;
  mobile?: boolean;
}) {
  return (
    <Breadcrumb
      className={cx(
        mobile ? "mb-3 md:hidden" : "mb-3 hidden md:block lg:mb-2",
        "",
      )}
    >
      <BreadcrumbList className="justify-start">
        {crumbs.map((crumb, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
