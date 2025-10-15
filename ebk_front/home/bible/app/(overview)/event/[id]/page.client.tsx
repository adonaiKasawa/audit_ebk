"use client";

import moment from "moment";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import Link from "next/link";
import { Image } from "@heroui/image";

import { ManagementEvent } from "@/app/lib/config/interface";
import { file_url, front_url } from "@/app/lib/request/request";

export default function EventByIdPageClient({
  initData,
  session,
}: {
  initData: ManagementEvent;
  session: Session | null;
}) {
  const user = session ? session.user : null;
  const router = useRouter();
  // const MerchantID = "47fb1c1fcf734ae99c3c41cb902e8604"
  // const MerchantPassword = "12b3ad17b499462292d064ef310ee178"
  // const url_back = "https://ecclesiabook.org/event/subcribe";
  // const gatWay = "https://api.maxicashapp.com/PayEntryPost" // Live

  {
    /* https://api.maxicashme.com/PayEntryPost Test */
  }
  const MerchantID = "81a1c6e9175943d19a72250354871790";
  const MerchantPassword = "d8938074afca416398e5daca220e57d1";
  const url_back = `${front_url}event/subcribe/${initData.id}/`;
  const gatWay = "https://api-testbed.maxicashapp.com/PayEntryPost"; //Test

  return (
    <div>
      <Modal
        backdrop={"opaque"}
        isOpen={true}
        onClose={() => {
          router.push("/event");
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Résever</ModalHeader>
              <ModalBody>
                <div className="flex flex-col">
                  <p className="text-xl">
                    Voulez vous vraiment réservés pour cet événement
                  </p>
                  <p className="text-ellipsis line-clamp-1">{initData.name}</p>
                  <p className="text-default-500 text-ellipsis text-sm">
                    {initData.adressMap}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Image
                      alt="church_icon"
                      className="rounded-full"
                      height={20}
                      src={`${file_url}${initData.eglise.photo_eglise}`}
                      width={20}
                    />
                    <Link
                      className="text-sm text-default-500"
                      href={`@${initData.eglise.username_eglise}`}
                    >
                      {initData.eglise.nom_eglise}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-default-500 text-sm">
                      {initData.totalPerson} prs
                    </p>
                    <p className="text-default-500 text-sm">
                      {initData.isFree && "Gratuit"}
                    </p>
                    <p className="text-default-500 text-sm">
                      {!initData.isFree && initData.price + "USD"}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                {user ? (
                  <div>
                    <form action={gatWay} method="post">
                      <input name="PayType" type="hidden" value="MaxiCash" />
                      <input
                        name="Amount"
                        type="hidden"
                        value={initData.price + "00"}
                      />
                      <input name="Currency" type="hidden" value="USD" />
                      <input
                        name="Telephone"
                        type="hidden"
                        value={user.telephone}
                      />
                      <input name="Email" type="hidden" value={user.email} />
                      <input
                        name="MerchantID"
                        type="hidden"
                        value={MerchantID}
                      />
                      <input
                        name="MerchantPassword"
                        type="hidden"
                        value={MerchantPassword}
                      />
                      <input name="Language" type="hidden" value="fr" />
                      <input
                        name="Reference"
                        type="hidden"
                        value={moment().unix()}
                      />
                      <input name="notifyurl" type="hidden" value={url_back} />
                      <input name="accepturl" type="hidden" value={url_back} />
                      <input name="cancelurl" type="hidden" value={url_back} />
                      <input name="declineurl" type="hidden" value={url_back} />
                      <Button
                        className="text-white"
                        color="primary"
                        type="submit"
                      >
                        Je veux résever mon billet
                      </Button>
                    </form>
                  </div>
                ) : (
                  <Button as={Link} href="/api/auth/signin" variant="bordered">
                    Se connecter
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
