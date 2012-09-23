require 'spec_helper'

describe Room do
  let!(:room) { Room.new }
  let!(:tileset) do
    mock.tap {|t| room.stub(tileset: t) }
  end

  subject { room }

  describe '#tiles' do
    subject { room.tiles }

    context "with a tileset name of 'fudge_muffin'" do
      before { tileset.stub(name: 'fudge_muffin') }

      context 'with a width of 2' do
        before do
          room.w = 2
        end

        context 'with a floor_index of 2' do
          before { tileset.stub(floor_index: 2) }

          context 'with a tiles_csv of [5,1,3,2]' do
            before { room.tiles_csv = [5,1,3,2] }

            its(:size) { should eql(4) }

            context 'for the first tile' do
              subject { room.tiles.first }

              its([:tilePos]) { should == {x:0,y:0} }
              its([:components]) { should == ['fudge_muffin_5'] }
            end

            context 'for the second tile' do
              subject { room.tiles[1] }

              its([:tilePos]) { should == {x:1,y:0} }
              its([:components]) { should == ['fudge_muffin_1','Solid'] }
            end

            context 'for the third tile' do
              subject { room.tiles[2] }

              its([:tilePos]) { should == {x:0,y:1} }
              its([:components]) { should == ['fudge_muffin_3'] }
            end

            context 'for the fourth tile' do
              subject { room.tiles[3] }

              its([:tilePos]) { should == {x:1,y:1} }
              its([:components]) { should == ['fudge_muffin_2'] }
            end
          end
        end
      end
    end
  end

  describe '#component_definitions' do
    subject { room.component_definitions }

    context 'with a tileset width and height of 2' do
      before do
        tileset.stub(tile_width: 2, tile_height: 2)
      end

      context "with a tileset name of 'porkchop_sandwiches'" do
        before { tileset.stub(name: 'porkchop_sandwiches') }

        its('keys.size') { should eql(4) }
        its(['porkchop_sandwiches_0']) { should == [0,0] }
        its(['porkchop_sandwiches_1']) { should == [1,0] }
        its(['porkchop_sandwiches_2']) { should == [0,1] }
        its(['porkchop_sandwiches_3']) { should == [1,1] }
      end
    end
  end

  describe 'for the sample_wood example' do
    subject { Room.sample_wood }

    its(:w) { should eql(8) }
    its(:h) { should eql(8) }
    its(:tileset_tile_size) { should eql(40) }
    its(:tileset_name) { should eql('wood_v2') }
  end
end