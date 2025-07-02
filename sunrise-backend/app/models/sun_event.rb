class SunEvent < ApplicationRecord
  validates :latitude, :longitude, :date, :sunrise, :sunset, presence: true
  validates :date, uniqueness: { scope: [:latitude, :longitude] }

  def golden_hour
    {
      morning: {
        start: golden_hour_morning_start,
        end: golden_hour_morning_end
      },
      evening: {
        start: golden_hour_evening_start,
        end: golden_hour_evening_end
      }
    }
  end

  def golden_hour=(value)
    self.golden_hour_morning_start = value.dig(:morning, :start)
    self.golden_hour_morning_end   = value.dig(:morning, :end)
    self.golden_hour_evening_start = value.dig(:evening, :start)
    self.golden_hour_evening_end   = value.dig(:evening, :end)
  end
end