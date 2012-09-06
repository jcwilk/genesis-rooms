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
      describe "for a tile" do
        let(:tile) { MultiJson.decode(response.body, symbolize_keys: true)[:room][:tiles][0] }

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
    end
  end
end
