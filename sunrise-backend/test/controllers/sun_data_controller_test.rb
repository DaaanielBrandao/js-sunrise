require "test_helper"

class SunDataControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get sun_data_index_url
    assert_response :success
  end
end
