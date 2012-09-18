class Room
  include Mongoid::Document

  SAMPLE_WOOD_V1 = [0,1,6,43,43,7,4,5,8,9,14,38,39,15,12,13,24,17,22,40,41,23,20,21,24,45,45,45,45,45,45,27,24,45,45,45,45,45,45,21,24,45,45,45,45,45,45,27,26,45,45,45,45,45,45,29,32,33,34,35,35,34,36,37]

  field :tiles_csv, type: String
  field :w, type: Integer

  #attr_accessor :id

  delegate :filename, :tile_size, :tilemap_tile_width, :tilemap_tile_height,
           :floor_index, to: :tileset

  def self.new_with_defaults
    sample_wood
  end

  def self.sample_wood
    new.tap do |r|
      r.id = 1
      r.tiles_csv = SAMPLE_WOOD_V1
      r.w = 8
    end
  end

  def parsed_tiles_csv
    JSON.parse(tiles_csv)
  end

  def h
    ((parsed_tiles_csv.length+1)/w).to_i
  end

  def tileset
    Tileset.new_with_defaults
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

    parsed_tiles_csv.map do |t|
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
