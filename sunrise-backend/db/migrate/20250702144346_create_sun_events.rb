class CreateSunEvents < ActiveRecord::Migration[8.0]
  def change
    create_table :sun_events do |t|
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.date :date, null: false
      t.datetime :sunrise
      t.datetime :sunset
      t.datetime :first_light
      t.datetime :last_light
      t.datetime :dawn
      t.datetime :dusk
      t.datetime :solar_noon
      t.datetime :golden_hour

      t.timestamps
    end

    add_index :sun_events, [:latitude, :longitude, :date], unique: true
  end
end
