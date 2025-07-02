import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { parseISO, isAfter, format } from 'date-fns'
import { fetchSunData } from '../services/sunDataService'
import { formatDateTime, formatDate } from '../utils/dateFormatters'

function SunData() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const { control, handleSubmit, watch } = useForm({
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
            <div className="sun-data">
                <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '2rem' }}>
                    <Controller
                        name="location"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Location is required' }}
                        render={({ field, fieldState: { error } }) => (
                            <TextField
                                {...field}
                                label="Location"
                                margin="normal"
                                fullWidth
                                error={!!error}
                                helperText={error?.message}
                            />
                        )}
                    />
                    <Controller
                        name="startDate"
                        control={control}
                        rules={{ required: 'Start date is required' }}
                        render={({ field, fieldState: { error } }) => (
                            <DatePicker
                                {...field}
                                label="Start Date"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal',
                                        error: !!error,
                                        helperText: error?.message
                                    }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        rules={{
                            required: 'End date is required',
                            validate: (value) =>
                                !startDate || isAfter(value, startDate) || 'End date must be after start date'
                        }}
                        render={({ field, fieldState: { error } }) => (
                            <DatePicker
                                {...field}
                                label="End Date"
                                minDate={startDate}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal',
                                        error: !!error,
                                        helperText: error?.message
                                    }
                                }}
                            />
                        )}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: '1rem' }}
                    >
                        Get Sun Data
                    </Button>
                </form>

                {data && (
                    <TableContainer component={Paper}>
                        <Table>
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
            </div>
        </LocalizationProvider>
    )
}

export default SunData