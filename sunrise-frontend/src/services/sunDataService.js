export const fetchSunData = async (location, startDate, endDate) => {
    const params = new URLSearchParams({
        location,
        start_date: startDate,
        end_date: endDate
    })

    const response = await fetch(`http://localhost:3000/sun_data?${params}`)
    const data = await response.json()

    if (data.error) {
        throw new Error(data.error)
    }

    return data
}