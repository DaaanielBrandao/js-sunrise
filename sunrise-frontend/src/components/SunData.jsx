import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, parseISO, isAfter } from 'date-fns'

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return ''
    return format(parseISO(dateTimeStr), 'HH:mm')
}

function SunData() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    })

    const startDate = watch('startDate')

    const onSubmit = async (formData) => {
        setError(null)
        const params = new URLSearchParams({
            location: formData.location,
            start_date: format(formData.startDate, 'yyyy-MM-dd'),
            end_date: format(formData.endDate, 'yyyy-MM-dd')
        })

        try {
            const response = await fetch(`http://localhost:3000/sun_data?${params}`)
            const jsonData = await response.json()

            if (jsonData.error) {
                setError(jsonData.error)
                setData(null)
            } else {
                setData(jsonData)
            }
        } catch (error) {
            setError('Failed to fetch data')
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
                                    <TableCell>Sunrise</TableCell>
                                    <TableCell>Sunset</TableCell>
                                    <TableCell>Golden Hour Morning</TableCell>
                                    <TableCell>Golden Hour Evening</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.data.map((day) => (
                                    <TableRow key={day.date}>
                                        <TableCell>{format(parseISO(day.date), 'yyyy-MM-dd')}</TableCell>
                                        <TableCell>{formatDateTime(day.sunrise)}</TableCell>
                                        <TableCell>{formatDateTime(day.sunset)}</TableCell>
                                        <TableCell>
                                            {formatDateTime(day.golden_hour_morning_start)} - {formatDateTime(day.golden_hour_morning_end)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDateTime(day.golden_hour_evening_start)} - {formatDateTime(day.golden_hour_evening_end)}
                                        </TableCell>
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