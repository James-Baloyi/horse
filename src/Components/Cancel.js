import React from "react";
import firebase from "../fbConfig.js";

export default class Cancel extends React.Component{
    constructor(){
        super();
        this.state = {
            reason: "Customer Unavailable"
        }
    }

    cancelDelivery(){
        var parentKey = localStorage.getItem("parentKey");
        var childKey = JSON.parse(localStorage.getItem("activeDelivery")).key;
        var currentDelivery = JSON.parse(localStorage.getItem("activeDelivery"));
        
            var url = `https://us-central1-zipi-app.cloudfunctions.net/cancelRequest?childKey=${childKey}&parentKey=${parentKey}`;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send();
            var res = xhr.responseText;
            var date = new Date();
            if(res == "success"){
                firebase.database().ref("API_cancelled").push({
                    parentKey: parentKey,
                    delivery: currentDelivery,
                    date: date,
                    reason: this.state.reason
                }).then(()=>{
                    document.getElementsByTagName("small")[0].innerText = "Successfully Cancelled";
                    localStorage.removeItem("parentKey");
                    localStorage.removeItem("childKeys");
                    localStorage.removeItem("activeDelivery");
                    window.location.href = "innerlist";
                })
            }else{
                document.getElementsByTagName("small")[0].innerText = res + ". Contact support with a screenshot of this error."
            }   
    }

    render(){
        return(
            <div>
                <center>
                <h2>Cancel Delivery<br/>
                <br/><small>Please make sure that you've tried to reach the customer to a reasonable degree.</small>
                </h2><br/>
                <select className="cancelDropdown" onChange={(event)=>{this.setState({reason: event.target.value})}}>
                    <option value="Customer Unavailable">Customer Unavailable</option>
                    <option value="Driver Error">Traffic Problem</option>
                    <option value="Customer Unreachable">Can't Reach Customer</option>
                </select>
                <br/><br/>
                <button className="send" onClick={()=>{this.cancelDelivery()}}>Cancel Delivery</button>
                </center>
            </div>
        );
    }

}