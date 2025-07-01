class SunDataController < ApplicationController
  def index
    location = params[:location]
    start_date = Date.parse(params[:start_date])
    end_date = Date.parse(params[:end_date])

    #temp
    lat = 38.907192
    lng = -77.036873

    api_service = SunriseSunsetApiService.new(
      lat: lat,
      lng: lng,
      start_date: start_date,
      end_date: end_date
    )

    api_response = api_service.fetch_data

    if api_response["status"] == "OK"
      render json: format_response(api_response)
    else
      render json: { error: "API Error" }, status: :service_unavailable
    end
  rescue ArgumentError
    render json: { error: "Invalid parameters" }, status: :bad_request
  end

  private def format_response(api_response)
    results = api_response["results"]
    {
      from: results.first["date"],
      to: results.last["date"],
      data: results.map do |day|
        {
          date: day["date"],
          sunrise: day["sunrise"],
          sunset: day["sunset"],
          golden_hour: {
            morning: "#{day['dawn']} - #{day['sunrise']}",
            evening: "#{day['golden_hour']} - #{day['dusk']}"
          }
        }
      end
    }
  end
end
