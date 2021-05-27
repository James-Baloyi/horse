import React from "react";
import firebase from "../fbConfig";
import "../App.css";
import Logo from "../headerlogo.png";

export default class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            requests: [],
            bookingStatus: "(There are no bookings)",
            activeTrip: {},
            currentPin: ""
        }
    }

    componentDidMount(){
        var ls = localStorage.getItem("currentUser");
        var pin = localStorage.getItem("pin");
        this.setState({currentPin:pin});
        if(!ls){
            window.location.href = "/login";
        }else{
            this.getRequestBuckets();
            this.getMySelectedTrip();
        }
    }

    getMySelectedTrip(){
        var myTrip = localStorage.getItem("myTrip");
        if(!myTrip){
            //do nothing
        }else{
            this.showMyTrip(myTrip);
        }
    }

    getRequestBuckets(){
        var requestsArray = [];
        firebase.database().ref("apiReq/").on("value", data => {
            document.getElementsByClassName("refresh")[0].click();
            this.setState({requestsArray: []});
            var requests = data.val();
            if(requests !== null){
                this.setState({bookingStatus: ""});
            }
            for(var key in requests){
                var thisRequest = requests[key];
                thisRequest.key = key;
                if(thisRequest.selected){
                    //thisRequest
                }else{
                    var keysArray = thisRequest.reqKeys;
                    thisRequest.innerDeliveries = keysArray.length;
                    requestsArray.push(thisRequest);
                }
                this.setState({requests: requestsArray});
            }
        });
    }

    logOut(){
        localStorage.clear();
        if(firebase.auth().signOut()){
            window.location.reload();
        }
    }

    showMyTrip(tripData){
        var myActiveTrip = JSON.parse(tripData);
        var parentKey = myActiveTrip.parentKey;
        var childKeys = myActiveTrip.childKeys;

        this.setState({activeTrip: myActiveTrip});

        //this.openPackage(parentKey, childKeys);
        //var parentKeyOld = localStorage.getItem("parentKey");
        //this.setSelectedTrue(parentKeyOld);
    }

    openPackage(parentKey, childKeys, id, request){
        var thisTrip = request;
        localStorage.setItem("parentKey", parentKey);
        localStorage.setItem("myTrip", JSON.stringify(thisTrip));
        if(childKeys !== undefined){
            localStorage.setItem("childKeys", JSON.stringify(childKeys));
        }else{
            alert("Can't find deliveries under this pack.");
        }
    }

    savePin(pin){
        localStorage.setItem("pin", pin);
    }

    setSelectedTrue(request){
        try{
        firebase.database().ref("apiReq/"+request.key).update({selected: true}).then(()=>{
            window.location.href = "/innerlist";
        });
        }catch(e){
            console.log(request, e);
        }
    }

    hideActiveDelivery(event){
        document.getElementsByClassName("activeDelivery")[0].style.display = "none";
        event.target.style.display = "none";
    }
    
    render(){
        var requestData = this.state.requests.map((request)=>{
            return (
            <>
            <div className="packagePill" key={request.key} onClick={()=>{this.setSelectedTrue(request); this.savePin(request.pin); this.openPackage(request.key, request.reqKeys, request.id, request)}}>
            <table style={{width: "100%"}}>
                <tr>
                    <td style={{paddingLeft: 10}}>
                        <b>{request.id}</b><br/><small style={{color: "grey"}}>{request.innerDeliveries} Deliver(ies) &nbsp; &nbsp; {request.locationArray[0]}</small>
                    </td>
                    <td>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <button className="smallButton noBg">Start Trip</button>
                    </td>
                    </tr>
                </table>
            </div>
        <br/>
        </>
        );
        })

        return(
            <div className="groupedList">
            <div className="header">
                <img src={Logo}/>
               <button className="smallButton noBg" onClick={()=>{this.logOut()}}>Sign out (V23)</button><br/>
               <br/>
               <div className="mainDiv">
               <small>Bookings {this.state.bookingStatus}</small><br/>
               
               <div className="list">
                    {requestData}
               </div>
               <button className="refresh" onClick={()=>{this.getRequestBuckets();}}>Refresh Packages</button>
               </div>
           </div>  

            <button className="activeDelivery" onClick={()=>{this.setSelectedTrue(this.state.activeTrip); this.savePin(this.state.currentPin); this.openPackage(this.state.activeTrip.key, this.state.activeTrip.reqKeys, this.state.activeTrip.id, this.state.activeTrip)}} >
                <center>
                    {this.state.activeTrip.id}
                </center>
            </button>
            <button className="closeActive" onClick={(event)=>{this.hideActiveDelivery(event)}}>
                Hide
            </button>
       </div>
        );
    }
}