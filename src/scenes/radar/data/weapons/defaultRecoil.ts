import { RecoilProperties } from "../../interfaces/game/weapon/recoil.interface"

interface DefaultRecoil {
    [key: string]: RecoilProperties;
}

export const defaultRecoilProperties: DefaultRecoil = {
    "rifle.ak": {
        yawMin: 1.5,
        yawMax: 2.5,
        pitchMin: -2.5,
        pitchMax: -3.5
    },
    "rifle.lr300": {
        yawMin: -0.5,
        yawMax: 0.5,
        pitchMin: -2,
        pitchMax: -3
    },
    "rifle.semiauto": {
        yawMin: -0.5,
        yawMax: 0.5,
        pitchMin: -2,
        pitchMax: -3
    },
    "rifle.m39": {
        yawMin: 1.5,
        yawMax: 2.5,
        pitchMin: -3,
        pitchMax: -4
    },
    "smg.mp5": {
        yawMin: -1,
        yawMax: 1,
        pitchMin: -1,
        pitchMax: -3
    },
    "smg.thompson": {
        yawMin: -1,
        yawMax: 1,
        pitchMin: -1.5,
        pitchMax: -2
    },
    "pistol.m92": {
        yawMin: -1,
        yawMax: 1,
        pitchMin: -7,
        pitchMax: -8
    },
    "pistol.python": {
        yawMin: -2,
        yawMax: 2,
        pitchMin: -15,
        pitchMax: -16
    },
    "pistol.revolver": {
        yawMin: -1,
        yawMax: 1,
        pitchMin: -3,
        pitchMax: -6
    },
    "pistol.semiauto": {
        yawMin: -1,
        yawMax: 1,
        pitchMin: -2,
        pitchMax: -2.5
    },
    "lmg.hm": {
        yawMin: -1.25,
        yawMax: -2.5,
        pitchMin: -3,
        pitchMax: -4
    },
    "lmg.m249": {
        yawMin: 1.25,
        yawMax: 2.25,
        pitchMin: -3,
        pitchMax: -4
    },
    "smg.2": {
        yawMin: -1,
        yawMax: 1,
        pitchMin: -1.5,
        pitchMax: -2
    },
}

