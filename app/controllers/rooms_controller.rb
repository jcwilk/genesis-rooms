class RoomsController < ApplicationController
  caches_page :merged_image, expires_in: 5.minutes

  def index
    @rooms = Room.desc(:id).page(params[:page]).per(10)
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

  def merged_image
    img = Room.find(params[:id]).to_merged_image
    response.headers["Content-type"] = img.mime_type
    render :text => img.to_blob
  end

  private

  def genesis_rooms_url(room_id)
    URI.parse(RoomsApi::BASE_GENESIS_URL).tap do |url|
      url.path = room_path(room_id)
    end.to_s
  end
  helper_method :genesis_rooms_url
end
