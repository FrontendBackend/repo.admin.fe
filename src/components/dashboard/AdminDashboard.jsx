// src/AdminDashboard.js
import { Container, Paper, Typography, Grid, Box } from "@mui/material";
import UserChart from "../UserChart";
import SignupChart from "../SignupChart";

const AdminDashboard = () => {
  console.log("🟢 AdminDashboard montado");
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Section 1: Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">1,024</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4">823</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              New Sign-ups
            </Typography>
            <Typography variant="h4">54</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Section 2: Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Active Users Over Time
            </Typography>
            <UserChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              New Sign-ups Over Time
            </Typography>
            <SignupChart />
          </Paper>
        </Grid>
      </Grid>

      {/* Section 3: Recent Activities */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          <Typography variant="body1" paragraph>
            - User JohnDoe123 signed up on 2024-05-14.
          </Typography>
          <Typography variant="body1" paragraph>
            - User JaneSmith updated profile information.
          </Typography>
          <Typography variant="body1" paragraph>
            - Admin performed system maintenance.
          </Typography>
          {/* Add more activities as needed */}
        </Box>
      </Paper>

      {/* Section 4: User Statistics */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          User Statistics
        </Typography>
        <Box>
          <Typography variant="body1" paragraph>
            - Total Users: 1,024
          </Typography>
          <Typography variant="body1" paragraph>
            - Active Users: 823
          </Typography>
          <Typography variant="body1" paragraph>
            - Inactive Users: 201
          </Typography>
          <Typography variant="body1" paragraph>
            - New Sign-ups this month: 128
          </Typography>
        </Box>
      </Paper>

      {/* Section 5: System Health */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          System Health
        </Typography>
        <Box>
          <Typography variant="body1" paragraph>
            - Server Status: Online
          </Typography>
          <Typography variant="body1" paragraph>
            - Database Status: Healthy
          </Typography>
          <Typography variant="body1" paragraph>
            - API Response Time: 123ms
          </Typography>
          <Typography variant="body1" paragraph>
            - Error Rate: 0.02%
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
