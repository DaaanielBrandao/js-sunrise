import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { formatDateTime } from '../utils/dateFormatters'
import { AVAILABLE_FIELDS } from './SunDataControls'

function SunDataTable({ data, activeFields }) {
    if (!data) return null

    const activeColumns = ['date', ...activeFields]

    return (
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
                        {AVAILABLE_FIELDS.map(field => 
                            activeFields.includes(field.id) && (
                                <TableCell key={field.id}>{field.label}</TableCell>
                            )
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.data.map((day) => (
                        <TableRow key={day.date}>
                            <TableCell>{format(parseISO(day.date), 'yyyy-MM-dd')}</TableCell>
                            {AVAILABLE_FIELDS.map(field => 
                                activeFields.includes(field.id) && (
                                    <TableCell key={field.id}>
                                        {day[field.id] ? formatDateTime(day[field.id]) : '-'}
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default SunDataTable