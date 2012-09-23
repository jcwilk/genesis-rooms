class Tileset
  attr_accessor :url, :tile_size, :tile_width,
                :tile_height, :floor_index, :name

  def self.all
    [new_with_defaults]
  end

  def self.new_with_defaults
    new.tap do |r|
      r.url = URI::HTTP.build(
        host: RoomsApi::HOSTNAME,
        port: RoomsApi::PUBLIC_PORT.to_i,
        path: ActionController::Base.helpers.image_path('lost_garden_walls_v1.png')
      ).to_s

      r.tile_size = 40
      r.tile_width = 8
      r.tile_height = 6
      r.floor_index = 42
      r.name = 'wood_v2'
    end
  end
end