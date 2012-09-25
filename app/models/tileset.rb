class Tileset
  attr_accessor :filename, :tile_size, :tile_width,
                :tile_height, :floor_index

  def self.all
    [lost_garden_walls_v2,water_and_ice_v2]
  end

  def self.find_by_name(name)
    all.find {|t| t.name == name }
  end

  def self.size_map
    {}.tap do |m|
      all.each do |t|
        m[t.name] = t.tile_size
      end
    end
  end

  def self.url_map
    {}.tap do |m|
      all.each do |t|
        m[t.name] = t.url
      end
    end
  end

  def self.new_with_defaults
    lost_garden_walls_v2
  end

  # http://www.lostgarden.com
  def self.lost_garden_walls_v2
    new.tap do |r|
      r.filename = 'lost_garden_walls_v2.png'
      r.tile_size = 40
      r.tile_width = 8
      r.tile_height = 6
      r.floor_index = 42
    end
  end

  # http://vxresource.files.wordpress.com/2010/02/tilea1.png
  # http://vxresource.wordpress.com/2010/02/10/first-set-of-mapz/
  # Looks like the authors weren't credited by the blog, if you
  # own this or know the author and want them credited please
  # let me  know!
  def self.water_and_ice_v2
    new.tap do |r|
      r.filename = 'water_and_ice_v2.png'
      r.tile_size = 32
      r.tile_width = 16
      r.tile_height = 12
      r.floor_index = 180
    end
  end

  def name
    filename.gsub(/[.][^.][^.]+$/,'')
  end

  def url
    filename_to_url(filename)
  end

  private

  def filename_to_url(filename)
    URI::HTTP.build(
      host: RoomsApi::HOSTNAME,
      port: RoomsApi::PUBLIC_PORT.to_i,
      path: ActionController::Base.helpers.image_path(filename)
    ).to_s
  end
end