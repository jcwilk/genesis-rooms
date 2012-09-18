class Tileset
  attr_accessor :filename, :tile_size, :tilemap_tile_width,
                :tilemap_tile_height, :floor_index

  def self.all
    {'Wood v2' => 'lost_garden_walls_v1.png'}
  end

  def self.new_with_defaults
    new.tap do |r|
      r.filename = 'lost_garden_walls_v1.png'
      r.tile_size = 40
      r.tilemap_tile_width = 8
      r.tilemap_tile_height = 6
      r.floor_index = 42
    end
  end
end