import React from 'react';
import { useStateContext } from '../context';
import { tagType, thirdweb } from '../assets';
import { daysLeft } from '../utils';

const FundCard = ({ owner, title, description, coupoun1,coupoun2 ,coupoun3,target, deadline, amountCollected, image, handleClick }) => {
  const remainingDays = daysLeft(deadline);
  const { getCoupounById } = useStateContext();
  const [coupon1, setCoupoun1] = React.useState([]);
  const [coupon2, setCoupoun2] = React.useState([]);
  const [coupon3, setCoupoun3] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);



  React.useEffect(() => {
    const fetchCoupouns = async () => {
      const data1 = await getCoupounById(coupoun1.toNumber());
      const data2 = await getCoupounById(coupoun2.toNumber());
      const data3 = await getCoupounById(coupoun3.toNumber());
      setCoupoun1(data1);
      setCoupoun2(data2);
      setCoupoun3(data3);
    }
    setIsLoading(true);
    fetchCoupouns();
    console.log(coupon1, coupon2, coupon3);
    setIsLoading(false);
  }, [isLoading]);
  return (
    <div className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick={handleClick}>
      <img src={image} alt="fund" className="w-full h-[158px] object-cover rounded-[15px]"/>

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain"/>
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">Education</p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{title}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">Coupon</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{coupon1.name}</p>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{coupon2.name}</p>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{coupon3.name}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{amountCollected}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Raised of {target}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain"/>
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{owner}</span></p>
        </div>
      </div>
    </div>
  )
}

export default FundCard