import React from "react";
import firebase from "../fbConfig.js";

export default class CurrentDelivery extends React.Component{
    constructor(){
        super();
        this.state = {
            deliveryData: {},
            driverId: ""
        }
    }

    componentDidMount(){
        var deliveryData = JSON.parse(localStorage.getItem("activeDelivery"));
        this.setState({deliveryData});
        var driverId = JSON.parse(localStorage.getItem("currentUser")).uid;
        this.setState({driverId: driverId});
    }

    saveToComplete(date){
        var data = {
            date: date,
            delivery: this.state.deliveryData,
            driverId: this.state.driverId
        }
        firebase.database().ref("API_complete/"+this.state.driverId).push({data})
    }

    deleteChildKey(){
        var childKey = this.state.deliveryData.key;
        var parentKey = localStorage.getItem("parentKey");
        firebase.database().ref("apiReq/"+parentKey+"/reqKeys").once("value", data => {
            var array = data.val();
            var index = array.indexOf(childKey);
            var newArray = array.splice(1,index);
            firebase.database().ref("apiReq/"+parentKey+"/reqKeys").update(newArray);
            this.deleteFromNewReq(childKey);
            if(newArray.length < 1){
                window.location.href = "innerlist";
            }
        })
    }

    deleteFromNewReq(key){
        firebase.database().ref("newReq/"+key).remove();
    }

    confirmPin(){
        this.deleteChildKey()
        var userPin = document.getElementsByClassName("releaseInput")[0].value;
        var actualPin = this.state.deliveryData.pu_pin;
        if(userPin == actualPin){
           var today = new Date();
           this.saveToComplete(today);
           this.deleteChildKey();
        }
    }

    goToCancel(){
        window.location.href = "cancel";
    }

    render(){
        return(
            <div className="currentDelivery">
            <h4 style={{marginTop: -40, position: "absolute", transform: "translate(100%)"}}>Current Trip</h4>
            <div className="cdTopArea">
            <table style={{width: "100%"}}>
            <tr>
            <td>
            <b>{this.state.deliveryData.booking_name}</b><br/><small style={{color: "grey"}}>{this.state.deliveryId}</small>
            </td>
            </tr>
            </table>
            <hr style={{border: 0, height: 1, backgroundColor: "silver"}}/>
            <div className="deliveryInfo">
            <small>Drop Off</small>
            <div className="dropOff"><br/>
            <b>{this.state.deliveryData.do_location}</b>
            <br/>
            </div>
            <div className="pinArea">
            <b>Insert RELEASE PIN that you will receive from the customer</b>
            <br/>
            <input type="number" placeholder="Release PIN" className="releaseInput"/>
            </div>
            </div>
            <button className="cancelLoad" onClick={()=>{this.goToCancel()}}>Cancel Load</button>
            <button className="verifyPin" onClick={()=>{this.confirmPin()}}>Verify PIN</button>
            </div>
            </div>
        );
    }

}