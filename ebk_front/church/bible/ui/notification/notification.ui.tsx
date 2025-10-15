"use client";
import React, { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Link } from "@heroui/link";
import { Badge } from "@heroui/badge";
import { Avatar } from "@heroui/avatar";
import { Image } from "@heroui/image";

import { changeNotificationStatus } from "@/app/lib/actions/notification/notif.req";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { file_url } from "@/app/lib/request/request";
import { NotificationContent } from "@/app/lib/config/interface";

export const NotificationUI = ({
  numberNotification,
}: {
  numberNotification: number;
}) => {
  const route = useRouter();

  return (
    <>
      <Link
        href={`/notification`}
        onClick={() => {
          route.push("/notification");
        }}
      >
        {numberNotification > 0 ? (
          <Badge
            color="danger"
            content={numberNotification > 99 ? "99+" : numberNotification}
            size="md"
            style={{ marginRight: 5 }}
          >
            <BellIcon className="w-6 cursor-pointer text-foreground" />
          </Badge>
        ) : (
          <BellIcon className="w-6 cursor-pointer text-foreground" />
        )}
      </Link>
    </>
  );
};

const typeData = (dataType: TypeContentEnum) => {
  switch (dataType) {
    case "livres":
      return "book";
    case "audios":
      return "audios";
    case "videos":
      return "videos";
    case "forum":
      return "forum";
    case "images":
      return "pictures";
    default:
      return "";
  }
};

export const NotificationItem = ({
  content,
}: {
  content: NotificationContent;
}) => {
  const [img_eglise] = useState<string>(`${file_url}${content.img_eglise}`);

  return (
    <Link
      className="text-foreground w-full px-2 p-4 rounded-md hover:bg-default-100 "
      href={`/${typeData(content.type_content)}/${content.id_content}`}
    >
      <button
        className="w-full flex gap-4"
        onClick={async () => {
          if (!content.status)
            await changeNotificationStatus(content.notificationId);
        }}
      >
        <div className="flex">
          {!content.status && (
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "red" }}
            />
          )}
          <Avatar
            alt={content.title}
            fallback={<Image height={100} src="./ecclessia.png" width={100} />}
            size="lg"
            src={img_eglise}
            onError={() => {
              // setImgEglise('./ecclessia.png')
            }}
          />
        </div>
        <div className="flex w-full gap-4 justify-between">
          <div className="border-b border-default-200">
            <h3 className="font-bold">{content.title}</h3>
            <p>{content.body}</p>
            <p className="text-xs text-default-500 mt-2">
              {moment(content.createdAt).fromNow()}
            </p>
          </div>
          <div className="my-4">
            <Image
              alt={`${file_url}${content.img_content}`}
              className="object-cover rounded"
              src={`${file_url}${content.img_content}`}
              style={{
                width: 100,
                height: 70,
              }}
            />
          </div>
        </div>
      </button>
    </Link>
  );
};

// const notItem = () => {
//   return (
//     <Link href="#">
//       <div className="grid grid-cols-3 gap-4">
//         <div>
//           <Image
//             alt="kddksj"
//             className="object-cover rounded border-2 border-gray-500"
//             src={`https://i.pravatar.cc/150?u=a042581f4e29026704d`}
//             style={{
//               width: 150,
//               height: 75,
//             }}
//           />
//         </div>
//         <div className="col-span-2">
//           <p className="text-small text-foreground">
//             Full-stack developer, @getnextui lover she/her Full-stack developer,
//             @getnextui lover she/her Full-stack developer, @getnextui lover
//             she/her Full-stack developer, @getnextui lover she/her Full-stack
//             developer, @getnextßui lover she/her
//           </p>
//           <div className="flex items-center gap-1">
//             <Avatar
//               className="w-6 h-6 text-tiny"
//               src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
//             />
//             <p className="text-xs text-default-500">@lacompassion</p>
//           </div>

//           <p className="text-xs text-default-500">{moment().fromNow()}</p>
//         </div>
//       </div>
//     </Link>
//   );
// };
