class CreateSunEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :sun_events do |t|
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.date :date, null: false
      t.datetime :sunrise
      t.datetime :sunset
      t.datetime :golden_hour_morning_start
      t.datetime :golden_hour_morning_end
      t.datetime :golden_hour_evening_start
      t.datetime :golden_hour_evening_end

      t.timestamps
    end

    add_index :sun_events, [:latitude, :longitude, :date], unique: true
  end
end