import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x33Fe7836d47ec6AD02C359FF9Dc9Fd380552E4F7');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const { mutateAsync: createCoupoun } = useContractWrite(contract, 'createCoupoun');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.coupoun1, // coupoun1
        form.coupoun2, // coupoun2
        form.coupoun3, // coupoun3
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const publishCoupon = async (form) => {
    try {
      const data = await createCoupoun([
        address, // owner
        form.name, // title
        form.description, // description
        new Date(form.deadline).getTime(), // deadline,
      ])

      return data;
    } catch (error) {
      console.log("contract call failure", error)
    }

  }

  const getCoupounsByOwner = async () => {
    const coupouns = await contract.call('getCoupounsByOwner', address);
    const parsedCoupouns = coupouns.map((coupoun, i) => ({
      owner: coupoun.owner,
      name: coupoun.name,
      id: coupoun.id,
      description: coupoun.description,
      deadline: coupoun.deadline.toNumber(),
      pId: i,
    }));

    return parsedCoupouns;
  }

  const getCoupounById = async (id) => {
    const coupoun = await contract.call('getCoupounById', id);
    const parsedCoupoun = {
      owner: coupoun.owner,
      name: coupoun.name,
      description: coupoun.description,
      deadline: coupoun.deadline.toNumber(),
    };
    
    return parsedCoupoun;
  }

  const createUserCoupouns = async (pId) => {
    const data = await contract.call('createUserCoupouns', pId,address);
    return data;
  }

  const getUserCoupouns = async () => {
    const coupouns = await contract.call('getUserCoupouns',address);
    const newCoupouns = coupouns.filter( data2 => data2.owner !== '0x0000000000000000000000000000000000000000');
    const parsedCoupouns = newCoupouns.map((coupoun, i) => ({
      owner: coupoun.owner,
      code: coupoun.code,
      id: coupoun.id,
      aId: coupoun.accessID,
      pId: i,
    }));

    return parsedCoupouns;  
  }

  

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');
    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      coupoun1: campaign.coupoun1,
      coupoun2: campaign.coupoun2,
      coupoun3: campaign.coupoun3,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        createCoupoun: publishCoupon,
        getCoupounsByOwner,
        getCoupounById,
        createUserCoupouns,
        getUserCoupouns,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);