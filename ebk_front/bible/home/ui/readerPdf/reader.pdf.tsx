"use client";

import { useCallback, useEffect, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { DocumentCallback, Source } from "react-pdf/dist/cjs/shared/types";
import { Session } from "next-auth";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";

import { FavoriSignaleUI } from "../favoriSignale/favoris.signale";
import { ShareFormModal } from "../modal/form/share";
import { CommentModalUI } from "../modal/form/comment";
import { LikeFileUI } from "../like/like.ui";

import { TypeContentEnum } from "@/app/lib/config/enum";
import { ItemVideos } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url,
// ).toString();

const options = {
  // url: 'd31uetu06bkcms.cloudfront.net',
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
  // data: 'Uint8Array'
};

const resizeObserverOptions = {};

type PDFFile = string | ArrayBuffer | Blob | Source | null;

export default function ReaderPDF({
  link,
  initData,
  session,
}: {
  link: string;
  initData: ItemVideos;
  session: Session | null;
}) {
  const [file, setFile] = useState<PDFFile>(link);
  const [TotalNumPages, setTotalNumPages] = useState<number>();
  const [numPages, setNumPages] = useState<number>(1);
  const [containerRef] = useState<HTMLElement | null>(null);
  // const [containerWidth, setContainerWidth] = useState<number>();

  const [loadFile, setLoadFile] = useState<boolean>(false);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      // setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  // function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
  //   const { files } = event.target;

  //   const nextFile = files?.[0];

  //   if (nextFile) {
  //     setFile(nextFile);
  //   }
  // }

  function onDocumentLoadSuccess(document: DocumentCallback): void {
    const { numPages } = document;

    setTotalNumPages(numPages);
  }

  const findFile = () => {
    fetch(`${file}`)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        setFile(blob);
        setLoadFile(true);
      })
      .catch(() => {
        setLoadFile(false);
      });
  };

  const onNavigateToNumpage = (numPages: string) => {
    if (TotalNumPages) {
      const parseNumPage = parseInt(numPages) ?? 0;

      if (parseNumPage !== 0 && parseNumPage <= TotalNumPages) {
        setNumPages(parseNumPage);
      }
    }
  };

  const onNavigateToNextPage = () => {
    if (TotalNumPages && numPages < 61) {
      setNumPages(numPages + 1);
    }
  };

  const onNavigateToPrevPage = () => {
    if (TotalNumPages && numPages > 1) {
      setNumPages(numPages + 1);
    }
  };

  useEffect(() => {
    findFile();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-default flex justify-between p-4 ">
        <div>
          <Avatar
            className="rounded-md"
            size="md"
            src={`${file_url}${initData.photo}`}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <IoIosArrowRoundBack size={50} onClick={onNavigateToPrevPage} />
          <Input
            style={{ width: 25 }}
            type="number"
            value={`${numPages}`}
            onChange={(e) => {
              onNavigateToNumpage(e.target.value);
            }}
          />
          <p className="text-center">{TotalNumPages}</p>
          <IoIosArrowRoundForward size={50} onClick={onNavigateToNextPage} />
        </div>
        <div className="md:flex items-center justify-center gap-4">
          <LikeFileUI
            fileType={TypeContentEnum.livres}
            idFile={initData.id}
            likes={initData.likes}
            session={session}
          />
          <CommentModalUI
            comments={initData.commentaire}
            idEglise={initData.eglise.id_eglise}
            idFile={initData.id}
            loadingComment={false}
            session={session}
            typeFile={TypeContentEnum.livres}
          />
          <ShareFormModal
            file={initData}
            session={session}
            typeContent={TypeContentEnum.livres}
          />
          <FavoriSignaleUI
            contentId={initData.id}
            initFavoris={initData.favoris}
            session={session}
            typeContent={TypeContentEnum.livres}
          />
        </div>
      </div>

      <ScrollShadow className="flex w-full h-screen flex-col w-full items-center bg-default-100 pb-12">
        {loadFile ? (
          <Document
            file={file}
            options={options}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(TotalNumPages), (_el, i) => (
              <Page key={i} className="shadow-lg mt-4 w-1/2" pageNumber={i} />
            ))}
          </Document>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-center text-2xl">Le telechargement à échoué!</p>
            <Button className="" onPress={findFile}>
              Recharge le livres
            </Button>
          </div>
        )}
      </ScrollShadow>
    </div>
  );
}
