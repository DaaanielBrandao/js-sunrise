// src/components/SunData.jsx
import { useState, useEffect } from 'react'

function SunData() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('http://localhost:3000/sun_data?location=Lisbon&start_date=2024-06-01&end_date=2024-06-03')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error:', error))
    }, [])

    if (!data) return <div>Loading...</div>

    return (
        <div className="sun-data">
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default SunData