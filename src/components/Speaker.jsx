import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import bgMusic from "../assets/audio/80s-music-electric-dreams.mp3";
import soundOn from "../assets/images/sound-on.png";
import soundOff from "../assets/images/sound-off.png";

const Speaker = forwardRef((props, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [caption, setCaption] = useState("");
    const audioRef = useRef(null);

    // Met à jour la légende selon la taille de l'écran et l'état de lecture
    const updateCaption = () => {
        if (window.innerWidth > 500) {
            setCaption(isPlaying ? "Sound off" : "Sound on");
        } else {
            setCaption("");
        }
    };

    // Expose des fonctions au composant parent (App.jsx) via la ref
    useImperativeHandle(ref, () => ({
        stopMusic: () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
            }
        }
    }));

    // Gestion des écouteurs d'événements (Resize)
    useEffect(() => {
        updateCaption(); // Initial call
        window.addEventListener("resize", updateCaption);

        return () => {
            window.removeEventListener("resize", updateCaption);
        };
    }, [isPlaying]); // On relance si isPlaying change pour mettre à jour le texte

    const handleBgMusic = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div id="toggle" onClick={handleBgMusic}>
            <audio ref={audioRef} src={bgMusic} loop />
            <img
                src={isPlaying ? soundOff : soundOn}
                id="toggle-music"
                alt="loudspeaker"
            />
            <figcaption>{caption}</figcaption>
        </div>
    );
});

export default Speaker;