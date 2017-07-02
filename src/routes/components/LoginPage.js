import { IndexLink, Link } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import classes from './LoginPage.scss'
import LoginForm from 'components/Wordpress/Login';

import _debug from 'debug'
const debug = _debug('app:server:LoginPage')

export default class LoginPage extends Component {

    componentDidMount () {
        //debug ("componentDidMount");
        const { location, push, login } = this.props;
        var nextPathname = location && location.state && location.state.nextPathname;
        console.log ("componentDidMount login:", login, ", nextPathname:", nextPathname);
        if( login && login.user && login.user.username ) {
            console.log ("already login! go to previous page!");
            push(nextPathname || '/');
        }
    }

    componentWillReceiveProps (nextProps) {
        //console.log ("componentWillReceiveProps");
        const { location, push, login } = nextProps;
        var nextPathname = location && location.state && location.state.nextPathname;
        console.log ("componentWillReceiveProps login:", login, ", nextPathname:", nextPathname);
        if( login && login.user && login.user.username ) {
            console.log ("already login! go to previous page!");
            push(nextPathname || '/');
        }
    }

    render () {
        //const { pristine, reset, submitting, handleLogin, login } = this.props;
        const { handleLogin, login } = this.props;
        var submit = (values) => {
            // Do something with the form values
            console.log("login form:", values);
            handleLogin (values, login.user);
        }

        return (
      <div>
        <LoginForm onSubmit={submit}/>
        <div> { (login.errcode != 0) && login.msg } </div>
      </div>
        );
    }
}

LoginPage.propTypes = {
    handleLogin: React.PropTypes.func.isRequired,
}

