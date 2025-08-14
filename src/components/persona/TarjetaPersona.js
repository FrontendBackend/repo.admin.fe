import { Avatar, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react'

const TarjetaPersona = ({personas}) => {
  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={2}
        alignItems="start" // 👈 importante: que no estire las tarjetas
      >
        {personas.map((persona, index) => (
          <Card
            key={persona.idPersona || index}
            variant="outlined"
            sx={{
              overflow: "hidden", // evita desbordes
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  src={
                    "https://a.storyblok.com/f/178900/200x200/4acc11bf54/9f73b5ce92d6191b12cbaa8ae196c4681594733184_large.jpg"
                  }
                />
              }
              title={persona.noPersona}
              subheader={persona.deCorreo}
            />
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                Información adicional sobre {persona.noPersona}.
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default TarjetaPersona