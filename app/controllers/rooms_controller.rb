class RoomsController < ApplicationController
  def index
    @rooms = Room.all
  end

  def new
    @room = Room.new_with_defaults
  end

  def create
    room = Room.create!(params[:room])
    redirect_to room_path(room)
  end

  def edit
    @room = Room.find(params[:id])
  end

  def show
    render json: Room.find(params[:id]).to_json
  end
end
