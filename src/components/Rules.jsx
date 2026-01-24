import { useState } from "react";

// Image
import children from "../assets/images/children.png";

const Rules = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Update window width on resize
    window.addEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
    });

    return (
        <aside className="gameRules">
            <div className="logoTitle">
                <p className="title">
                    <span className="letterM">M</span>
                    <span className="letterB">B</span>
                </p>
                <p className="subtitle">JEUX</p>
            </div>

            <div className="ref">
                <img className="children" src={children} alt="children" />
                <p>6 ans-Adulte</p>
                <p className="players">2 joueurs</p>
                <div className="separator"></div>
            </div>

            <div className="rules">
                <p>
                    <span>But du jeu :</span> Alignez 4 jetons de votre couleur
                    (horizontalement, verticalement ou diagonalement) avant l'ordinateur.
                </p>
                <p>
                    <span>Déroulement :</span> Choisissez qui commence, puis placez
                    vos jetons à tour de rôle. L'IA (jetons jaunes) tentera de vous bloquer&nbsp;!
                </p>
                <p>
                    <span>Fin de partie :</span> Si la grille est pleine sans alignement,
                    le match est nul. Cliquez sur <span>"Reset"</span> pour retenter votre chance.
                </p>

                {/* Start button on small and medium screens */}
                {windowWidth <= 992 && (
                    <a href="#titleAndBoard">
                        <p className="start-msg">
                            COMMENCEZ À  JOUER
                        </p>
                    </a>
                )}

                <footer>
                    <a href="https://github.com/jesselessa" target="_blank" rel="noreferrer">
                        <p>
                            &copy; {new Date().getFullYear()} Jessica ELESSA - All rights reserved
                        </p>
                    </a>
                </footer>
            </div>
        </aside>
    );
};

export default Rules;