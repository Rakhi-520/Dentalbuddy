import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Box sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: '#fefefe' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Terms and Conditions
        </Typography>

        <Typography variant="body1" paragraph>
          DentalBuddy is a supportive tool intended solely for use by licensed medical 
          and dental professionals.
          By using this application, you agree to the following terms:
        </Typography>

        <Typography variant="body2" paragraph>
          1. <strong>Reference Only:</strong> The AI Assistant is not a certified medical device or 
          a substitute for professional consultation. It is intended to support, not replace, 
          clinical decision-making.
        </Typography>
        <Typography variant="body2" paragraph>
          2. <strong>Possibility of Error:</strong> The AI may generate inaccurate or incomplete 
          responses. Always verify critical medical or dental advice independently.
        </Typography>
        <Typography variant="body2" paragraph>
          3. <strong>Data Privacy:</strong> You are responsible for ensuring that any uploaded files 
          do not contain sensitive personal health information (PHI) unless encrypted and permitted under your local laws.
        </Typography>
        <Typography variant="body2" paragraph>
          4. <strong>No Misuse Allowed:</strong> The app must not be used for illegal, unethical,
           or unauthorized purposes. Misuse of the platform may lead to termination of access.
        </Typography>
        <Typography variant="body2" paragraph>
          5. <strong>AI Limitations:</strong> The AI does not replace diagnostic tools, consent 
          procedures, or patient communication. Use outputs with discretion.
        </Typography>
        <Typography variant="body2" paragraph>
          6. <strong>Liability:</strong> The creators of DentalBuddy are not liable for any clinical 
          or legal consequences resulting from reliance on AI-generated content.
        </Typography>

        <Typography variant="body2" paragraph sx={{ mt: 3 }}>
          By continuing to use this application, you acknowledge that you understand and accept 
          these conditions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TermsAndConditions;
