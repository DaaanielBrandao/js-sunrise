class SunEvent < ApplicationRecord
  validates :latitude, :longitude, :date, presence: true
  validates :date, uniqueness: { scope: [:latitude, :longitude] }
end