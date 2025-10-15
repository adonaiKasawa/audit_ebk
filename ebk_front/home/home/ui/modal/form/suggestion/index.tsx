"use client";

import { useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import {Tooltip} from "@heroui/tooltip";

import { Image } from "@heroui/image";
import { useSession } from "next-auth/react";

import Alert from "../../alert";

import { createSuggestionApi, findSuggestionsByUser } from "@/app/lib/actions/suggestion/suggestion.req";



export function CreateSuggestionFormModal({
  handelCaptureScreenShot,
  openModal,
  setOpenModal,
  image,
}: {
  handelCaptureScreenShot: () => void;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  image: any;
}) {
  const [suggestion, setSuggestion] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);

  const { data: session } = useSession();
  const userId = session?.user?.sub;

  const loadUserSuggestions = async () => {
    try {
      const suggestions = await findSuggestionsByUser();

      setUserSuggestions(suggestions); // state local
    } catch (error) {
      console.error("Erreur lors du chargement des suggestions", error);
    }
  };

  const handleSubmit = async () => {
    if (suggestion) {
      setLoading(true);
      const create = await createSuggestionApi(suggestion);
      const response = await loadUserSuggestions();

      console.log("reponse de getSuggestion of user", response);

      setLoading(false);
      if (
        !create.hasOwnProperty("statusCode") &&
        !create.hasOwnProperty("message")
      ) {
        setOpenAlert(true);
        setAlertMsg(
          "Merci d'avoir partagé tes suggestions et tes commentaires ! Nous apprécions ton aide pour que EcclesiaBooK reste sûr et amusant.",
        );
      } else {
        setAlertMsg("Une erreur se produite lors de la création du prière.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  return (
    <>
      <Tooltip
        content={
          <p>
            Pouvez-vous nous aider à améliorer <br /> l’expérience utilisateur ?
          </p>
        }
      >
        <Button
          isIconOnly
          radius="full"
          size="lg"
          onClick={handelCaptureScreenShot}
        >
          <BiSolidMessageRounded size={30} />
        </Button>
      </Tooltip>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        size="lg"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-xl font-extrabold tracking-tight">
                Avis & Suggestions
              </ModalHeader>
              <ModalBody>
                <div className="relative">
                  <div className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
                    <p className="mb-2">
                      Vos avis, remarques, suggestions et idées,… nous sont
                      extrêmement précieux.
                    </p>
                    <Textarea
                      className="my-8"
                      label="Votre suggestion"
                      placeholder="Votre suggestion"
                      value={suggestion}
                      variant="bordered"
                      onChange={(e) => {
                        setSuggestion(e.target.value);
                      }}
                    />
                    <Image alt="ScreenShot" src={image} width={"100%"} />
                    <div className="flex justify-end">
                      <Button
                        className="text-white mt-4 "
                        color="primary"
                        isLoading={loading}
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Envoyer
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
        <Alert
          alertBody={
            <div>
              <p className="mb-4">{alertMsg}</p>
            </div>
          }
          alertTitle={"Message"}
          isOpen={openAlert}
          onClose={() => {
            setOpenAlert(false);
          }}
          onOpen={() => {
            setOpenAlert(true);
          }}
        />
      </Modal>
    </>
  );
}
