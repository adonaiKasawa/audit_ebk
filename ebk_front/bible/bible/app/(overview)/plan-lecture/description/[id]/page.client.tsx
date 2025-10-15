"use client";

import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiChevronRight, FiArrowLeft } from "react-icons/fi";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import Link from "next/link";
import { Image } from "@heroui/image";

import { userStartedPlan } from "@/app/lib/actions/plan-lecture/plan_lecture.req";
import {
  ContentDayPlan,
  ItemBiblePlanLecture,
} from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import Alert from "@/ui/modal/alert";

export default function DescriptionPlanByIdPage({
  params,
  initData,
  session,
}: {
  params: { id: string };
  initData: {
    plan: ItemBiblePlanLecture;
    contentDays: ContentDayPlan[];
  };
  session: Session | null;
}) {
  const { id } = params;
  const { plan, contentDays } = initData;
  // const pathname = usePathname();
  const router = useRouter();

  // const [daySelect, setDaySelect] = useState(1);
  // const [openModal, setOpenModal] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);

  const handlUserStartedPlan = async () => {
    setLoading(true);
    const started = await userStartedPlan(parseInt(id));

    setLoading(false);
    if (
      started.hasOwnProperty("statusCode") &&
      started.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof started.message === "object") {
        let message = "";

        started.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      } else {
        setAlertMsg(started.message);
      }
    } else {
      router.push(`/plan-lecture/${id}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <button
          className="flex items-center mb-4"
          onClick={() => {
            router.back();
          }}
        >
          <FiArrowLeft size={24} />
          <p className="text-sm text-gray-500">Mes plans</p>
        </button>
        <h1 className="text-2xl font-bold">{plan.title}</h1>
        <p className="text-gray-500 mb-4">Jour 1 sur {contentDays.length}</p>
        <Card>
          <Image
            alt="Plan image"
            height={140}
            src={`${
              plan.picture ? file_url + plan.picture : `./ecclessia.png`
            }`}
            width="100%"
          />
        </Card>
        <div
          className="flex flex-col md:flex-row lg:flex-row sm:flex-col justify-between bg-default-100 my-4 rounded-md shadow-md p-8"
          style={{ marginLeft: 70, marginRight: 70 }}
        >
          <div>
            <p className="text-center font-bold text-2xl">
              {plan.number_days} <br /> Jours
            </p>
          </div>
          {session && session.user ? (
            <Button size="lg" onClick={handlUserStartedPlan}>
              Commencer la lecture de ce plan
              <FiChevronRight size={24} />
            </Button>
          ) : (
            <Button
              as={Link}
              href={`/api/auth/signin?redirect=plan-lecture/description/${id}`}
              size="lg"
            >
              Se connecter
            </Button>
          )}
        </div>
        <p className="text-bold text-xl p-12">{plan.description}</p>
      </div>
      <Alert
        alertBody={<p>{alertMsg}</p>}
        alertTitle={alertTitle}
        isOpen={openAlert}
        onClose={() => {
          setOpenAlert(false);
        }}
        onOpen={() => {
          setOpenAlert(true);
        }}
      />
    </div>
  );
}
