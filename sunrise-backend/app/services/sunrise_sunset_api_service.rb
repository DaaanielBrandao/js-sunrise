class SunriseSunsetApiService
  include HTTParty
  base_uri 'https://api.sunrisesunset.io'

  def initialize(lat:, lng:, start_date: nil, end_date: nil)
    @lat = lat
    @lng = lng
    @start_date = start_date
    @end_date = end_date
  end

  def fetch_data
    response = self.class.get('/json', query: query_params)
    JSON.parse(response.body)
  end

  private

  def query_params
    {
      lat: @lat,
      lng: @lng,
      date_start: @start_date,
      date_end: @end_date
    }.compact
  end
end