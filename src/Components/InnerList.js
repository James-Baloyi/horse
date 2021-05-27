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
            distances: [],
            pin: localStorage.getItem("pin"),
            deliveryCount: 0
        }
    }

    componentDidMount(){
        var childKeys = localStorage.getItem("childKeys");
        var jsonKeys = JSON.parse(childKeys);
        this.setState({childKeys: jsonKeys});
        this.setState({deliveryCount: jsonKeys.length})
        
        var parentKey = localStorage.getItem("parentKey");
        this.setState({parentKey: parentKey});
        this.loadDeliveries(jsonKeys);

        var driverUid = JSON.parse(localStorage.getItem("currentUser")).uid;
        this.getDriverData(driverUid);
        this.listenForPinVerification();
        setTimeout(()=>{this.sendReleaseFrom();},5000);

        //setTimeout(()=>{this.activateTop();}, 5800);
    }

    activateTop(){
        document.getElementsByClassName("deliveryPill")[0].setAttribute("disabled", false);
    }

    getDriverData(uid){
        firebase.database().ref("drivers/"+uid).once("value", data => {
            var driver = data.val();
            var name = driver.firstName + " " + driver.surname;
            var plate = driver.plateNum;
            var car = driver.make + " " + driver.model;
            this.setState({name: name});
            this.setState({plate: plate});
            this.setState({car: car});
            console.log(driver, name, plate, car);
        });
    }

    sendReleaseFrom(){
        let xhr = new XMLHttpRequest();
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var plate = this.state.plate;
        var deliveryId = this.state.deliveryId;
        var parentKey = this.state.parentKey;
        let name = this.state.name + " " + this.state.surname
        let car = this.state.car;
        let url = 'https://zipi.co.za/p54_release.php?';
        let p54email = "nelo@landsea-shipping.co.za";
        let params  = `address=${p54email}&time=${time}&date=${date}&driver_name=${name}&driver_car=${car}&plate=${plate}&deliveryId=${deliveryId}&parentKey=${parentKey}`;
        xhr.open('GET', `${url}${params}`, true)
        xhr.responseType = 'json';
        xhr.onreadystatechange = () =>{
            if(xhr.status == '200' & xhr.readyState == '4'){
                const response = xhr.response;
            }
        }
        xhr.send();
    }

    loadDeliveries(childKeys){
        var deliveryArray = [];
        childKeys.map(key => {
            firebase.database().ref("newReq/"+key).on("value", data => {
                var receivedData = data.val();
                if(receivedData !== null){
                receivedData.key = key;
                deliveryArray.push(receivedData);
                this.setState({deliveryArray: deliveryArray});
                this.setState({deliveryId: receivedData.tripId});
                }
            });  
        });
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

    sendSMSs(event){
        var deliveries = this.state.deliveryArray;
        var deliveryCount = deliveries.length;
        var startingPoint = 0;
        deliveries.map(delivery => {
            this.sendEmail(delivery.pu_pin, delivery.booking_email, delivery.booking_name);
            startingPoint++;
            if(startingPoint >= deliveryCount){
                event.target.classList.add("hidden");
            }
            console.log(delivery)
            var mobile = delivery.cellphone;
            var pin = delivery.pu_pin;
            this.sendMessage(mobile, pin);
        })
    }

    sendEmail(pin, email, name){
        var parent = this.state.parentKey;
        var url = `https://zipi.co.za/ZLpin.php?name=${name}&email=${email}&pin=${pin}`;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send();
    }

    sendMessage(cellphone, pin){
        var body = `Thank you for using Zipi Delivery. Zipi PIN: ${pin}. Please present it to your driver.`;
        var cors = 'https://cors-anywhere.herokuapp.com/';
        var sms = `https://us-central1-zipi-app.cloudfunctions.net/sendSms?cellphone=${cellphone.replace("0","27")}&message=${body}`;
    
        var xhr = new XMLHttpRequest();
        xhr.open('GET', sms, true);
        xhr.setRequestHeader('path', 'api.bulksms.com/v1/messages/send?');
        xhr.setRequestHeader('Authority', 'api.bulksms.com');
        xhr.setRequestHeader('scheme','https');
        xhr.setRequestHeader('origin', 'https://zipi-mailer.web.app/');
        xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://zipi-mailer.web.app/');
        xhr.setRequestHeader('Authorization', 'Basic emlwaW5vdzpaaXBpMTIzNDU=');
        xhr.onreadystatechange = () => {
        
        if(xhr.readyState == '4'){
            console.log("Sent", body);
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

    openP54Map(event){
        var lat = "-29.79832313852812";
        var lng = "31.011521516240354";
        if((navigator.platform.indexOf("iPhone") != -1) || 
        (navigator.platform.indexOf("iPad") != -1) || 
        (navigator.platform.indexOf("iPod") != -1))
        window.open(`maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`, "blank");
        window.open(`https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`, "blank");
        event.target.classList.add("hidden");
    }

    saveThenNav(){
        var saveData = JSON.stringify(this.state.deliveryData);
        console.log(saveData);
        localStorage.setItem("activeDelivery", saveData);
        window.location.href = "/current_delivery";
    }

    listenForPinVerification(){
        var pk = localStorage.getItem("parentKey");
        firebase.database().ref("apiReq/"+pk).on("value", data => {
            var thisEntry = data.val();
            if(thisEntry !== null){
            if(thisEntry.verified == true || thisEntry.verified == "true"){
                this.hidePinShowButtons();
            }
        }else{
               // alert("There's nothing to see here... Click OK to go home.");
               // window.location.href = "home";
        }
        });
    }

    hidePinShowButtons(){
        document.getElementsByClassName("sendNotifs")[0].style.display = "block";   
        document.getElementsByClassName("pinModal")[0].style.display = "none"; 
    }

    showFirstOne(){
        try{
            var firstDelivery = document.getElementsByClassName("deliveryPill")[0];
            firstDelivery.style.display = "block";

            var firstButton = document.getElementsByClassName("redText")[0];
            firstButton.style.display = "block";
        }catch(e){
            console.error(e);
        }
    }

    render(){
        var innerDeliveries = this.state.deliveryArray.map(thisDelivery => {
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            thisDelivery.pickup_date = dateTime;
            this.showFirstOne();

                return <>
                    <button className="deliveryPill" style={{display: "none"}} onClick={()=>{this.openMap(thisDelivery);this.setState({deliveryData: thisDelivery}, ()=>{this.saveThenNav()})}} id={thisDelivery.key.replace("-","")} key={thisDelivery.key}>
                        <table style={{width: "100%"}}>
                            <tr>
                                <td>
                                    &nbsp; &nbsp;<b>{thisDelivery.booking_name}</b><br/><small style={{color: "grey"}}>&nbsp; &nbsp; {thisDelivery.order_id}</small>
                                </td>
                              
                                <td>
                                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; 
                                </td>
                        </tr>
                </table>

            </button>
            <button className="redText nudgeUp" style={{display: "none"}} data={thisDelivery.key.replace("-","")} onClick={(event)=>{this.cancel(event.target, thisDelivery.key, this.state.parentKey)}}>Remove</button>
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
                    Showing One of {this.state.deliveryCount} deliveries.<br/>
                </div>
                
                <div className="pinModal">
                    <h2><br/><br/>
                    <small>Present this PIN to the dispatch person at the pick-up point.</small>
                    </h2><br/>
                    <h1>{this.state.pin}</h1>
                    <br/>
                    <div className="sendNotifs" style={{display: "block"}}>
                    <button className="send" onClick={(event)=>{this.sendSMSs(event); this.openP54Map(event); this.sendReleaseFrom();}}>Proceed to Pickup</button><br/>
                    </div>
                </div>
            </center>
            </div>   
        );
    }

}