require 'spec_helper.rb'

describe RoomsController, type: :controller do
  let(:room_id) { 10 }
  let(:room) { mock id: room_id }

  describe "show" do
    def do_get
      get :show, id: room_id
    end

    before do
      do_get
    end

    describe "to a filled out room" do
      let(:room_json) { MultiJson.decode(response.body, symbolize_keys: true)[:room] }

      describe "for each tile" do
        let(:tile) { room_json[:tiles].first }

        describe 'for the tilePos' do
          subject { tile[:tilePos] }

          its([:x]) { should be_a(Fixnum) }
          its([:y]) { should be_a(Fixnum) }
        end

        describe 'components' do
          subject { tile[:components] }

          it { should be_an(Array) }

          it 'should be full of strings' do
            subject.map(&:class).uniq.should == [String]
          end
        end
      end

      describe "for each tilemap" do
        let(:tilemap) { room_json[:tilemaps].first }

        describe 'for the url' do
          subject { URI.parse(tilemap[:url]) }

          it { should be_a URI::HTTP }
          its(:path) { should_not be_blank }
        end

        describe 'for each components' do
          let(:name)    { tilemap[:components].keys.first }
          let(:tilePos) { tilemap[:components][name] }

          describe 'for the name' do
            subject { name }

            it { should be_a Symbol }
            it { should_not be_blank }
          end

          describe 'for the tile position' do
            subject { tilePos }

            it { should be_a Array }
            its(:size) { should eql(2) }

            it 'should be full of integers' do
              subject.map(&:class).uniq.should == [Fixnum]
            end
          end
        end
      end
    end
  end
end
