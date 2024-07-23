import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getUserCampaigns,getCoupounsByOwner } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) {
      fetchCampaigns();
    }
  }, [address, contract]);

  return (
    <div>
    <DisplayCampaigns 
      title="My Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
    <DisplayCoupons />
    </div>
  )
}

const DisplayCoupons = () => {
  const [load, setLoad] = useState(false);
  const [coupouns, setCoupouns] = useState([]);

  const { address, contract, getUserCampaigns,getCoupounsByOwner } = useStateContext();


  const fetchCoupouns = async () => {
    const data = await getCoupounsByOwner();
    setCoupouns(data.filter( data2 => data2.owner !== '0x0000000000000000000000000000000000000000'));
  }

  useEffect(() => {
    if(contract){
      setLoad(true);
      fetchCoupouns();
      setLoad(false);
    }
  }, [load,contract,address]);


  
  if(coupouns.length === 0){
    return <h1>no coupouns</h1>
  }
  else{
    return (
      <div>
        <h1 className='font-epilogue font-semibold text-[18px] text-white text-left'>Your Coupons</h1>
        {coupouns.map((coupoun) => <CouponCard coupoun={coupoun} key={coupoun.pId}/>)}
      </div>
    )
    }
  }

 const CouponCard = ({coupoun}) => {
    return (
      
      <div className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" >
      <div className="flex flex-col p-4">
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[20px] text-[#1dc071] text-left leading-[26px] truncate">{coupoun.name}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{coupoun.description}</p>
        </div>
        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">ID</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{coupoun.id.toNumber()}</p>
        </div>
      </div>
    </div>
    )
}


export default Profile