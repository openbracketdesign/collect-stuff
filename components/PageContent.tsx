import { cx } from "class-variance-authority";
import type { ReactNode } from "react";

export default function PageContent({
  children,
  sidePanel,
}: {
  children: ReactNode;
  sidePanel?: boolean;
}) {
  return (
    <div
      className={cx("grow p-6", {
        "xl:grid py-0 xl:grid-cols-[1fr_340px] xl:gap-8": sidePanel,
      })}
    >
      {children}
    </div>
  );
}
