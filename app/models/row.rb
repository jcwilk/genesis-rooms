class Row < ActiveRecord::Base
  belongs_to :room

  serialize :spots, Array
end
