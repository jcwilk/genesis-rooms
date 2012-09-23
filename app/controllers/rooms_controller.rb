class RoomsController < ApplicationController
  def index
    @rooms = Room.all.reverse
  end

  def new
    @room = Room.new
  end

  def create
    room = Room.create!(params[:room])
    redirect_to genesis_rooms_url(room.id)
  end

  def edit
    @room = Room.find(params[:id])
  end

  def show
    render json: Room.find(params[:id]).to_json
  end

  private

  def genesis_rooms_url(room_id)
    URI.parse(RoomsApi::BASE_GENESIS_URL).tap do |url|
      url.path = room_path(room_id)
    end.to_s
  end
  helper_method :genesis_rooms_url
end
