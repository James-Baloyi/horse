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
                document.getElementsByTagName("small")[0].innerText = res + ".<br/><br/>Contact support with a screenshot of this error."
            }   
    }

    render(){
        return(
            <div>
                <center>
                <h2>Return Package<br/>
                <br/><small>Please make sure that you've tried to reach the customer to a reasonable degree.</small>
                </h2><br/><br/>
                <br/>

                </center>
                <div className="radioFields">

                <div className="radio">
                <input type="radio" id="one" onChange={(event)=>{this.setState({reason: event.target.value})}} name="reason" value="male"/>
                <label for="one">Customer Unavailable</label><br/>
                </div>

                <div className="radio">
                <input type="radio" id="two" onChange={(event)=>{this.setState({reason: event.target.value})}}  name="reason" value="Traffic problem"/>
                <label for="two">Traffic Problem</label><br/>
                </div>

                <div className="radio">
                <input type="radio" id="three" onChange={(event)=>{this.setState({reason: event.target.value})}}  name="reason" value="Can't reach customer"/>
                <label for="three">Can't Reach Customer</label> 
                </div>
                <br/>
                </div>

                <center>
                <button className="send" onClick={()=>{this.cancelDelivery()}}>Return Delivery</button>
                </center>
            </div>
            
        );
    }
}