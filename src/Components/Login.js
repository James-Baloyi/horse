import React from "react";
import '../App.css';
import Logo from "../headerlogo.png";
import firebase from "../fbConfig";

export default class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    verifyLogin(){
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((res)=> { 
        var user = firebase.auth().currentUser;
        console.log(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.reload();
    }).catch(error => {
        alert(error);
    })
    }

    componentDidMount(){
        var user = localStorage.getItem("currentUser");
        if(user){
            window.location.href = "/home";
        }
    }
    
    render(){
        return(
            <div className="login showing">
            <center>
                <br/><br/><br/>
                <img src={Logo}/>
    
                <div className="login-panel">
                    <b>Login <sub>V23</sub></b>
                    <br/>
                    <input type="email" id="email" onChange={(event)=>{this.setState({email:event.target.value})}} placeholder="Email"/><br/>
                    <input type="password" id="password" onChange={(event)=>{this.setState({password:event.target.value})}} placeholder="Password"/><br/>
                    <button className="button" onClick={()=>{this.verifyLogin()}}>Login</button>
                </div>
            </center>
          </div>
        );
    }

}