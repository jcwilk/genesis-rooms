class Room
  attr_accessor :id

  def self.find(_id)
    new.tap {|r| r.id = _id }
  end

  def w
    id.to_i % 12 + 4
  end

  def h
    (id.to_f / 12).floor % 12 + 4
  end

  def to_json
    tiles = []

    (1...w).each do |x|
      (1...h).each do |y|
        tiles << {
          components: ['grass'+(((x*y)**id.to_i)%4+1).floor.to_s],
          tilePos:    {x:x,y:y}
        }
      end
    end

    (0..w).each do |x|
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:x,y:0}
      }
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:x,y:h}
      }
    end

    (1..h).each do |y|
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:0,y:y}
      }
      tiles << {
        components: ['Solid','dirt'],
        tilePos:    {x:w,y:y}
      }
    end

    return {
      room: {
        tiles: tiles,
        spawn: {x:32*w/2, y:32*h/2},
        tile_dimensions: {x:32, y:32},
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
      port: RoomsApi::PUBLIC_PORT.to_i,
      path: ActionController::Base.helpers.image_path('tiles.png')
    ).to_s
  end
end
