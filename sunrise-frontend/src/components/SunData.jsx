import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Alert, Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from '@mui/material'
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {format, isAfter, parseISO} from 'date-fns'
import {fetchSunData} from '../services/sunDataService'
import {formatDate, formatDateTime} from '../utils/dateFormatters'

function SunData() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const {control, handleSubmit, watch} = useForm({
        mode: 'onChange'
    })

    const startDate = watch('startDate')

    const onSubmit = async (formData) => {
        setError(null)
        try {
            const jsonData = await fetchSunData(
                formData.location,
                formatDate(formData.startDate),
                formatDate(formData.endDate)
            )
            setData(jsonData)
        } catch (err) {
            setError(err.message)
            setData(null)
        }
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
                    <TableContainer
                        component={Paper}
                        sx={{
                            mt: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2
                        }}
                    >
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>First Light</TableCell>
                                    <TableCell>Dawn</TableCell>
                                    <TableCell>Sunrise</TableCell>
                                    <TableCell>Solar Noon</TableCell>
                                    <TableCell>Sunset</TableCell>
                                    <TableCell>Dusk</TableCell>
                                    <TableCell>Last Light</TableCell>
                                    <TableCell>Golden Hour</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.data.map((day) => (
                                    <TableRow key={day.date}>
                                        <TableCell>{format(parseISO(day.date), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{day.first_light ? formatDateTime(day.first_light) : '-'}</TableCell>
                                        <TableCell>{day.dawn ? formatDateTime(day.dawn) : '-'}</TableCell>
                                        <TableCell>{day.sunrise ? formatDateTime(day.sunrise) : '-'}</TableCell>
                                        <TableCell>{day.solar_noon ? formatDateTime(day.solar_noon) : '-'}</TableCell>
                                        <TableCell>{day.sunset ? formatDateTime(day.sunset) : '-'}</TableCell>
                                        <TableCell>{day.dusk ? formatDateTime(day.dusk) : '-'}</TableCell>
                                        <TableCell>{day.last_light ? formatDateTime(day.last_light) : '-'}</TableCell>
                                        <TableCell>{day.golden_hour ? formatDateTime(day.golden_hour) : '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </LocalizationProvider>
    )
}

export default SunData