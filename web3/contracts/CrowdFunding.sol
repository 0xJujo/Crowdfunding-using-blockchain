pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 coupoun1;
        uint256 coupoun2;
        uint256 coupoun3;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    struct Coupoun{
        string name;
        uint256 id;
        string description;
        uint256 deadline;
        address owner;
    }

    struct UserCoupoun{
        uint256 id;
        address owner;
        string code;
        uint accessID;
    }


    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Coupoun) public coupouns;
    mapping(uint256 => UserCoupoun) public userCoupouns;

    uint256 public numberOfCampaigns = 0;
    uint256 public numberOfCoupouns = 0;
    uint256 public numberOfUserCoupouns = 0;
    uint256 public counter = 0;

    function createCampaign(address _owner, string memory _title, string memory _description,uint256 _coupoun1, uint256 _coupoun2,uint256 _coupoun3,uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.coupoun1 = _coupoun1;
        campaign.coupoun2 = _coupoun2;
        campaign.coupoun3 = _coupoun3;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }


    function createCoupoun(address _owner,string memory _name, string memory _description, uint256 _deadline) public returns (uint256) {
        Coupoun storage coupoun = coupouns[numberOfCoupouns];

        require(coupoun.deadline < block.timestamp, "The deadline should be a date in the future.");

        coupoun.name = _name;
        coupoun.description = _description;
        coupoun.deadline = _deadline;
        coupoun.owner = _owner;
        numberOfCoupouns++;
        coupoun.id = numberOfCoupouns - 1;
        return numberOfCoupouns - 1;
    }

    function getCoupounsByOwner(address _owner) public view returns (Coupoun[] memory) {
        Coupoun[] memory allCoupouns = new Coupoun[](numberOfCoupouns);

        for(uint i = 0; i < numberOfCoupouns; i++) {
            Coupoun storage item = coupouns[i];

            if(item.owner == _owner){
                allCoupouns[i] = item;
            }
        }

        return allCoupouns;
    }

    
    function getUserCoupounsByCoupoun(uint256 _id) public view returns (UserCoupoun[] memory) {
        UserCoupoun[] memory allUserCoupouns = new UserCoupoun[](numberOfUserCoupouns);

        for(uint i = 0; i < numberOfUserCoupouns; i++) {
            UserCoupoun storage item = userCoupouns[i];

            if(item.id == _id){
                allUserCoupouns[i] = item;
            }
        }

        return allUserCoupouns;
    }


    function getCoupounById(uint256 _id) public view returns (Coupoun memory) {
        Coupoun memory coupoun = coupouns[_id];
        return coupoun;
    }

    function createUserCoupoun(uint256 _id, address _owner) public  {
        UserCoupoun storage userCoupoun = userCoupouns[numberOfUserCoupouns];

        userCoupoun.id = _id;
        userCoupoun.owner = _owner;
        userCoupoun.code = randomString(10);
        numberOfUserCoupouns++;
        userCoupoun.accessID = numberOfUserCoupouns - 1;
    }

    
    function getUserCoupouns(address _owner) public view returns (UserCoupoun[] memory) {
        UserCoupoun[] memory allUserCoupouns = new UserCoupoun[](numberOfUserCoupouns);

        for(uint i = 0; i < numberOfUserCoupouns; i++) {
            UserCoupoun storage item = userCoupouns[i];

            if(item.owner == _owner){
                allUserCoupouns[i] = item;
            }
        }

        return allUserCoupouns;
    }
    
    function randomString(uint length) public  returns (string memory) {
    bytes memory characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    bytes memory result = new bytes(length);
    counter ++ ; 
    uint256 randomInt = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty,counter,msg.sender)));
    for (uint i = 0; i < length; i++) {
        result[i] = characters[randomInt % characters.length];
        randomInt /= characters.length;
    }
    return string(result);
    }



    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        createUserCoupoun(campaign.coupoun1 , msg.sender);
        createUserCoupoun(campaign.coupoun2 , msg.sender);
        createUserCoupoun(campaign.coupoun3 , msg.sender);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
