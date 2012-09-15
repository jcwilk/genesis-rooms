class Room
  SAMPLE_WOOD_V1 = [0,1,6,43,43,7,4,5,8,9,14,38,39,15,12,13,24,17,22,40,41,23,20,21,24,45,45,45,45,45,45,27,24,45,45,45,45,45,45,21,24,45,45,45,45,45,45,27,26,45,45,45,45,45,45,29,32,33,34,35,35,34,36,37]

  attr_accessor :id, :tiles_csv, :w, :h, :filename, :tile_size,
                :tilemap_tile_width, :tilemap_tile_height, :floor_index

  def self.find(_id)
    #new.tap {|r| r.id = _id }
    sample_wood
  end

  def self.sample_wood
    new.tap do |r|
      r.tiles_csv = SAMPLE_WOOD_V1
      r.w = 8
      r.h = 8
      r.filename = 'lost_garden_walls_v1.png'
      r.tile_size = 40
      r.tilemap_tile_width = 8
      r.tilemap_tile_height = 6
      r.floor_index = 42
    end
  end

  def to_json
    {
      room: {
        tiles: tiles,
        spawn: {x:tile_size*w/2, y:tile_size*h/2},
        tileDimensions: {x:tile_size, y:tile_size},
        tilemaps: [
          { 
            url: tile_url,
            components: component_definitions
          }
        ]
      }
    }
  end

  def component_definitions
    i = 0
    {}.tap do |cds|
      (0...tilemap_tile_height).each do |y|
        (0...tilemap_tile_width).each do |x|
          cds[base_filename+'_'+i.to_s] = [x,y]
          i+= 1
        end
      end
    end
  end

  def tiles
    i = 0

    tiles_csv.map do |t|
      {
        tilePos: {x: i % w, y: i / w},
        components: [base_filename+'_'+t.to_s]
      }.tap do |tile|
        tile[:components] << 'Solid' if t < floor_index
        i+= 1
      end
    end
  end

  def base_filename
    filename.gsub(/\.[^.]+$/,'')
  end

  def tile_url
    URI::HTTP.build(
      host: RoomsApi::HOSTNAME,
      port: RoomsApi::PUBLIC_PORT.to_i,
      path: ActionController::Base.helpers.image_path(filename)
    ).to_s
  end
end
