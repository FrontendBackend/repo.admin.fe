// src/SettingsPage.js
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notification: "",
    privacy: "",
    theme: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    // Save the updated settings information
    console.log("Settings saved:", settings);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="notification"
            label="Notification Preferences"
            name="notification"
            value={settings.notification}
            onChange={handleChange}
            multiline
            rows={2}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="privacy"
            label="Privacy Settings"
            name="privacy"
            value={settings.privacy}
            onChange={handleChange}
            multiline
            rows={2}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="theme"
            label="Theme"
            name="theme"
            value={settings.theme}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveClick}
            sx={{ mt: 3 }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
