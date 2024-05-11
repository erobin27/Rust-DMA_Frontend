import { Box, Button, Card, Slider, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CommandPayload } from "../radar/interfaces/data/commandPayload.interface";
import { CommandType } from "../radar/interfaces/data/command.enum";
import { defaultRecoilProperties } from "../radar/data/weapons/defaultRecoil";
import { RecoilProperties } from "../radar/interfaces/game/weapon/recoil.interface";

export interface IRecoilComponentInput {
  weaponName: string;
  sendToWebsocket: (msg: string) => void;
  image?: string;
  current?: {
    yawMin: number;
    yawMax: number;
    pitchMin: number;
    pitchMax: number;
  };
}

interface RecoilProperty {
  title: 'yawMin' | 'yawMax' | 'pitchMin' | 'pitchMax';
  defaultValue: number;
  newValues: RecoilProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setNewValues: any;
  currentValues?: RecoilProperties;
}

const notExistValues: RecoilProperties = {
  yawMin: 0,
  yawMax: 0,
  pitchMin: 0,
  pitchMax: 0,
}

const RecoilProperty = ({ title, newValues, defaultValue, currentValues, setNewValues }: RecoilProperty) => {

  const updateValue = (value: number) => {
    const updated = {...newValues};
    updated[title] = value;
    setNewValues(updated);
  }

  return (
        <Box display='flex' flexDirection='column' maxWidth='80px'>
          <Typography variant="h4">{title}</Typography>
          <Box display='flex' flexDirection='column' gap='5px'>
            <Tooltip title={`current: ${currentValues ? currentValues[title] : null}`}>
            <TextField
              disabled
              value={defaultValue}
              content='center'
              inputProps={{
                style: { textAlign: 'center', fontSize: 18 }
              }}
            />
            </Tooltip>
            <TextField
              value={newValues[title]}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateValue(Number(event.target.value));
              }}
              inputProps={{
                style: { textAlign: 'center', fontSize: 18 }
              }}
            />
          </Box>
        </Box>
  );
};

export const RecoilComponent = (props: IRecoilComponentInput) => {
  const { sendToWebsocket, weaponName } = props;
  const found = defaultRecoilProperties[weaponName];
  const defaultRecoil = found ?? notExistValues;
  const [percentage, setPercentage] = useState<number>(100);
  const [newRecoilValues, setNewRecoilValues] = useState<RecoilProperties>(defaultRecoil);

  useEffect(()=> {
    const percent = percentage / 100;

    const roundValue = (val: number) => parseFloat((val * percent).toFixed(2));

    const updated: RecoilProperties = {
      yawMin: roundValue(defaultRecoil.yawMin),
      yawMax: roundValue(defaultRecoil.yawMax),
      pitchMin: roundValue(defaultRecoil.pitchMin),
      pitchMax: roundValue(defaultRecoil.pitchMax),
    };

    setNewRecoilValues(updated);
  }, [percentage]);

  useEffect(()=> {
    setNewRecoilValues(defaultRecoil);
    setPercentage(100);
  }, [defaultRecoil]);

   const hasZeroValues = (): boolean => {
    const values = Object.values(newRecoilValues);
    return values.some(value => value === 0);
  }

  const refreshMsg: CommandPayload = { type: CommandType.RECOIL_GET, data: {} };
  const refreshJson = JSON.stringify(refreshMsg);

  const submitMsg: CommandPayload = { type: CommandType.RECOIL_SET, data: { recoil: newRecoilValues, name: weaponName } };
  const submitJson = JSON.stringify(submitMsg);

  return (
    <Card elevation={4} sx={{ padding: '25px', maxWidth: '800px', borderRadius: '15px'}}>
      <Box display='flex'>
        <Box>
          {/* <FallbackImage src={ props.image ?? `public/icons/items/${props.weaponName}.png`} fallbackSrc={`public/icons/hazmatsuit.png`} alt="weapon" /> */}
          <img src={ found ? `icons/items/${weaponName}.png` : 'icons/hazmatsuit.png'} alt={weaponName} />
          <Box display='flex' gap='5px' marginRight='50px'>
            <Button variant="contained" onClick={() => sendToWebsocket(refreshJson)}>Refresh</Button>
            <Button variant="outlined" disabled={hasZeroValues()} onClick={() => sendToWebsocket(submitJson)}>Submit</Button>
          </Box>
        </Box>

        <Box display='flex' flexDirection='column' width='100%'>
          <Box display='flex' justifyContent='space-between' width='100%' mb='40px'>
            <RecoilProperty title="yawMin" defaultValue={defaultRecoil.yawMin} newValues={newRecoilValues} setNewValues={setNewRecoilValues} currentValues={props.current}/>
            <RecoilProperty title="yawMax" defaultValue={defaultRecoil.yawMax} newValues={newRecoilValues} setNewValues={setNewRecoilValues} currentValues={props.current}/>
            <RecoilProperty title="pitchMin" defaultValue={defaultRecoil.pitchMin} newValues={newRecoilValues} setNewValues={setNewRecoilValues} currentValues={props.current}/>
            <RecoilProperty title="pitchMax" defaultValue={defaultRecoil.pitchMax} newValues={newRecoilValues} setNewValues={setNewRecoilValues} currentValues={props.current}/>
          </Box>
          <Slider
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={100}
            defaultValue={30}
            value={percentage}
            onChange={(e, p)=> { setPercentage(p as number)}}
          />
        </Box>
      </Box>
    </Card>
  );
};
