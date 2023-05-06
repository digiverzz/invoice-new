import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Style from './StorageDashboard.module.css';
import { PieChart, Pie, Legend, Sector, Cell, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line, Tooltip, AreaChart,
  Area} from 'recharts';
import user from "../images/user.png";
import Nav from "./reusable/navBar";

function StorageDashboard() {

  // var userCredentials = JSON.parse(localStorage.getItem("userCredentials"))
  var username = localStorage.getItem('uid')
  const [BarChartValue, setBarChartValue] = useState([]);
  const [PieChartValue, setPieChartValue] = useState([]);
  const [LineChartValue, setLineChartValue] = useState([]);
  const [RecentActivity,setRecentActivity] = useState([]);
  var URI = "http://172.174.180.163:5000/"

    const fetchPiechartData = async(username)=>{
        await axios.post(URI+"stats/StorageDetails",{
          username:username
        })
        .then(function (response) {
                var ChartData = response.data;
                console.log(ChartData);
                setPieChartValue(response.data);
                console.log(response.data);
                
              })
              .catch(function (response) {
                console.log(response);
              });
            }
  useEffect(() => {
    
    // fetchAreachartData(username);
    fetchPiechartData(username);
    fetchBarchartData(username);
    fetchLinechartData(username);
    fetchRecentActivity(username);
    
  }, []);


    const fetchBarchartData = async(username)=>{
      await axios.post(URI+"stats/TypeBasedFrequency",{
        username:username
      })
      .then(function (response) {
        setBarChartValue(response.data);
        console.log(response.data);
        
      })
      .catch(function (response) {
        console.log(response);
      });
    }

    const fetchLinechartData = async(username)=>{
        await axios.post(URI+"stats/DateBasedFrequency",{
          username:username
        })
    
      .then(function (response) {
      
      response.data.map((each)=>{
        // each.name = each.name.split(" ",-1).pop();
       each.name = each.name.split(":",1).pop();
        return each;
      })
      
      var arr = [];
      response.data.forEach((each,index)=> {
      var repeat =  arr.findIndex(item => item.name === each.name);
              if(repeat != -1){
              arr[repeat].value += 1;}
              else{
               arr.push(each);
              }
  })
  console.log(`array ${arr}`);
       
        setLineChartValue(arr);
        console.log(response.data);
        
      })
      .catch(function (response) {
        console.log(response);
      });
    }


  

    const fetchRecentActivity = async(username)=>{
      await axios.post(URI+"stats/GetActivity",{
        username:username
      })
      .then(function (response) {

       setRecentActivity(response.data);
        console.log(response.data);
      
        
      })
      .catch(function (response) {
        console.log(response);
      });
    }



const COLORS = ['#32CD32', '#1E90FF', '#FF69B4', '#FF8042','#3CB371'];
const COLOR = ['#FF69B4','#DEB887','#A0522D','#00FFFF','#DAA520','#9932CC','#FA8072']

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>

        </>
    );
};

  return (
    <>
     <Nav></Nav>
    
    <div className={Style.Cont}>

  <div className= {Style.wrapper}>
  
  <div className= {Style.piechart}>
    <p>User Storage</p>
                            <PieChart width={300} height={196}>
                                <Legend wrapperStyle={{bottom:9, left: 45}} layout="horizontal" horizontal="bottom" align="bottom" />
                                <Pie 
                                      data={PieChartValue}

                                  
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey= "value"
                                    nameKey="storage"
                                >
                                    {PieChartValue.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                  
                                </Pie>
                                <Tooltip />
                            </PieChart>
			</div>


  
      <div className={Style.Barchart}>
        <p>Uploaded Files based on file type</p>
        {/* { BarChartValue.length === 0 ? "No Data Found" : */}
      <BarChart width={425} height={196} margin={{ right:20}} 
      data={BarChartValue}>
    <Bar dataKey="value" fill="#FF69B4">
    {BarChartValue.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />))}
    </Bar>
    {/* <CartesianGrid stroke="#ccc" /> */}
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip cursor={false}/>
  </BarChart>
  {/* } */}
      </div>

      <div className={Style.Activity}>
        <p className={Style.ActP}>Recent Activity</p>
        {
        RecentActivity.map((file, index)=>{
        if(index >= 10){
          return;
        }
        return <div className={Style.ActivityDiv} key={index} >
            <img className={Style.User} src={user} />
            <p className={Style.Log}> You uploaded <span className={Style.ActLog}>{file.filename}</span> on <span className={Style.ActLog}>{file.datetime}</span></p>
          </div>
 } )
      }


    
      </div>

    
     
     <div className={Style.Linechart}>
      <p>File Growth over Time</p>
     <LineChart width={745} height={265} data={LineChartValue}
  margin={{right: 60, left: 20, bottom: 5 }} >
  {/* <CartesianGrid strokeDasharray="3 3" /> */}
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip  />
  <Legend />
  <Line type="stepBefore" dataKey="value" layout="horizontal" stroke="#8B008B" activeDot={{ r: 8 }}/>
</LineChart>
     </div>

     

      </div>
		</div>
    
</>
  )
}

export default StorageDashboard

