import { parseISO } from 'date-fns'
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend 
} from 'recharts'
import { AVAILABLE_FIELDS } from './SunDataControls'
import { formatTime } from '../utils/dateFormatters'

function SunChart({ data, activeFields }) {
    if (!data) return null

    const chartData = data.data.map(day => ({
        date: parseISO(day.date).toLocaleDateString(),
        ...Object.fromEntries(
            AVAILABLE_FIELDS
                .filter(field => activeFields.includes(field.id))
                .map(field => [
                    field.id,
                    day[field.id] 
                        ? new Date(day[field.id]).getHours() + 
                          new Date(day[field.id]).getMinutes() / 60
                        : null
                ])
        )
    }))

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null

        return (
            <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px'
            }}>
                <p style={{ margin: '0 0 5px 0' }}><strong>{label}</strong></p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ 
                        margin: '2px 0',
                        color: entry.color
                    }}>
                        {entry.name}: {formatTime(entry.value)}
                    </p>
                ))}
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={chartData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                />
                <YAxis 
                    tickFormatter={formatTime}
                    label={{ 
                        value: 'Time', 
                        angle: -90, 
                        position: 'insideLeft' 
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {AVAILABLE_FIELDS.map(field => 
                    activeFields.includes(field.id) && (
                        <Line
                            key={field.id}
                            type="monotone"
                            dataKey={field.id}
                            stroke={field.color}
                            name={field.label}
                            dot={true}
                        />
                    )
                )}
            </LineChart>
        </ResponsiveContainer>
    )
}

export default SunChart