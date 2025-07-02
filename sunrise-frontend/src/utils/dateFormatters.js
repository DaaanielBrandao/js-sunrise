import { format, parseISO } from 'date-fns'

export const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return ''
    return format(parseISO(dateTimeStr), 'HH:mm')
}

export const formatDate = (dateStr) => {
    return format(dateStr, 'yyyy-MM-dd')
}