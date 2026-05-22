import { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  InputLabel, 
  FormControl, 
  Select, 
  MenuItem, 
  CircularProgress, 
  Button, 
  Paper, 
  Alert, 
  Snackbar,
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Card,
  CardContent
} from '@mui/material';

// Create a modern, high-end dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6', // Violet
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#06b6d4', // Cyan
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#0b0f19', // Premium deep dark blue/black
      paper: '#111827', // Rich dark grey/blue
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Outfit", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
  },
});

function MainApp() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${apiBaseUrl}/api/generate`, {
        emailContent,
        tone: tone === 'None' || tone === '' ? '' : tone
      });
      
      if (typeof response.data === 'string' && response.data.startsWith('Error generating email:')) {
        throw new Error(response.data);
      }
      
      setGeneratedReply(response.data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend server. Please verify the Spring Boot backend is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header section with gradient typography */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            fontWeight: 800,
            mb: 1
          }}
        >
          AI Email Reply Generator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Instantly generate professional, polite, and contextual replies to any email using advanced AI models.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: Inputs */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%', 
              background: 'linear-gradient(180deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.4) 100%)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h5" color="text.primary">
                Input Email Details
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                label="Original Email Content"
                placeholder="Paste the email you received here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                required
              />

              <FormControl fullWidth>
                <InputLabel id="tone-select-label">Tone (Optional)</InputLabel>
                <Select
                  labelId="tone-select-label"
                  value={tone}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Professional">💼 Professional</MenuItem>
                  <MenuItem value="Casual">😊 Casual</MenuItem>
                  <MenuItem value="Friendly">👋 Friendly</MenuItem>
                  <MenuItem value="Urgent">🚨 Urgent / Action Required</MenuItem>
                  <MenuItem value="Apologetic">🙏 Apologetic</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!emailContent.trim() || loading}
                size="large"
                sx={{ 
                  mt: 'auto',
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Generated Output */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%', 
              background: 'linear-gradient(180deg, rgba(31, 41, 55, 0.4) 0%, rgba(17, 24, 39, 0.4) 100%)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '400px'
            }}
          >
            <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" color="text.primary">
                  AI Generated Reply
                </Typography>
                {generatedReply && (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleCopy}
                    sx={{ borderRadius: 8 }}
                  >
                    Copy Text
                  </Button>
                )}
              </Box>

              {error && (
                <Alert severity="error" variant="outlined" sx={{ borderRadius: 3 }}>
                  {error}
                </Alert>
              )}

              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, py: 6, gap: 2 }}>
                  <CircularProgress color="secondary" />
                  <Typography variant="body2" color="text.secondary">
                    Drafting reply based on selected tone...
                  </Typography>
                </Box>
              ) : generatedReply ? (
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  variant="outlined"
                  value={generatedReply}
                  readOnly
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ 
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, py: 6, border: '2px dashed rgba(255, 255, 255, 0.05)', borderRadius: 4 }}>
                  <Typography variant="body1" color="text.secondary" align="center">
                    Your generated reply will appear here.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Reply copied to clipboard!"
      />
    </Container>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainApp />
    </ThemeProvider>
  );
}
