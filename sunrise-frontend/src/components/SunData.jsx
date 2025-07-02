import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Alert, Box, Button, Grid, TextField} from '@mui/material'
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {isAfter, format} from 'date-fns'
import {fetchSunData} from '../services/sunDataService'
import {formatDate} from '../utils/dateFormatters'
import SunDataTable from './SunDataTable'
import SunChart from './SunChart'
import SunDataControls, { AVAILABLE_FIELDS } from './SunDataControls'

function SunData() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [activeFields, setActiveFields] = useState(
        AVAILABLE_FIELDS.map(field => field.id)
    )
    const {control, handleSubmit, watch} = useForm({
        mode: 'onChange'
    })

    const startDate = watch('startDate')

    const onSubmit = async (formData) => {
        setError(null)
        try {
            const jsonData = await fetchSunData(
                formData.location,
                format(formData.startDate, 'yyyy-MM-dd'),
                format(formData.endDate, 'yyyy-MM-dd')
            )
            setData(jsonData)
        } catch (err) {
            setError(err.message)
            setData(null)
        }
    }

    const handleFieldToggle = (fieldId) => {
        setActiveFields(prev => 
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        )
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(160deg, #ffecd2 0%, #fcb69f 100%)',
                    position: 'fixed',
                    width: '100%',
                    top: 0,
                    left: 0,
                    zIndex: -1
                }}
            />
            <Box sx={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: 3,
                position: 'relative'
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={9}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="location"
                                        control={control}
                                        defaultValue=""
                                        rules={{required: 'Location is required'}}
                                        render={({field, fieldState: {error}}) => (
                                            <TextField
                                                {...field}
                                                label="Location"
                                                fullWidth
                                                error={!!error}
                                                helperText={error?.message}
                                                sx={{backgroundColor: 'white'}}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        rules={{required: 'Start date is required'}}
                                        render={({field, fieldState: {error}}) => (
                                            <DatePicker
                                                {...field}
                                                label="Start Date"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!error,
                                                        helperText: error?.message,
                                                        sx: {backgroundColor: 'white'}
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        rules={{
                                            required: 'End date is required',
                                            validate: (value) =>
                                                !startDate || isAfter(value, startDate) || 'End date must be after start date'
                                        }}
                                        render={({field, fieldState: {error}}) => (
                                            <DatePicker
                                                {...field}
                                                label="End Date"
                                                minDate={startDate}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!error,
                                                        helperText: error?.message,
                                                        sx: {backgroundColor: 'white'}
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        sx={{py: 1.5}}
                                    >
                                        Get Sun Data
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>

                        {error && (
                            <Alert severity="error" sx={{mt: 2}}>
                                {error}
                            </Alert>
                        )}

                        {data && (
                            <Box sx={{ 
                                mt: 3, 
                                p: 2, 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: 2
                            }}>
                                <SunChart data={data} activeFields={activeFields} />
                            </Box>
                        )}

                        <SunDataTable data={data} activeFields={activeFields} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SunDataControls 
                            activeFields={activeFields}
                            onFieldToggle={handleFieldToggle}
                        />
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    )
}

export default SunData