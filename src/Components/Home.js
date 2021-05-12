import React from "react";
import firebase from "../fbConfig";
import "../App.css";
import Logo from "../headerlogo.png";

export default class Home extends React.Component{

    constructor(){
        super();
        this.state = {
            requests: []
        }
    }

    componentDidMount(){
        var ls = localStorage.getItem("currentUser");
        if(!ls){
            window.location.href = "/login";
        }else{
            this.getRequestBuckets();
        }
    }

    getRequestBuckets(){
        var requestsArray = [];
        firebase.database().ref("apiReq/").on("value", data => {
            var requests = data.val();
            for(var key in requests){
                var thisRequest = requests[key];
                thisRequest.key = key;
                requestsArray.push(thisRequest);
                this.setState({requests: requestsArray});
                return null;
            }
        });
    }

    logOut(){
        localStorage.clear();
        if(firebase.auth().signOut()){
            window.location.reload();
        }
    }

    openPackage(parentKey, childKeys){
        console.log(childKeys)
        if(childKeys !== undefined){
            localStorage.setItem("parentKey", parentKey);
            localStorage.setItem("childKeys", JSON.stringify(childKeys));
            window.location.href = "/innerlist";
        }else{
            alert("Can't find deliveries under this pack. Hiding it for now.");
        }
    }
    
    render(){
        var requestData = this.state.requests.map((request)=>{
            console.log(this.state.requests);
            return (
            <div className="packagePill" onClick={()=>{this.openPackage(request.key, request.reqKeys)}}>
            <table style={{width: "100%"}}>
                <tr>
                    <td style={{paddingLeft: 10}}>
                        <b>{request.id}</b><br/><small style={{color: "grey"}}>{request.distance}</small>
                    </td>
                    <td>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <button className="smallButton noBg">Start Trip</button>
                    </td>
                </tr>
            </table>
        </div>
        );
        })

        return(
            <div className="groupedList">
            <div className="header">
                <img src={Logo}/>
               <button className="smallButton noBg" onClick={()=>{this.logOut()}}>Sign out</button><br/>
               <br/>
               <div className="mainDiv">
               <small>Bookings</small><br/>
               
               <div className="list">
                    {
                        requestData
                    }
               </div>
               <button className="refresh" onClick={()=>{this.getRequestBuckets();}}>Refresh Packages</button>
               </div>
           </div>  
       </div>
        );
    }

}