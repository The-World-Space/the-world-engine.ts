import React from "react";
import { Game } from "the-world-engine-react";
import styles from "./styles.module.css";

type GetProps<T extends React.ComponentType<any>> = T extends React.ComponentType<infer P> ? P : never;

interface DocumentGameProps extends GetProps<typeof Game> { }

function DocumentGame(props: DocumentGameProps) {
    return (
        <div className={styles.gameContainer}>
            <Game {...props} />
        </div>
    );
}

export default DocumentGame;
