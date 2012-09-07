class Room
  def self.first
    new
  end

  def to_json
    tiles = []

    (1..11).each do |x|
      (1..9).each do |y|
        tiles << {
          components: ['grass'+(rand*4+1).floor.to_s],
          tilePos:    {x:x,y:y}
        }
      end
    end

    (0..12).each do |x|
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:x,y:0}
      }
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:x,y:10}
      }
    end

    (1..9).each do |y|
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:0,y:y}
      }
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:12,y:y}
      }
    end

    return {
      room: {
        tiles: tiles,
        tilemaps: [
          { 
            url: tile_url,
            components: {
              grass1: [0,0],
              grass2: [1,0],
              grass3: [2,0],
              grass4: [3,0],
              dirt: [8,0]
            }
          }
        ]
      }
    }
  end

  def tile_url
    URI::HTTP.build(
      host: RoomsApi::HOSTNAME,
      port: RoomsApi::PORT,
      path: ActionController::Base.helpers.image_path('tiles.png')
    ).to_s
  end
end
