import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { useState } from "react";
import { Tab, Tabs } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { IoCodeSlashOutline } from "react-icons/io5";

import Alert from "../../alert";

import { ItemVideos } from "@/app/lib/config/interface";
import { file_url } from "@/app/lib/request/request";
import { CropperImageUI } from "@/ui/cropperFile/image";
import CropperVideosUI from "@/ui/cropperFile/video";
import { VideoIcon } from "@/ui/icons";
import { base64DataToFile } from "@/app/lib/config/func";
import { TypeContentEnum } from "@/app/lib/config/enum";
import { UpdateFile } from "@/app/lib/actions/library/library";
import { IFramePlayer } from "@/ui/player/iframe.player";

export function UpdateVideoFormModal({
  openModal,
  setOpenModal,
  video,
  handleFindVideos,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  video: ItemVideos;
  handleFindVideos: () => void;
}) {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [croppedVideosUrl, setCroppedVideosUrl] = useState<any>();
  const [, setVideosUrl] = useState<string>(`${file_url}${video.lien}`);

  const [titre, setTitre] = useState<string>(video.titre);
  const [auteur, setAuteur] = useState<string>(video.auteur);
  const [iframe, setIframe] = useState<string>("");

  const [selected, setSelected] = useState<string | number>("videos");
  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  // videos player state
  // const [duration, setDuration] = useState<number>(0);
  // const [progress, setProgress] = useState<number>(0);
  // const [playing, setPlaying] = useState<boolean>(false);
  // const [poucentageProgress, setPoucentageProgress] = useState<number>(0);
  // const play: any = useRef();
  // const refPlayer: any = useRef(null);

  const handleUpdateSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    const image = base64DataToFile(croppedImageUrl);

    formData.append("titre", titre);
    formData.append("auteur", auteur);
    formData.append("image", image);
    formData.append(
      `${selected === "videos" ? "videos" : "iframe"}`,
      selected === "videos" ? croppedVideosUrl : iframe,
    );
    formData.append("source", selected === "videos" ? "1" : "0");
    const update = await UpdateFile(TypeContentEnum.videos, video.id, formData);

    setLoading(false);
    if (
      update.hasOwnProperty("statusCode") &&
      update.hasOwnProperty("message")
    ) {
      setOpenAlert(true);
      setAlertTitle("Erreur");
      if (typeof update.message === "object") {
        let message = "";

        update.message.map((item: string) => (message += `${item} \n`));
        setAlertMsg(message);
      }
    } else {
      handleFindVideos();
      setOpenAlert(true);
      setAlertMsg("Le processus de modification s'est bien déroulé");
      setOpenModal(false);
    }
  };

  // const handleSeek = (seconds: number) => {
  //   setPoucentageProgress(seconds);
  //   setProgress((seconds * duration) / 100);
  //   refPlayer?.current?.seekTo((seconds * duration) / 100);
  //   if (play?.current?.currentTime) {
  //     play.current.currentTime = (seconds * duration) / 100;
  //   }
  // };

  // const handlerDuration = (duration: number) => {
  //   setDuration(duration);
  // };

  // const handlerProgress = (state: OnProgressProps) => {
  //   setProgress(state.playedSeconds);
  //   setPoucentageProgress((state.playedSeconds / duration) * 100);
  // };

  // const handlerPlay = () => {
  //   if (playing) {
  //     play?.current?.pause();
  //   } else {
  //     play?.current?.play();
  //   }
  //   setPlaying(!playing);
  // };

  const onImageSelected = (selectedVideos: string) => {
    setVideosUrl(selectedVideos);
  };

  const handleOnChange = async (file: File, previewFile?: string) => {
    setCroppedVideosUrl(file);
    if (previewFile) {
      onImageSelected(previewFile);
    }
  };

  const renderComponentUpdate = () => {
    if (selected === "videos") {
      return (
        <div>
          {/* <div className="video-player-viewer">
          {videosUrl}
          <ForwardRefPlayer
            ref={refPlayer}
            src={videosUrl}
            autoPlay={true}
            width={"100%"}
            height={"auto"}
            url={videosUrl}
            onDuration={handlerDuration}
            onProgress={handlerProgress}
            onSeek={(e: number) => console.log(e)}
            playing={playing}
            onPlay={() => { }}
            onError={(e: any) => {
              console.log(e);
            }}
            onEnded={() => { setPlaying(false) }}
            config={{
              file: {
                hlsOptions: {}
              }
            }}
          /> 
        </div>
        <div className="w-full flex justify-center items-center">
          {playing ?
            <CiPause1 onClick={() => { handlerPlay() }} size={30} className="text-foreground cursor-pointer" />
            :
            <CiPlay1 onClick={() => { handlerPlay() }} size={30} className="text-foreground cursor-pointer" />
          }
        </div>
        {video.interne ? <div className="w-full gap-4  video-player-controler-timer-slider">
          <Duration seconds={duration} />
          <Slider
            size="sm"
            defaultValue={poucentageProgress}
            value={poucentageProgress}
            onChange={(e) => {
              handleSeek(parseInt(e.toString()))
            }}
            classNames={{
              base: "max-w-md",
              trackWrapper: "w-full",
              track: "border-s-foreground-200",
              filler: "w-full bg-foreground ",
              thumb: "transition-transform shadow-small bg-foreground rounded-full w-2 h-2 block group-data-[dragging=true]:scale-50"
            }}
          />
          <Duration seconds={progress} />
        </div> : null} */}
          <CropperVideosUI
            file={croppedVideosUrl}
            setFile={handleOnChange}
            typeFile="videos"
          />
        </div>
      );
    } else {
      return (
        <div>
          <IFramePlayer iframe={iframe} />
          <Input
            label="Code d'integration (iframe)"
            value={iframe}
            onChange={(e) => {
              setIframe(e.target.value);
            }}
          />
        </div>
      );
    }
  };

  return (
    <div>
      <Modal
        backdrop={"opaque"}
        isOpen={openModal}
        scrollBehavior={"inside"}
        size="5xl"
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modifier la vidéos
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateSubmit();
                  }}
                >
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="col-span-2 flex justify-center">
                      <Tabs
                        aria-label="Options"
                        className="tabs-centered"
                        selectedKey={selected}
                        onSelectionChange={(k) => {
                          setSelected(k);
                        }}
                      >
                        <Tab
                          key="videos"
                          title={
                            <div className="flex items-center space-x-2">
                              <p>Vidéos</p>
                              <VideoIcon />
                            </div>
                          }
                        />
                        <Tab
                          key="iframe"
                          title={
                            <div className="flex items-center space-x-2">
                              <p>Iframe</p>
                              <IoCodeSlashOutline size={30} />
                            </div>
                          }
                        />
                      </Tabs>
                    </div>
                    <div>
                      <CropperImageUI
                        croppedImageUrl={croppedImageUrl}
                        setCroppedImageUrl={setCroppedImageUrl}
                      />
                    </div>
                    <div>{renderComponentUpdate()}</div>
                    <Input
                      label="Titre"
                      value={titre}
                      onChange={(e) => {
                        setTitre(e.target.value);
                      }}
                    />

                    <Input
                      label="Auteur"
                      value={auteur}
                      onChange={(e) => {
                        setAuteur(e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    className="bg-primary text-white mt-4"
                    isLoading={loading}
                    type="submit"
                  >
                    Modifier
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
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
      </Modal>
    </div>
  );
}
