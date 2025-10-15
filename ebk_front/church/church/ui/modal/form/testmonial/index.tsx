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
  setSelectedTab: (tab: string) => void;
};

export default function AddTestmonialsFormModal({
  id_eglise,
  handleFindTesTmonials,
  setSelectedTab,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedVideo = e.target.files[0];

      // 🔹 Vérifier la durée AVANT de l'accepter
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;

        if (duration > 180) {
          toast.error("La vidéo ne doit pas dépasser 3 minutes");
          setVideo(null);
          e.target.value = ""; // reset input
        } else {
          setVideo(selectedVideo);
        }
      };

      videoElement.src = URL.createObjectURL(selectedVideo);
    }
  };

  const handleSubmit = async () => {
    if (!video) {
      toast.warning("Veuillez sélectionner une vidéo.");
      return;
    }

    setLoading(true);

    try {
      const result = await createTestmonial(
        {
          description,
          status: TestimonialStatusEnum.ACTIVE,
        },
        video
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
        variant="flat"
        onPress={() => setOpenModal(true)}
        startContent={<Camera size={18} />}
      >
        Ajouter une vidéo
      </Button>

      <Modal isOpen={openModal} onOpenChange={setOpenModal} size="lg">
        <ModalContent>
          <ModalHeader>Soumettre un témoignage vidéo</ModalHeader>
          <ModalBody className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décris brièvement ton témoignage..."
            />
            {video && (
              <video
                className="rounded-lg w-full h-48 object-cover mt-4"
                controls
                src={URL.createObjectURL(video)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setOpenModal(false)}
              isDisabled={loading}
            >
              Annuler
            </Button>
            <Button
              color="primary"
              className="text-white"
              onPress={handleSubmit}
              isLoading={loading}
            >
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
