import { useSelector } from "react-redux";
import userimg from "../Images/user.png";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const User = () => {
 const {user} = useSelector((state)=> state.users)
 const [ip ,setIp] = useState(null)
 const [country , setCountry] = useState(null)
 const [region , setRegion] = useState(null)
 async function getGeolocationData(){
  try{
    const response = await axios.get(`${process.env.REACT_APP_LOCATION_API_KEY}`)
    setIp(response.data.ip)
    setCountry(response.data.location.country)
    setRegion(response.data.location.region)
  }
  catch(error){}
 }
 useEffect(()=>{
getGeolocationData()
 },[])
  return (
    <div>
      <img src={userimg} className="userImage" alt=""/>
      <p>
        <h6>{user?.name}</h6>
        <h6>{user?.email}</h6>
        <h6>{ip}</h6>
        <h6>{country}</h6>
        <h6>{region}</h6>
      </p>
    </div>
  );
};

export default User;
