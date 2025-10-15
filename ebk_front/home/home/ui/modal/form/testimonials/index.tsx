"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Textarea } from "@heroui/input";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

import { createTestmonial } from "@/app/lib/actions/testmonial/testmonial.req";
import { TestimonialStatusEnum } from "@/app/lib/config/enum";

type Props = {
  id_eglise: number;
  handleFindTesTmonials: () => Promise<void>;
  setSelectedTab: (tab: string) => void; // <- la prop pour changer l'onglet
};

export default function AddTestmonialsFormModal({
  id_eglise,
  handleFindTesTmonials,
  setSelectedTab, // <- il faut la destructurer ici
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!video) {
      toast.warning("Veuillez sélectionner une vidéo.");

      return;
    }

    if (!description.trim()) {
      toast.warning("Veuillez ajouter une description.");

      return;
    }

    setLoading(true);

    try {
      const result = await createTestmonial(
        {
          description,
          status: TestimonialStatusEnum.ACTIVE,
        },
        video,
      );

      // 🔹 Changer automatiquement l'onglet "Approuver"
      setSelectedTab("approved");

      toast.success("Témoignage soumis avec succès !");
      console.log("result: ", result);

      setOpenModal(false);
      setDescription("");
      setVideo(null);
      await handleFindTesTmonials();
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors de l'envoi du témoignage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        id="btn-open-modal-testmonial"
        size="sm"
        startContent={<Camera size={18} />}
        variant="flat"
        onPress={() => setOpenModal(true)}
      >
        Ajouter une vidéo
      </Button>

      <Modal isOpen={openModal} size="lg" onOpenChange={setOpenModal}>
        <ModalContent>
          <ModalHeader>Soumettre un témoignage vidéo</ModalHeader>
          <ModalBody className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
            <input accept="video/*" type="file" onChange={handleVideoChange} />
            <Textarea
              label="Description"
              placeholder="Décris brièvement ton témoignage..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {video && (
              <video
                controls
                className="rounded-lg w-full h-48 object-cover mt-4"
                src={URL.createObjectURL(video)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={loading}
              variant="light"
              onPress={() => setOpenModal(false)}
            >
              Annuler
            </Button>
            <Button
              className="text-white"
              color="primary"
              isLoading={loading}
              onPress={handleSubmit}
            >
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
