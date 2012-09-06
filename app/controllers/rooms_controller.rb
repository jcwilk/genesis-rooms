class RoomsController < ApplicationController
  def index
  end

  def show
    #TODO: make this non-fake data and put it
    # somewhere besides the controller, obv
    data = {}.tap do |d|
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
          components: ['Solid','wall_top','dirt'],
          tilePos:    {x:x,y:0}
        }
        tiles << {
          components: ['Solid','wall_bottom','dirt'],
          tilePos:    {x:x,y:10}
        }
      end

      (1..9).each do |y|
        tiles << {
          components: ['Solid','wall_top','dirt'],
          tilePos:    {x:0,y:y}
        }
        tiles << {
          components: ['Solid','wall_bottom','dirt'],
          tilePos:    {x:12,y:y}
        }
      end
      d[:room] = {tiles: tiles}
    end
    render json: data
  end
end
