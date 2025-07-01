class SunDataController < ApplicationController
  def index
    location = params[:location]
    start_date = Date.parse(params[:start_date])
    end_date = Date.parse(params[:end_date])

    days = (start_date..end_date).map do |date|
      {
        date: date,
        location: location,
        sunrise: "06:00",
        sunset: "20:30",
        golden_hour: {
          morning: "05:30 - 06:30",
          evening: "19:30 - 20:30"
        }
      }
    end

    render json: {
      location: location,
      from: start_date,
      to: end_date,
      data: days
    }
  rescue ArgumentError
    render json: { error: "Invalid dates" }, status: :bad_request
  end
end
