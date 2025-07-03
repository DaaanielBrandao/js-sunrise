class SunDataController < ApplicationController
  def index
    validate_params

    sun_events = fetch_sun_events

    render json: {
      from: params[:start_date],
      to: params[:end_date],
      data: sun_events
    }
  rescue ArgumentError
    render json: { error: "Invalid parameters" }, status: :bad_request
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Location not found" }, status: :not_found
  end

  private

  def validate_params
    @start_date = Date.parse(params[:start_date])
    @end_date = Date.parse(params[:end_date])
    @city = City.where("name ILIKE ?", params[:location]).first!
    @lat = @city.latitude
    @lng = @city.longitude
    raise ArgumentError if @start_date > @end_date
    raise ArgumentError if @end_date - @start_date > 30
  end

  def fetch_sun_events
    date_range = (@start_date..@end_date).to_a
    existing_events = SunEvent.where(
      latitude: @lat,
      longitude: @lng,
      date: date_range
    ).order(:date)

    return existing_events if existing_events.count == date_range.size

    missing_dates = find_missing_dates(date_range, existing_events)
    fetch_and_save_missing_dates(missing_dates) if missing_dates.any?

    SunEvent.where(
      latitude: @lat,
      longitude: @lng,
      date: date_range
    ).order(:date)
  end

  def find_missing_dates(date_range, existing_events)
    existing_dates = existing_events.pluck(:date)
    return date_range - existing_dates
  end

  def fetch_and_save_missing_dates(missing_dates)
    api_service = SunriseSunsetApiService.new(
      lat: @lat,
      lng: @lng,
      start_date: missing_dates.first,
      end_date: missing_dates.last
    )

    response = api_service.fetch_data
    return unless response["status"] == "OK"

    response["results"].each do |data|
      unless SunEvent.exists?(latitude: @lat, longitude: @lng, date: data["date"])
        SunEvent.create!(
          latitude: @lat,
          longitude: @lng,
          date: data["date"],
          sunrise: data["sunrise"],
          sunset: data["sunset"],
          first_light: data["first_light"],
          last_light: data["last_light"],
          dawn: data["dawn"],
          dusk: data["dusk"],
          solar_noon: data["solar_noon"],
          golden_hour: data["golden_hour"],
          )
      end
    end
  end
end
