"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { useScreenshot } from "use-react-screenshot";

import { CreateSuggestionFormModal } from "@/ui/modal/form/suggestion";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  // const ref = React.createRef<any>();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  // const [image, takeScreenShot] = useScreenshot({
  //   type: "image/jpeg",
  //   quality: 1.0,
  // });

  const handelCaptureScreenShot = () => {
    // takeScreenShot(ref.current).then(() => {
    setOpenModal(true);
    // });
  };

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {children}
        <div className="fixed bottom-12 right-8">
          <CreateSuggestionFormModal
            handelCaptureScreenShot={handelCaptureScreenShot}
            image={"image"}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}