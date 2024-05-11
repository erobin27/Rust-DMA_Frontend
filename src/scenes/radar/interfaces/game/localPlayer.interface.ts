export interface LocalPlayer {
    holding: {
        recoil?: {
            yawMin: number;
            yawMax: number;
            pitchMin: number;
            pitchMax: number;
        }
        name: string;
    }
}