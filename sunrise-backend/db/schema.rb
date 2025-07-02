# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_02_144346) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "cities", force: :cascade do |t|
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_cities_on_name", unique: true
  end

  create_table "sun_events", force: :cascade do |t|
    t.float "latitude", null: false
    t.float "longitude", null: false
    t.date "date", null: false
    t.datetime "sunrise"
    t.datetime "sunset"
    t.datetime "first_light"
    t.datetime "last_light"
    t.datetime "dawn"
    t.datetime "dusk"
    t.datetime "solar_noon"
    t.datetime "golden_hour"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["latitude", "longitude", "date"], name: "index_sun_events_on_latitude_and_longitude_and_date", unique: true
  end
end
