import { Box, Checkbox, FormControlLabel, FormGroup, Paper, Typography } from '@mui/material'

const AVAILABLE_FIELDS = [
    { id: 'first_light', label: 'First Light', color: '#8884d8' },
    { id: 'dawn', label: 'Dawn', color: '#82ca9d' },
    { id: 'sunrise', label: 'Sunrise', color: '#ff7300' },
    { id: 'solar_noon', label: 'Solar Noon', color: '#ffd700' },
    { id: 'sunset', label: 'Sunset', color: '#ff4444' },
    { id: 'dusk', label: 'Dusk', color: '#9932cc' },
    { id: 'last_light', label: 'Last Light', color: '#4b0082' },
    { id: 'golden_hour', label: 'Golden Hour', color: '#daa520' }
]

function SunDataControls({ activeFields, onFieldToggle }) {
    return (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h6" gutterBottom>
                Display Options
            </Typography>
            <FormGroup>
                {AVAILABLE_FIELDS.map(field => (
                    <FormControlLabel
                        key={field.id}
                        control={
                            <Checkbox
                                checked={activeFields.includes(field.id)}
                                onChange={() => onFieldToggle(field.id)}
                                sx={{
                                    '&.Mui-checked': {
                                        color: field.color
                                    }
                                }}
                            />
                        }
                        label={field.label}
                    />
                ))}
            </FormGroup>
        </Paper>
    )
}

export default SunDataControls
export { AVAILABLE_FIELDS }