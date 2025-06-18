import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  Divider,
  Alert,
} from '@mui/material';
import { Search, Add, Psychology } from '@mui/icons-material';
import { EnhancedOil } from '../types/EnhancedOil';
import { enhancedOilsData } from '../data/enhancedOils';
import { EffectsCalculator } from '../utils/effectsCalculator';
import { OilCard } from './OilCard';

interface EffectsFinderProps {
  onAddToBlend?: (oils: EnhancedOil[]) => void;
}

export const EffectsFinder: React.FC<EffectsFinderProps> = ({ onAddToBlend }) => {
  const [selectedEffect, setSelectedEffect] = useState<string>('');
  const [combinations, setCombinations] = useState<any[]>([]);

  // Extract all unique effects from oils
  const allEffects = useMemo(() => {
    const effectsSet = new Set<string>();
    enhancedOilsData.forEach(oil => {
      oil.effects?.forEach(effect => effectsSet.add(effect));
      oil.symptoms?.forEach(symptom => effectsSet.add(symptom));
    });
    return Array.from(effectsSet).sort();
  }, []);

  const handleEffectSelect = (effect: string | null) => {
    if (effect) {
      setSelectedEffect(effect);
      const results = EffectsCalculator.findCombinationsForEffect(
        effect,
        enhancedOilsData,
        3
      );
      setCombinations(results);
    } else {
      setSelectedEffect('');
      setCombinations([]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology />
        効果から組み合わせを探す
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Search />
          <Autocomplete
            fullWidth
            options={allEffects}
            value={selectedEffect}
            onChange={(_, value) => handleEffectSelect(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="求める効果を選択"
                placeholder="例：リラクゼーション、不眠、集中力向上..."
                variant="outlined"
              />
            )}
          />
        </Box>
      </Paper>

      {selectedEffect && combinations.length === 0 && (
        <Alert severity="info">
          「{selectedEffect}」に対応する組み合わせが見つかりませんでした。
        </Alert>
      )}

      {combinations.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            「{selectedEffect}」におすすめの組み合わせ
          </Typography>
          
          <Grid container spacing={2}>
            {combinations.map((combo, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        組み合わせ {index + 1}
                      </Typography>
                      <Rating 
                        value={combo.synergy} 
                        readOnly 
                        precision={0.5}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {combo.oils.map((oil: EnhancedOil) => (
                        <Chip
                          key={oil.id}
                          label={oil.nameJa}
                          sx={{ mr: 1, mb: 1 }}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      効果スコア: {combo.effectScore.toFixed(1)}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {combo.oils.map((oil: EnhancedOil) => oil.nameJa).join('と')}
                      の組み合わせは、{selectedEffect}に対して高い効果が期待できます。
                    </Typography>

                    {/* Display other effects */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        その他の効果:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {combo.oils.flatMap((oil: EnhancedOil) => oil.effects || [])
                          .filter((effect, i, arr) => arr.indexOf(effect) === i && effect !== selectedEffect)
                          .slice(0, 5)
                          .map((effect, i) => (
                            <Chip
                              key={i}
                              label={effect}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                      </Box>
                    </Box>
                  </CardContent>
                  
                  {onAddToBlend && (
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => onAddToBlend(combo.oils)}
                      >
                        カスタムブレンドに追加
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};