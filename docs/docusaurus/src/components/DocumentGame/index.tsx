import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Game } from "the-world-engine-react";

import styles from "./styles.module.css";

type GetProps<T extends React.ComponentType<any>> = T extends React.ComponentType<infer P> ? P : never;

interface DocumentGameProps extends Omit<GetProps<typeof Game>, "handleEvents"> { 
    ignoreEvents?: boolean;
    allowScroll?: boolean;
}

function DocumentGame(props: DocumentGameProps): JSX.Element {
    const [gameFocus, setGameFocus] = useState(false);

    const gameFocusHandle = useCallback((bool: boolean) => {
        setGameFocus(bool);
    }, []);

    useEffect(() => {
        if (gameFocus && !props.ignoreEvents && !props.allowScroll) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [gameFocus]);

    const gameProps = useMemo((): DocumentGameProps & { handleEvents?: boolean } => {
        return {
            ...props,
            handleEvents: props.ignoreEvents !== true ? gameFocus : undefined
        };
    }, [gameFocus]);

    return (
        <div 
            className={styles.gameContainer}
            onMouseEnter={(): void => gameFocusHandle(true)}
            onMouseLeave={(): void => gameFocusHandle(false)}
        >
            <Game {...gameProps} />
        </div>
    );
}

export default DocumentGame;
