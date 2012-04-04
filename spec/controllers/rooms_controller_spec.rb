require 'spec_helper.rb'

describe RoomsController do
  let(:room){mock id: 10}
  let(:row){mock id: 20}

  describe "show" do
    describe "spots subresource" do
      let(:room_response) do
        visit "/rooms/#{room.id}.xml"
        response
      end
      let(:parsed_response){Nokogiri::XML.parse response}
      let(:spot_xpath){"//room/rows//row[@resource='true']"}
      let(:parsed_spot){parsed_response.xpath spot_xpath}

      before do
        room.spots << Factory.build(:spot)
        spot.should_not be_new_record
      end

      it "includes all the rows" do
        response.body.should have_xpath("//room/rows//row[@resource='true'][.='http://example.com/rows/#{room.id}/")
      end

      it "returns 200 if you follow the row resource link" do
        link = Nokogiri::XML.parse(room_response).xpath("//room/rows//row[@resource='true']").text
        visit link
        response.code.should == 200
      end
    end
  end
end
