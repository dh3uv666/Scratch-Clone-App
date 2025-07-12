import React, { useReducer } from "react";
import Icon from "./Icon";
import { Stack, Typography, Box } from "@mui/material";
import { SmallInputBox } from "./SmallInputBox";
import "./styles.css";
import {
  sidebarReducer,
  initialState,
  SET_TURN,
  SET_X_COORDINATE,
  SET_Y_COORDINATE,
  MOVE_SPRITE,
  REPEAT_ANIMATION,
  SET_SAY_MESSAGE,
  SET_SAY_DURATION,
} from "../helpers/sidebarReducer";

export default function Sidebar() {
  const [state, dispatch] = useReducer(sidebarReducer, initialState);

  const handleLeftTurnChange = (e) => {
    dispatch({ type: SET_TURN, payload: Number(e.target.value) });
  };

  const handleXCoordinateChange = (e) => {
    dispatch({ type: SET_X_COORDINATE, payload: Number(e.target.value) });
  };

  const handleYCoordinateChange = (e) => {
    dispatch({ type: SET_Y_COORDINATE, payload: Number(e.target.value) });
  };

  const handleRepeat = (e) => {
    dispatch({ type: REPEAT_ANIMATION, payload: Number(e.target.value) });
  };

  const handleMove = (e) => {
    dispatch({ type: MOVE_SPRITE, payload: Number(e.target.value) });
  };

  const handleSayMessageChange = (e) => {
    dispatch({ type: SET_SAY_MESSAGE, payload: e.target.value });
  };

  const handleSayDurationChange = (e) => {
    dispatch({ type: SET_SAY_DURATION, payload: Number(e.target.value) });
  };

  return (
    <Stack gap={2}>
      <Typography variant="h4" fontFamily={ 'Comic Sans MS'}>Actions</Typography>


      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({ move: state?.moveSprite }));
        }}
      >
        Move{" "}
        <SmallInputBox
          value={state.moveSprite ?? 0}
          onChange={handleMove}
          type="number"
        />{" "}
        steps
      </Box>

      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({ turnLeft: state?.leftTurn }));
        }}
      >
        Turn{" "}
        <SmallInputBox
          value={state.leftTurn ?? 0}
          onChange={handleLeftTurnChange}
          type="number"
        />{" "}
        degrees
      </Box>

      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({
            coordinates: {
              x: state?.xCoordinate,
              y: state?.yCoordinate,
            },
          }));
        }}
      >
        Goto x:{" "}
        <SmallInputBox
          value={state.xCoordinate ?? 0}
          onChange={handleXCoordinateChange}
          type="number"
        />{" "}
        and y:{" "}
        <SmallInputBox
          value={state.yCoordinate ?? 0}
          onChange={handleYCoordinateChange}
          type="number"
        />
      </Box>

      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({ reset: true }));
        }}
      >
        Reset Position
      </Box>

      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({ moveXY: { dx: 50, dy: 50 } }));
        }}
      >
        Move X and Y = 50
      </Box>

      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({ movecenter: true }));
        }}
      >
        Move to Center
      </Box>


      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({
            say: {
              message: state?.sayMessage,
              duration: state?.sayDuration,
            },
          }));
        }}
      >
        Say{" "}
        <SmallInputBox
          value={state.sayMessage ?? ""}
          onChange={handleSayMessageChange}
          type="text"
          placeholder="message"
        />{" "}
        for{" "}
        <SmallInputBox
          value={state.sayDuration ?? 2}
          onChange={handleSayDurationChange}
          type="number"
        />{" "}
        seconds
      </Box>


      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({ repeat: state?.repeat }));
        }}
      >
        Repeat{" "}
        <SmallInputBox
          value={state.repeat ?? 0}
          onChange={handleRepeat}
          type="number"
        />{" "}
        times
      </Box>

      <Box
        className="sidebarEvents"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("instruction", JSON.stringify({ rotate360: 360 }));
        }}
      >
        Rotate 360 degrees
      </Box>
    </Stack>
  );
}
