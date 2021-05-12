import React from "react";
import firebase from "../fbConfig.js";
import Logo from "../headerlogo.png";

export default class InnerList extends React.Component{
    constructor(){
        super();
        this.state = {
            deliveryId: "LOADING",
            deliveryArray: [],
            parentKey: "",
            childKeys: [],
            deliveryData: {},
        }
    }

    componentDidMount(){
        var childKeys = localStorage.getItem("childKeys");
        var jsonKeys = JSON.parse(childKeys);
        this.setState({childKeys: jsonKeys});
        
        var parentKey = localStorage.getItem("parentKey");
        this.setState({parentKey: parentKey});
        this.loadDeliveries(jsonKeys);
        }

    loadDeliveries(childKeys){
        var deliveryArray = [];
        console.log()
        childKeys.map(key => {
            firebase.database().ref("newReq/"+key).on("value", data => {
                var receivedData = data.val();
                receivedData.key = key;
                deliveryArray.push(receivedData);
                this.setState({deliveryArray: deliveryArray});
                this.setState({deliveryId: receivedData.tripId});
            });
        })
    }

    cancel(button, childKey, parentKey, noRefresh){
        var url = `https://us-central1-zipi-app.cloudfunctions.net/cancelRequest?childKey=${childKey}&parentKey=${parentKey}`;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        var res = xhr.responseText;
        if(res == "success"){
            button.style.display = "none";
            var target_id = button.getAttribute("data");
            var target = document.getElementById(target_id);
            target.style.display = "none";
        }else{
            alert(res + ". Contact support with a screenshot of this error.");
        }
    }

    sendSMSs(){
        var deliveries = this.state.deliveryArray;
        var deliveryCount = deliveries.length;
        var startingPoint = 0;
        deliveries.map(delivery => {
            startingPoint++;
            if(startingPoint >= deliveryCount){
                document.getElementsByClassName("sendNotifs")[0].classList.add("hidden");
            }
            console.log(delivery)
            var mobile = delivery.cellphone;
            var pin = delivery.pu_pin;
            this.sendMessage(mobile, pin);
        })

    }

    sendMessage(cellphone, pin){
        var body = `Thank you for using Zipi Delivery. Zipi PIN: ${pin}. Please present it to your driver.`;
        var cors = 'https://cors-anywhere.herokuapp.com';
        var sms = 'https://api.bulksms.com/v1/messages/send?to='+cellphone.replace("0","27")+'&body='+body;
    
        var xhr = new XMLHttpRequest();
        xhr.open('GET', cors+'/'+sms, true);
        xhr.setRequestHeader('path', 'api.bulksms.com/v1/messages/send?');
        xhr.setRequestHeader('Authority', 'api.bulksms.com');
        xhr.setRequestHeader('scheme','https');
        xhr.setRequestHeader('origin', 'https://zipi.co.za');
        xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://zipi.co.za');
        xhr.setRequestHeader('Authorization', 'Basic emlwaW5vdzpaaXBpMTIzNDU=');
        xhr.onreadystatechange = () => {
        if(xhr.readyState == '4'){
            console.log("Sent", cellphone.replace("0","27"), body);
        }
        }
        xhr.send();
        }

    openMap(trip){
        var dropoff = trip.do_coords;
        var lat = dropoff.lat;
        var lng = dropoff.lng;
        if((navigator.platform.indexOf("iPhone") != -1) || 
            (navigator.platform.indexOf("iPad") != -1) || 
            (navigator.platform.indexOf("iPod") != -1))
            window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`, "blank");
            window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`, "blank");
        }

    openP54Map(){
        var lat = "-29.79832313852812";
        var lng = "31.011521516240354";
        if((navigator.platform.indexOf("iPhone") != -1) || 
        (navigator.platform.indexOf("iPad") != -1) || 
        (navigator.platform.indexOf("iPod") != -1))
       window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`, "blank");
       window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`, "blank");
    }
        

    saveThenNav(){
        var saveData = JSON.stringify(this.state.deliveryData);
        console.log(saveData);
        localStorage.setItem("activeDelivery", saveData);
        window.location.href = "/current_delivery"
    }

    render(){
        var innerDeliveries = this.state.deliveryArray.map(thisDelivery => {
                return <>
                    <div className="deliveryPill" onClick={()=>{this.openMap(thisDelivery);this.setState({deliveryData: thisDelivery}, ()=>{this.saveThenNav()})}} id={thisDelivery.key.replace("-","")} key={thisDelivery.key}>
                        <table style={{width: "100%"}}>
                            <tr>
                                <td>
                                    &nbsp; &nbsp;<b>{thisDelivery.booking_name}</b><br/><small style={{color: "grey"}}>&nbsp; &nbsp; {thisDelivery.booking_ref}</small>
                                </td>
                              
                                <td>
                                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; 
                                </td>
                        </tr>
                </table>

            </div>
            <button className="redText nudgeUp" data={thisDelivery.key.replace("-","")} onClick={(event)=>{this.cancel(event.target, thisDelivery.key, this.state.parentKey)}}>Remove</button>
                <br/>
                </>
            });
        

        return(
            <div className="destinationList">
            <div className="header">
                <img src={Logo}/>
            </div>
            <br/>
            <center><br/>
                <h2>Pack ID: {this.state.deliveryId}</h2>
                <br/>
                <div className="currentDeliveries">
                    {innerDeliveries}
                </div>
                
                <div className="sendNotifs">
                    <button className="send" onClick={()=>{this.sendSMSs(); this.openP54Map()}}>Start Deliveries</button>
                </div>
                
                </center>
            </div>   
        );
    }

}