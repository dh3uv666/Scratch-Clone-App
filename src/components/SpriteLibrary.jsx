import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useAppContext } from "../context/context";
import {
  SET_ACTIVE_SPRITE,
  SET_MULTIPLE_SPRITES,
} from "../context/constants";
import { v4 as uuidv4 } from "uuid";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";
import BallSprite from "./BallSprite";

export default function SpriteLibrary() {
  const { state, dispatch } = useAppContext();
  const [showSprites, setShowSprites] = useState(false);

  const handleSpriteSelect = useCallback(
    (itemId) => () => {
      dispatch({ type: SET_ACTIVE_SPRITE, payload: itemId });
    },
    [dispatch]
  );

  const handleMultiSpriteSelect = useCallback(
    (spriteName) => () => {
      dispatch({
        type: SET_MULTIPLE_SPRITES,
        payload: {
          id: uuidv4(),
          name: spriteName,
          x: state.multipleSprites.length * 110,
          y: 0,
          rotate: 0,
        },
      });
      setShowSprites(false);
    },
    [dispatch, state.multipleSprites.length]
  );

  const renderSprite = (item) => {
    const sharedStyle = {
      transform: "none",
      transition: "all 0.8s ease-in-out",
      width: "40px",
      height: "40px",
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
      {/* Add Sprite Button */}
      <Button 
        onClick={() => setShowSprites(true)} 
        className="addSprite"
        variant="contained"
        fullWidth
        style={{
          backgroundColor: '#FF9800',
          color: 'white',
          fontFamily: 'Comic Sans MS',
          fontWeight: 'bold',
          fontSize: '14px',
          border: '3px solid #333',
          borderRadius: '8px',
          boxShadow: '3px 3px 0px #333',
          textTransform: 'none'
        }}
      >
        ✚ Add Sprite
      </Button>

      {/* Sprites List */}
      <Stack gap={1} flex={1} overflow="auto">
        {state.multipleSprites.length === 0 ? (
          <Box 
            style={{
              textAlign: 'center',
              color: '#666',
              fontStyle: 'italic',
              padding: '20px',
              fontSize: '16px',
              fontFamily: 'Comic Sans MS'
            }}
          >
            No sprites added yet!<br/>
            Click "Add Sprite" to get started.
          </Box>
        ) : (
          state.multipleSprites.map((item) => (
            <Box
              key={`${item.id}-${item.name}`}
              className={`sprite-item ${item.id === state.activeSprite ? 'active' : ''}`}
              onClick={handleSpriteSelect(item.id)}
              style={{
                border: item.id === state.activeSprite ? "3px solid #FF6B6B" : "3px solid #333",
                borderRadius: '8px',
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: item.id === state.activeSprite ? '#FFE066' : 'white',
                boxShadow: '2px 2px 0px #333',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Box style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                {renderSprite(item)}
              </Box>
              <Typography 
                variant="body2" 
                style={{
                  fontFamily: 'Comic Sans MS',
                  fontWeight: 'bold',
                  color: '#333',
                  textTransform: 'capitalize'
                }}
              >
                {item.name.replace('_', ' ')}
              </Typography>
              {item.id === state.activeSprite && (
                <Typography 
                  variant="caption" 
                  style={{
                    marginLeft: 'auto',
                    color: '#FF6B6B',
                    fontWeight: 'bold',
                    fontFamily: 'Comic Sans MS'
                  }}
                >
                  ACTIVE
                </Typography>
              )}
            </Box>
          ))
        )}
      </Stack>

      {/* Add Sprites Dialog */}
      <Dialog 
        open={showSprites} 
        onClose={() => setShowSprites(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          style: {
            border: '4px solid #333',
            borderRadius: '15px',
            fontFamily: 'Comic Sans MS'
          }
        }}
      >
        <DialogTitle 
          style={{
            fontFamily: 'Comic Sans MS',
            fontWeight: 'bold',
            fontSize: '20px',
            textAlign: 'center',
            color: '#333'
          }}
        >
          Choose a Sprite
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" justifyContent="center" gap={4} padding={2}>
            {["cat_sprite", "dog_sprite", "ball_sprite"].map((name) => (
              <Box
                key={name}
                onClick={handleMultiSpriteSelect(name)}
                style={{
                  cursor: 'pointer',
                  padding: '15px',
                  border: '3px solid #333',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  boxShadow: '3px 3px 0px #333',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  minWidth: '80px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translate(-2px, -2px)';
                  e.target.style.boxShadow = '5px 5px 0px #333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translate(0px, 0px)';
                  e.target.style.boxShadow = '3px 3px 0px #333';
                }}
              >
                <Box style={{ width: '60px', height: '60px', margin: '0 auto 10px' }}>
                  {renderSprite({ name })}
                </Box>
                <Typography 
                  variant="caption" 
                  style={{
                    fontFamily: 'Comic Sans MS',
                    fontWeight: 'bold',
                    color: '#333',
                    textTransform: 'capitalize',
                    display: 'block'
                  }}
                >
                  {name.replace('_', ' ')}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', paddingBottom: '20px' }}>
          <Button 
            onClick={() => setShowSprites(false)}
            style={{
              backgroundColor: '#F44336',
              color: 'white',
              fontFamily: 'Comic Sans MS',
              fontWeight: 'bold',
              border: '3px solid #333',
              borderRadius: '8px',
              boxShadow: '3px 3px 0px #333',
              textTransform: 'none',
              padding: '8px 20px'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}