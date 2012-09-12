class RoomsController < ApplicationController
  def index
  end

  def show
    render json: Room.find(params[:id]).to_json
  end
end
