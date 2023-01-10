import React, { useState, useEffect } from "react";
import "../../styles/styleDialog.css";
import DIALOGS from "../../assets/DialogBox/Dialogs/DIALOGOS.json";
import HomeFunction from "../PhaserScenes/Home.jsx";

let skipAnimation = false;

const Dialogs = () => {
  const [countMessage, setCountMessage] = useState(0);
  const [countImg, setCountImg] = useState(0);
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [currentDialog, setCurrentDialog] = useState("");
  const [dialogEnded, setDialogEnded] = useState(false);
  const [infoDialog, setInfoDialog] = useState("");
  const [currentImg, setCurrentImg] = useState([[], []]);
  const [dialog, setDialog] = useState("");

  let currentLetter = "";

  const verifyDialog = (chat) => {
    const currentPhrase = DIALOGS[chat]["dialogs"][countMessage];
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));

    if (!showDialogBox) {
      setShowDialogBox(true);
    }

    async function animationDialogs() {
      for (let i in currentPhrase) {
        setCurrentDialog((currentLetter += currentPhrase[i]));
        await timer(80);
        if (skipAnimation) {
          currentLetter = currentPhrase;
        }
        if (currentLetter.length === currentPhrase.length) {
          setDialogEnded(false);
          setCountMessage(countMessage + 1);
          if (DIALOGS[chat]["dialogs"].length - 1 === countMessage) {
            setInfoDialog("Fechar");
          } else {
            setInfoDialog("Próxima");
          }
        } else {
          setDialogEnded(true);
          setInfoDialog("Pular");
        }

        if (skipAnimation) {
          currentLetter = currentPhrase;
          setCurrentDialog(currentPhrase);
          break;
        } else {
        }
      }
    }
    if (DIALOGS[chat]["dialogs"].length === countMessage) {
      setInfoDialog("");
      setShowDialogBox(false);
      setCountMessage(0);
      setCurrentDialog("");
      setCurrentImg([[], []]);
      setCountImg(0);
      setDialog("");
    } else if (!dialogEnded) {
      skipAnimation = false;
      animationDialogs();
      setCurrentImg([
        DIALOGS[chat]["imgAvatarLeft"],
        DIALOGS[chat]["imgAvatarRight"],
      ]);
      setCountImg(countImg + 1);
    } else {
      skipAnimation = true;
      animationDialogs();
    }
  };

  const dialogChange = (value) => {
    setDialog(value);
  };

  useEffect(() => {
    const handleKeyPressed = (e) => {
      if (["Space"].includes(e.code)) {
        verifyDialog(dialog);
      }
    };
    window.addEventListener("keyup", handleKeyPressed);
    return () => window.removeEventListener("keyup", handleKeyPressed);
  }, [verifyDialog]);

  useEffect(() => {
    const handleKeyPressed = () => {
      if (dialog === "sobreMim" && !showDialogBox) {
        verifyDialog(dialog);
      }
    };
    window.addEventListener("click", handleKeyPressed);
    return () => window.removeEventListener("click", handleKeyPressed);
  }, [verifyDialog]);

  return (
    <div className="wrapper">
      <HomeFunction dialogChange={dialogChange} showDialogBox={showDialogBox} />
      <div className="avatar1">
        <img src={currentImg[0][countImg]} />
      </div>
      {showDialogBox ? (
        <div className="boxWrapper">
          <div className="box">
            <div className="dialogWrapper">
              <p className="dialog">{currentDialog}</p>
              <p className="info">{infoDialog}</p>
            </div>
          </div>
        </div>
      ) : null}
      <div className="avatar2">
        <img src={currentImg[1][countImg]} />
      </div>
    </div>
  );
};

export default Dialogs;
