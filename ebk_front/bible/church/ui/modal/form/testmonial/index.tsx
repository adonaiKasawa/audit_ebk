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

export default function AddTestmonialsFormModal({
  id_eglise,
  handleFindTesTmonials,
}: {
  id_eglise: number;
  handleFindTesTmonials: () => Promise<void>;
}) {
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
        video
      );

      toast.success("Témoignage soumis avec succès !");
      console.log("result: ",result);
      
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
