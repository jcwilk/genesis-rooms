class RoomsController < ApplicationController
  def index
  end

  def show
    render json: Room.first.to_json
  end
end
