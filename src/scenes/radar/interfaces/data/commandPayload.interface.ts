/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRustRadarData } from "../game/rustRadarData.interface";
import { CommandType } from "./command.enum";

export interface CommandPayload {
    type: CommandType,
    data?: GetRecoilResponse | SetRecoilRequest | IRustRadarData | any,
}

export interface GetRecoilResponse {
    recoil: {
        yawMin: number;
        yawMax: number;
        pitchMin: number;
        pitchMax: number;
    }
    name: string;
}

export interface SetRecoilRequest {
    recoil: {
        yawMin: number;
        yawMax: number;
        pitchMin: number;
        pitchMax: number;
    }
    name: string;
}