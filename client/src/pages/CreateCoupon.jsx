import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';

const CreateCoupon = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { createCoupoun } = useStateContext();
    const [coupounID , setCoupounID] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '', 
        deadline: '',
    });

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }

    const handleSubmit = async (e) => {
        try{
        e.preventDefault();
        setIsLoading(true)
        const data = await createCoupoun({ ...form})
        setCoupounID(data);
        console.log(data);
        setIsLoading(false);
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
            {isLoading && <Loader />}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
                <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Create Coupon</h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Coupon Name *"
                        placeholder="John Doe"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => handleFormFieldChange('name', e)}
                    />
                    <FormField 
                        labelName="End Date *"
                        placeholder="End Date"
                        inputType="date"
                        value={form.deadline}
                         handleChange={(e) => handleFormFieldChange('deadline', e)}
                    />
                </div>
                <div>
                <FormField
                        labelName="Description *"
                        placeholder="John Doe"
                        isTextArea
                        inputType="text"
                        value={form.description}
                        handleChange={(e) => handleFormFieldChange('description', e)}
                />
                </div>
                <div className="flex justify-center items-center">
                <CustomButton 
                    btnType="submit"
                    title="Submit new Coupoun"
                    styles="bg-[#1dc071]"
                />
                </div>
                
            </form>
        </div>
    )
    

}
    

export default CreateCoupon;