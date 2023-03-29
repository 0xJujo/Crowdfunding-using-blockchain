// component that displays all the coupons that the user has using wallet address

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { Loader } from '../components';
import { thirdweb } from '../assets';

const DisplayCoupoun = () => {

    const { contract, address, getCoupounById, getUserCoupouns } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [couponsdata, setCouponData] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    // const fetchCoupons = async () => {
    //     const allCampaigns = await getCampaigns();
    //     allCampaigns.map(async (campaign) => {
    //         const data = await getDonations(campaign.pId);
    //         console.log("in",campaign.pId)
    //         data.map((donator) => {
    //              if(donator.donator === address) {
    //                 console.log("out",campaign.pId)
    //                 setCoupons([...coupons, {campaign, donator}])
    //              }
    //         }
    //         )
    // }
    // )
    // }
    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const data = await getUserCoupouns();
            setCoupons(data.filter(data2 => data2.owner !== '0x0000000000000000000000000000000000000000'));
            setIsLoading(false);
        }
        catch (err) {
            console.log(err);
        }

    }

    const getCoupoun = async () => {
        setIsLoading(true);
        for (let i = 0; i < coupons.length; i++) {
            const coupon = await getCoupounById(coupons[i].id.toNumber());
            setCouponData((prevState) => [...prevState, coupon]);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (coupons.length > 0) {
            getCoupoun();
        }
    }, [coupons])

    useEffect(() => {
        try {
            console.log(couponsdata)
        }
        catch (err) {
            console.log(err);
        }
    }, [couponsdata])


    useEffect(() => {
        if (contract) {
            fetchCoupons();
        }
    }, [contract, address])

    useEffect(() => {
        console.log("here", coupons)
    }, [coupons])


    return (
        <div>
            {isLoading && <Loader />}
            <div className="flex flex-col gap-[20px]">
                {coupons.map((coupon) => <CouponCard coupon={coupon} key={coupon.id} data={couponsdata} />)}
            </div>
        </div>
    )
}

// card to display the coupon
const CouponCard = ({ coupon, data }) => {
    //console.log(coupon,couponsdata[coupon.pId].name,couponsdata[coupon.pId].description)
    // console.log("here",coupon ,data[coupon.pId])
    try {
        const { name, description } = data[coupon.pId];
        return (
            <div className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" >
                <div className="flex flex-col p-4">
                    <div className="block">
                        <h3 className="font-epilogue font-semibold text-[20px] text-[#1dc071] text-left leading-[26px] truncate">{name}</h3>
                        <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{description}</p>
                    </div>

                    <div className="block">
                        <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">Coupon Code</h3>
                        <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{coupon.code}</p>
                    </div>
                    <div className="block">
                        <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">ID</h3>
                        <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{coupon.aId.toNumber()}</p>
                    </div>

                    <div className="flex items-center mt-[20px] gap-[12px]">
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
                            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
                        </div>
                        <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{coupon.owner}</span></p>
                    </div>
                </div>
            </div>
        )
    }
    catch (err) {
        console.log(err)
        return (
            <h1>Loading</h1>
        )
    }

}


export default DisplayCoupoun