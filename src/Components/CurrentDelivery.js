import React from "react";
import firebase from "../fbConfig.js";

export default class CurrentDelivery extends React.Component{
    constructor(){
        super();
        this.state = {
            deliveryData: {},
            driverId: "",
            plate: "",
            mode: "",
            name: "",
            receiver: ""
        }
    }

    componentDidMount(){
        var deliveryData = JSON.parse(localStorage.getItem("activeDelivery"));
        this.setState({deliveryData});
        var driverId = JSON.parse(localStorage.getItem("currentUser")).uid;
        this.setState({driverId: driverId});
        this.getDriverData();
    }

    sendSecInvoice(list){
        let xhr = new XMLHttpRequest()
        let url = "https://zipi.co.za/Driver_Invoice.php?";
        let body = `id=${this.state.driverId}&name=${this.state.name}&no=${list.booking_ref}&date=${list.date}&pu=${list.pu_location.replace(', South Africa', '')}&do=${list.do_location.replace(', South Africa', '')}&reg=${this.state.plate}&mode=${this.state.mode}&duration=${list.eta}&distance=${list.distance}&amount=${parseInt(66.50)}&vat=${parseInt(66.50) * 0.15}&total=${ parseInt(66.50) + parseInt(66.50 * 0.15)}`;
        xhr.open('GET', `${url}${body}`, true)
        xhr.onreadystatechange = () =>{
            if ( xhr.status == '200'){
                let resp = xhr.responseText;
                console.log('sent invoice')
            }
        }
        xhr.send();
    }

    getDriverData(){
        var driverUid = JSON.parse(localStorage.getItem("currentUser")).uid
        firebase.database().ref("drivers/"+driverUid).once("value", data => {
            var thisDriver = data.val();
            console.log(thisDriver);
            var fname = thisDriver.firstName;
            var surname = thisDriver.surname;
            var name = `${fname} ${surname}`;
            var mode = thisDriver.mode;
            var plate = thisDriver.plateNum;
            this.setState({plate: plate});
            this.setState({mode: mode});
            this.setState({name: name});
        })
    }

    saveToComplete(date){
        var data = {
            date: date,
            delivery: this.state.deliveryData,
            driverId: this.state.driverId,
            receiver: this.state.receiver
        }
        firebase.database().ref("API_complete/"+this.state.driverId).push({data});
    }

    saveReceiver(event){
        this.setState({receiver: event.target.value});
    }

    deleteChildKey(){
        var childKey = this.state.deliveryData.key;
        var parentKey = localStorage.getItem("parentKey");
        firebase.database().ref("apiReq/"+parentKey+"/reqKeys").once("value", data => {
            var array = data.val();
            var index = array.indexOf(childKey);
            var newArray = array.splice(1,index);
            firebase.database().ref("apiReq/"+parentKey+"/reqKeys").update(newArray).then(()=>{
            if(newArray.length > 0){
                window.location.href = "/innerlist";
            }else{
                this.deleteFromNewReq(childKey);
            }
        })
    });
    }

    deleteFromNewReq(childKey){
        firebase.database().ref("newReq/"+childKey).remove().then(()=>{
            window.location.href = "home";
        });
    }

    getLocalStoragePin(){
        var parentKey = localStorage.getItem("parentKey");
        var pin;
        firebase.database().ref("apiReq/"+parentKey).once("value", data => {
            pin = data.val().pin;
        })
        return pin;
    }

    removeSavedDelivery(){
        localStorage.setItem("myTrip", null);
    }

    confirmPin(){
        var savedPin = this.getLocalStoragePin();
        var userPin = document.getElementsByClassName("releaseInput")[0].value;
        var actualPin = this.state.deliveryData.pu_pin;
        if(userPin == actualPin){
           this.deleteChildKey();
           this.sendEmail();
           var today = new Date();
           var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
           var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
           var dateTime = date+' '+time;
           
           if(actualPin == savedPin){
               this.removeSavedDelivery();
           }

           this.saveToComplete(dateTime);
        }else{
           alert("Incorrect PIN");
        }
    }

    sendEmail(){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var data = JSON.parse(localStorage.getItem("activeDelivery"));
        var x = data;
        var email = "james_baloyi@yahoo.com";
        var xhr = new XMLHttpRequest();
        var url = 'https://zipi.co.za/ZLreceipt.php?';
        this.sendSecInvoice(x);
        var params = `distance=${x.distance}&username=${x.booking_name}&pick_time=${x.pickup_date.split(' ')[1]}&dropTime=${dateTime}&numPlate=${this.state.plate}&vehicle=${this.state.mode}&email=${email}&total=${x.amount}&pu_address=${x.pu_location.replace(', South Africa', '')}&do_address=${x.do_location.replace(', South Africa', '')}&ref=${x.booking_ref}&name=${this.state.name}&date=${x.date.split(' ')[0]}&duration=${x.eta}&distance=${x.distance}&time=${x.date.split(' ')[1]}`;
        xhr.open('GET', `${url}${params}`, true)
        xhr.onreadystatechange = () =>{
              if ( xhr.status == '200'){
                  let resp = xhr.responseText;
                  console.log('sent', resp);
              }
          }
        xhr.send();
    }

    goToCancel(){
        window.location.href = "cancel";
    }

    render(){
        return(
            <div className="currentDelivery">
            <div className="cdTopArea">
            <table style={{width: "100%"}}>
            <tr>
            <td>
            <b>{this.state.deliveryData.booking_name} <br/> <small>{this.state.deliveryData.order_id}</small> </b><br/><small style={{color: "grey"}}>{this.state.deliveryId}</small>
            </td>
            </tr>
            </table>
            <hr style={{border: 0, height: 1, backgroundColor: "silver"}}/>
            <div className="deliveryInfo">
            <br/>
            
            <div className="instruction">
                <b>Special Instructions</b><br/>
                {this.state.deliveryData.instructions}
                <hr noshade className="hr"/>
            </div>
            <b><small>Drop Off</small></b>
            <div className="dropOff"><br/>
            {this.state.deliveryData.do_location}
            </div>
            <br/>
            <div className="receiver">
                <input type="text" placeholder="Receiver's Name"/>
            </div>
            <div className="pinArea">
            <b>Insert PIN you'll receive from customer</b>
            <br/>
            <input type="number" placeholder="Release PIN" className="releaseInput"/>
            </div>
            </div>
            <button className="cancelLoad" onClick={()=>{this.goToCancel()}}>Return Load</button>
            <button className="verifyPin" onClick={()=>{this.confirmPin()}}>Verify PIN</button>
            </div>
            <button className="callIcon" onClick={()=>{window.location.href="tel:"+this.state.deliveryData.cellphone}}><b>Call {this.state.deliveryData.booking_name}</b></button>
            </div>
        );
    }
}