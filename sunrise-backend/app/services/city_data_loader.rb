require 'csv'

class CityDataLoader
  def initialize(csv_path)
    @csv_path = csv_path
  end

  def load!
    cities = []
    CSV.foreach(@csv_path, headers: true) do |row|
      cities << {
        name: row["city"],
        latitude: row["lat"].to_f,
        longitude: row["lng"].to_f,
        created_at: Time.current,
        updated_at: Time.current
      }
    end
    City.insert_all(cities, unique_by: :name)
  end


  def all_cities
    City.all
  end

  def find_by_name(name)
    City.find_by(name: name)
  end
end
