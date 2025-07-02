namespace :cities do
  desc "Load city data from CSV"
  task load: :environment do
    loader = CityDataLoader.new(Rails.root.join("lib/csv/cities.csv"))
    loader.load!
    puts "Cities loaded!"
  end
end