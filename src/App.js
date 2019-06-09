import React, { Component } from 'react';
import './App.css';

import IconexConnect from './IconexConnect';
import {
  IconConverter
} from 'icon-sdk-js'
import SDK from './SDK.js';


import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme => ({
  root: {
    background: props =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: props =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
  },
  media: {
    height: 140,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },

}));

function MyButton(props) {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return <Button className={classes.root} {...other} />;
}

MyButton.propTypes = {
  color: PropTypes.string.isRequired,
};

function ToString(hex) {
  var string = '';
  for (var i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
}

export default class App extends Component {
  state = {
    login: false,
    curmsg: '',
    myAddress: '',
    msg: 'HI! FRIEND'
  }

  LoginF = async (e) => {
    const myAddress = await IconexConnect.getAddress()
    this.setState({
      login: true,
      myAddress: myAddress
    })

    const msg = await
      SDK.iconService.call(
        SDK.callBuild({
          from: this.state.myAddress,
          methodName: 'getMsgOfSendToNext',
          params: {
          },
          to: window.CONTRACT_ADDRESS,
        })
      ).execute()

    //const buf = ToString(msg)
    var buf = msg

    if (buf == undefined){
        buf = this.state.msg
    } else{
      buf = ToString(msg)
    }

    console.log(msg, buf)
    this.setState({
      msg: buf
    })

  }

  InputF = (e) => {
    this.setState({
      curmsg: e.target.value
    })
  }

  SendF = async () => {
    const { sendTxBuild } = SDK
    const txObj = sendTxBuild({
      from: this.state.myAddress,
      to: window.CONTRACT_ADDRESS,
      methodName: 'sendToNext',
      params: {
        _sent: IconConverter.fromUtf8(this.state.curmsg),
      },
    })
    console.log(IconConverter.fromUtf8(this.state.curmsg))
    const tx = await IconexConnect.sendTransaction(txObj)
    if (tx) {
      alert("**" + this.state.curmsg + "** 메세지 등록 완료")
    }
    console.log(tx)
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1><a href="/"></a></h1>
          {
            !this.state.login ? (
              <>
                <React.Fragment>
                  <MyButton color="blue" onClick={this.LoginF}>블록체인 사용하여 메세지 전달하기</MyButton>
                </React.Fragment>
              </>
            ) : (
                <>
                  <div className="warning">
                    <p><strong>{this.state.msg}</strong></p>
                  </div>

                  <form className={useStyles.container} noValidate autoComplete="off">
                    <TextField
                      style={{ width: 250, color: "#ffffcc" }}
                      id="outlined-name"
                      label="메세지를 입력하세요"
                      className={useStyles.textField}
                      value={this.state.curmsg}
                      onChange={this.InputF}
                      margin="normal"
                    />
                  </form>
                  <MyButton onClick={this.SendF} color="blue" style={{ height: 62, marginTop: 15, width: 250 }}>
                    메세지 등록
                  </MyButton>
                  }
                </>
              )
          }

        </header>
      </div>
    );
  }

}



