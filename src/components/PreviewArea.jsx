import {
  Box,
  Button,
  Stack,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";
import BallSprite from "./BallSprite";
import { useAppContext } from "../context/context";
import {
  ROTATE_SPRITE,
  UPDATE_SPRITE_POSITION,
  SWAP_POSITIONS_OF_STRIPS,
  SET_SPRITE_ACTION,
  SET_HERO_MODE,
  SET_COLLIDED,
  SWAP_QUEUES,
} from "../context/constants";
import { MOVE_SPRITE } from "../helpers/sidebarReducer";

const SPRITE_SIZE = 50;

export default function PreviewArea() {
  const { state, dispatch } = useAppContext();
  const containerRef = useRef(null);

  const executeInstruction = async (instruction, spriteId, repeat = 1) => {
    const sprite = state.multipleSprites.find((s) => s.id === spriteId);
    const container = containerRef.current?.getBoundingClientRect();
    if (!sprite) return;

    return new Promise((resolve) => {
      const action = (type, payload) => dispatch({ type, payload });

      if (instruction.moveBy) {
        const duration = 1000;
        const startTime = performance.now();
        const startX = sprite.x;
        const startY = sprite.y;
        const dx = instruction.moveBy.dx * repeat;
        const dy = instruction.moveBy.dy * repeat;

        const animate = (time) => {
          const elapsed = time - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const newX = startX + dx * progress;
          const newY = startY + dy * progress;

          dispatch({
            type: UPDATE_SPRITE_POSITION,
            payload: { id: spriteId, x: newX, y: newY },
          });

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animate);
        return;
      }

      setTimeout(() => {
        if (instruction.move) {
          action(MOVE_SPRITE, { id: spriteId, x: instruction.move * repeat });
        }

        if (instruction.xc || instruction.yc) {
          action(UPDATE_SPRITE_POSITION, {
            id: spriteId,
            x: instruction.xc * repeat,
            y: instruction.yc * repeat,
          });
        }

        if (instruction.turnLeft) {
          action(ROTATE_SPRITE, {
            id: spriteId,
            rotate: instruction.turnLeft * repeat,
          });
        }

        if (instruction.rotate360) {
          action(ROTATE_SPRITE, { id: spriteId, rotate: 360 * repeat });
        }

        if (instruction.say) {
          action(SET_SPRITE_ACTION, {
            id: spriteId,
            action: `say:${instruction.say.message}:${instruction.say.duration}`,
          });
        }

        if (instruction.think) {
          action(SET_SPRITE_ACTION, {
            id: spriteId,
            action: `think:${instruction.think.message}:${instruction.think.duration}`,
          });
        }

        if (instruction.reset) {
          action(UPDATE_SPRITE_POSITION, { id: spriteId, x: 0, y: 0 });
        }

        if (instruction.movecenter && container) {
          action(UPDATE_SPRITE_POSITION, {
            id: spriteId,
            x: container.width / 2 - SPRITE_SIZE / 2,
            y: container.height / 2 - SPRITE_SIZE / 2,
          });
        }

        resolve();
      }, 500);
    });
  };

  const handlePlayButton = useCallback(() => {
    const grouped = Object.groupBy(state.midAreaData, (item) => item?.spriteId);

    const runInstructions = async () => {
      const spriteIds = Object.keys(grouped);
      const runIds = state.heroMode ? spriteIds.slice(0, 2) : spriteIds;

      for (const spriteId of runIds) {
        const instructions = grouped[spriteId] || [];
        for (const instruction of instructions) {
          const repeat = instruction.repeat || 1;
          await executeInstruction(instruction, spriteId, repeat);
        }
      }
    };

    runInstructions();
  }, [state.midAreaData, state.multipleSprites, state.heroMode, dispatch]);

  const handleResetButton = useCallback(() => {
    state.multipleSprites.forEach((sprite) => {
      dispatch({
        type: UPDATE_SPRITE_POSITION,
        payload: { id: sprite.id, x: 0, y: 0 },
      });
    });
  }, [state.multipleSprites, dispatch]);

  const handleDragDrop = useCallback(
    (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("sprite");
      const [, id] = data.split(":");

      const offsetX = parseInt(e.dataTransfer.getData("offsetX")) || 0;
      const offsetY = parseInt(e.dataTransfer.getData("offsetY")) || 0;

      const container = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - container.left - offsetX;
      const y = e.clientY - container.top - offsetY;

      dispatch({ type: UPDATE_SPRITE_POSITION, payload: { id, x, y } });
    },
    [dispatch]
  );

  const checkCollision = useCallback(() => {
    if (!state.heroMode || state.multipleSprites.length < 2) return;

    const threshold = 40;
    const sprites = state.multipleSprites;
    let collisionDetected = false;

    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        const s1 = sprites[i];
        const s2 = sprites[j];

        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          collisionDetected = true;
          if (!state.collided) {
            dispatch({ type: SWAP_QUEUES, payload: { id1: s1.id, id2: s2.id } });
            dispatch({ type: SET_COLLIDED, payload: true });
          }
        }
      }
    }

    if (!collisionDetected && state.collided) {
      dispatch({ type: SET_COLLIDED, payload: false });
    }
  }, [state.multipleSprites, state.heroMode, state.collided, dispatch]);

  useEffect(() => {
    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [checkCollision]);

  useEffect(() => {
    if (state.collided && state.heroMode) {
      setTimeout(() => {
        handlePlayButton();
      }, 500);
    }
  }, [state.collided, state.heroMode, handlePlayButton]);

  const renderSprite = (item) => {
    const sharedStyle = {
      transform: "none",
      transition: "all 0.8s ease-in-out",
    };

    switch (item.name) {
      case "cat_sprite":
        return <CatSprite currentAction={item.currentAction} style={sharedStyle} />;
      case "dog_sprite":
        return <DogSprite currentAction={item.currentAction} style={sharedStyle} />;
      case "ball_sprite":
        return <BallSprite currentAction={item.currentAction} style={sharedStyle} />;
      default:
        return null;
    }
  };

  return (
    <Stack height="100%" gap={2}>
      <Stack direction="row" justifyContent="center" gap={2} alignItems="center">
        <Button
          variant="contained"
          onClick={handlePlayButton}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            fontFamily: 'Comic Sans MS',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '3px solid #333',
            borderRadius: '8px',
            boxShadow: '3px 3px 0px #333',
            textTransform: 'none',
            padding: '10px 20px'
          }}
        >
          ▶️ Play All
        </Button>
        <Button
          variant="contained"
          onClick={handleResetButton}
          style={{
            backgroundColor: '#F44336',
            color: 'white',
            fontFamily: 'Comic Sans MS',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '3px solid #333',
            borderRadius: '8px',
            boxShadow: '3px 3px 0px #333',
            textTransform: 'none',
            padding: '10px 20px'
          }}
        >
          🔄 Reset
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.heroMode}
              onChange={(e) => dispatch({ type: SET_HERO_MODE, payload: e.target.checked })}
              style={{ color: '#333' }}
            />
          }
          label={
            <Typography style={{ fontFamily: 'Comic Sans MS', fontWeight: 'bold', color: '#333' }}>
              🦸 Hero Mode
            </Typography>
          }
        />
      </Stack>

      <Stack
        ref={containerRef}
        className="previewArea"
        position="relative"
        overflow="hidden"
        width={1}
        height={1}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDragDrop}
        style={{
          flex: 1,
          border: '3px solid #333',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)',
          minHeight: '300px'
        }}
      >
        {state.multipleSprites.map((item) => (
          <Box
            key={`${item.id}-${item.name}`}
            sx={{
              position: "absolute",
              left: `${item.x}px`,
              top: `${item.y}px`,
              cursor: "move",
              width: `${SPRITE_SIZE}px`,
              height: `${SPRITE_SIZE}px`,
              transition: "all 0.8s ease-in-out",
            }}
            draggable
            onDragStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.dataTransfer.setData("sprite", `id:${item.id}`);
              e.dataTransfer.setData("offsetX", e.clientX - rect.left);
              e.dataTransfer.setData("offsetY", e.clientY - rect.top);
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${item.rotate ?? 0}deg)`,
                transition: "transform 0.8s ease-in-out",
              }}
            >
              {renderSprite(item)}
            </div>
          </Box>
        ))}

        {state.multipleSprites.length === 0 && (
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#999',
              fontFamily: 'Comic Sans MS',
              fontSize: '18px',
              fontStyle: 'italic'
            }}
          >
            Add sprites from the library<br />to see them here!
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
