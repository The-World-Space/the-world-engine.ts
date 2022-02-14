//todo: move to bootstrap
export type GameSetting = {
    render: {
        useCss3DRenderer: boolean;
    },
    physics: {
        usePhysics2D: boolean;
    }
};

export function createDefaultGameSetting(): GameSetting {
    return {
        render: {
            useCss3DRenderer: true
        },
        physics: {
            usePhysics2D: false
        }
    };
}
