import { format, parseISO } from 'date-fns'

export const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return ''
    return format(parseISO(dateTimeStr), 'HH:mm')
}

export const formatDate = (dateStr) => {
    return format(dateStr, 'yyyy-MM-dd')
}

export const formatTime = (decimalHours) => {
    if (decimalHours === null || decimalHours === undefined) return '-'
    const hours = Math.floor(decimalHours)
    const minutes = Math.round((decimalHours - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}