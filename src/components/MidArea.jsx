import { Box, Stack, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useAppContext } from "../context/context";
import {
  SET_MID_AREA_DATA,
  DELETE_MID_AREA_DATA,
  SET_REPEAT_IN_MID_AREA,
  UPDATE_MID_AREA_DATA,
} from "../context/constants";
import "./styles.css";
import { SmallInputBox } from "./SmallInputBox";
import { v4 as uuid } from "uuid";

export default function MidArea() {
  const { state, dispatch } = useAppContext();

  const handleDragDrop = useCallback(
    (e) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData("instruction") || e.dataTransfer.getData("text/plain");
      if (!rawData) return;

      const id = uuid();
      let data;

      try {
        data = JSON.parse(rawData);
      } catch {
        const [key, val] = rawData.split(":");
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: { [key]: isNaN(+val) ? val : +val, id, spriteId: state.activeSprite },
        });
        return;
      }

      if (data.coordinates) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: {
            xc: data.coordinates.x,
            yc: data.coordinates.y,
            id,
            spriteId: state.activeSprite,
          },
        });
        return;
      }

      if (data.say) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: {
            say: {
              message: data.say.message,
              duration: +data.say.duration,
            },
            id,
            spriteId: state.activeSprite,
          },
        });
        return;
      }

      if (data.think) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: {
            think: {
              message: data.think.message,
              duration: +data.think.duration,
            },
            id,
            spriteId: state.activeSprite,
          },
        });
        return;
      }

      if (data.repeat !== undefined) {
        dispatch({
          type: SET_REPEAT_IN_MID_AREA,
          payload: {
            repeat: +data.repeat,
            id,
            spriteId: state.activeSprite,
          },
        });
        return;
      }

      if (data.reset) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: { reset: true, id, spriteId: state.activeSprite },
        });
        return;
      }

      if (data.movecenter) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: { movecenter: true, id, spriteId: state.activeSprite },
        });
        return;
      }

      if (data.moveXY) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: {
            dx: data.moveXY.dx,
            dy: data.moveXY.dy,
            id,
            spriteId: state.activeSprite,
          },
        });
        return;
      }

      if (data.rotate360) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: { rotate360: true, id, spriteId: state.activeSprite },
        });
        return;
      }

      if (data.move !== undefined) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: { move: data.move, id, spriteId: state.activeSprite },
        });
        return;
      }

      if (data.turnLeft !== undefined) {
        dispatch({
          type: SET_MID_AREA_DATA,
          payload: { turnLeft: data.turnLeft, id, spriteId: state.activeSprite },
        });
        return;
      }
    },
    [dispatch, state.activeSprite]
  );

  const handleDeleteData = useCallback(
    (id) => () => {
      dispatch({ type: DELETE_MID_AREA_DATA, payload: { id } });
    },
    [dispatch]
  );

  const handleChangeData = useCallback(
    (id) => (e) => {
      const { name, value } = e.target;
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const parentData = state.midAreaData.find((item) => item.id === id)?.[parent] || {};
        dispatch({
          type: UPDATE_MID_AREA_DATA,
          payload: {
            id,
            [parent]: {
              ...parentData,
              [child]: value,
            },
          },
        });
      } else {
        dispatch({
          type: UPDATE_MID_AREA_DATA,
          payload: {
            id,
            [name]: value,
          },
        });
      }
    },
    [dispatch, state.midAreaData]
  );

  const renderInstructionBlock = (item) => {
    const { id } = item;

    const Input = ({ label, value, name, type = "text", suffix }) => (
      <>
        {label}
        <SmallInputBox value={value} name={name} type={type} onChange={handleChangeData(id)} />
        {suffix}
      </>
    );

    return (
      <Box className="sidebarEvents" key={id}>
        {"move" in item && Input({ label: "Move ", value: item.move, name: "move", type: "number", suffix: " steps" })}
        {"turnLeft" in item &&
          Input({ label: "Turn ", value: item.turnLeft, name: "turnLeft", type: "number", suffix: " degrees" })}
        {"say" in item && (
          <>
            Say{" "}
            <SmallInputBox
              value={item.say.message}
              name="say.message"
              type="text"
              placeholder="message"
              onChange={handleChangeData(id)}
            />{" "}
            for{" "}
            <SmallInputBox
              value={item.say.duration}
              name="say.duration"
              type="number"
              onChange={handleChangeData(id)}
            />{" "}
            seconds
          </>
        )}
        {"think" in item && (
          <>
            Think{" "}
            <SmallInputBox
              value={item.think.message}
              name="think.message"
              type="text"
              placeholder="message"
              onChange={handleChangeData(id)}
            />{" "}
            for{" "}
            <SmallInputBox
              value={item.think.duration}
              name="think.duration"
              type="number"
              onChange={handleChangeData(id)}
            />{" "}
            seconds
          </>
        )}
        {("xc" in item || "yc" in item) && (
          <>
            Goto x:{" "}
            <SmallInputBox value={item.xc ?? 0} name="xc" type="number" onChange={handleChangeData(id)} /> and y:{" "}
            <SmallInputBox value={item.yc ?? 0} name="yc" type="number" onChange={handleChangeData(id)} />
          </>
        )}
        {("dx" in item || "dy" in item) && (
          <>
            Move X by:{" "}
            <SmallInputBox value={item.dx ?? 0} name="dx" type="number" onChange={handleChangeData(id)} /> and Y by:{" "}
            <SmallInputBox value={item.dy ?? 0} name="dy" type="number" onChange={handleChangeData(id)} />
          </>
        )}
        {"repeat" in item && Input({ label: "Repeat ", value: item.repeat, name: "repeat", type: "number" })}
        {"rotate360" in item && <>Rotate 360°</>}
        {"reset" in item && <>Reset Position</>}
        {"movecenter" in item && <>Move to Center</>}

        <span className="deleteBTN">
          <button onClick={handleDeleteData(id)}>❌</button>
        </span>
      </Box>
    );
  };

  return (
    <Stack height="100%" onDragOver={(e) => e.preventDefault()} onDrop={handleDragDrop}>
      <Typography variant="h4"
      fontFamily={ 'Comic Sans MS'}>Coding Area</Typography>
      <Stack gap={2}>
        {state.midAreaData
          .filter((item) => item?.spriteId === state.activeSprite)
          .map((item) => renderInstructionBlock(item))}
      </Stack>
    </Stack>
  );
}
