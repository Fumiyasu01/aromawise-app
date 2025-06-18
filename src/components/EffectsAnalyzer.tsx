import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
  LinearProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  Card,
  CardContent,
} from '@mui/material';
import { ExpandMore, ExpandLess, Psychology, Star } from '@mui/icons-material';
import { EnhancedOil } from '../types/EnhancedOil';
import { EffectsCalculator, CombinationEffectAnalysis } from '../utils/effectsCalculator';

interface EffectsAnalyzerProps {
  selectedOils: EnhancedOil[];
  compact?: boolean;
}

export const EffectsAnalyzer: React.FC<EffectsAnalyzerProps> = ({ selectedOils, compact = false }) => {
  const [analysis, setAnalysis] = useState<CombinationEffectAnalysis | null>(null);
  const [expanded, setExpanded] = useState(!compact);

  useEffect(() => {
    if (selectedOils.length > 0) {
      const result = EffectsCalculator.analyzeCombination(selectedOils);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [selectedOils]);

  if (!analysis || selectedOils.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Psychology sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
        <Typography variant="body2">
          オイルを選択すると組み合わせ効果が表示されます
        </Typography>
      </Box>
    );
  }

  const getSynergyColor = (synergy: number) => {
    if (synergy >= 4.5) return 'success';
    if (synergy >= 3.5) return 'primary';
    if (synergy >= 2.5) return 'warning';
    return 'error';
  };

  const getSynergyLabel = (synergy: number) => {
    if (synergy >= 4.5) return '非常に良い';
    if (synergy >= 3.5) return '良い';
    if (synergy >= 2.5) return '普通';
    return '要注意';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {compact && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              組み合わせ効果分析
            </Typography>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        )}

        <Collapse in={expanded}>
          {/* 相性スコア */}
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Star sx={{ mr: 1, color: getSynergyColor(analysis.overallSynergy) + '.main' }} />
              <Typography variant="subtitle2" fontWeight="bold">
                相性スコア
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant="determinate"
                value={(analysis.overallSynergy / 5) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  flexGrow: 1,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: getSynergyColor(analysis.overallSynergy) + '.main'
                  }
                }}
              />
              <Chip
                label={`${analysis.overallSynergy.toFixed(1)} / 5.0 (${getSynergyLabel(analysis.overallSynergy)})`}
                color={getSynergyColor(analysis.overallSynergy)}
                size="small"
              />
            </Box>
          </Paper>

          {/* 主要な効果 */}
          {analysis.primaryEffects.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                期待される主な効果
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysis.primaryEffects.map((effect, index) => (
                  <Tooltip
                    key={index}
                    title={`${effect.contributingOils.join('、')} による効果`}
                  >
                    <Chip
                      label={effect.effect}
                      color="primary"
                      size="small"
                      sx={{
                        fontWeight: effect.score > 3 ? 'bold' : 'normal',
                        '& .MuiChip-label': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}

          {/* 症状への効果 */}
          {analysis.symptomRelief.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                改善が期待される症状
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysis.symptomRelief.map((symptom, index) => (
                  <Tooltip
                    key={index}
                    title={`${symptom.contributingOils.join('、')} による改善効果`}
                  >
                    <Chip
                      label={symptom.effect}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          )}

          {/* 副次的な効果 */}
          {analysis.secondaryEffects.length > 0 && !compact && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                その他の効果
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {analysis.secondaryEffects.map((effect, index) => (
                  <Chip
                    key={index}
                    label={effect.effect}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* 警告 */}
          {analysis.warnings.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {analysis.warnings.map((warning, index) => (
                <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                  {warning}
                </Alert>
              ))}
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};