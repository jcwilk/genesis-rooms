module RoomsHelper
  def genesis_rooms_url(room_id)
    URI.parse(RoomsApi::BASE_GENESIS_URL).tap do |url|
      url.path = room_path(room_id)
    end.to_s
  end
end