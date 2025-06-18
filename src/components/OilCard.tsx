import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { EnhancedOil } from '../types/EnhancedOil';

interface OilCardProps {
  oil: EnhancedOil;
  onClick?: () => void;
}

export const OilCard: React.FC<OilCardProps> = ({ oil, onClick }) => {
  return (
    <Card onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {oil.nameJa}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {oil.description}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {oil.effects?.slice(0, 3).map((effect, index) => (
            <Chip key={index} label={effect} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};