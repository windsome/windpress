import { IndexLink, Link } from 'react-router'
import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import LoginForm from 'components/Wordpress/Login';

var xdebug = window.myDebug('Coin:LoginPage')

export default class LoginPage extends Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,

        cuser: PropTypes.object.isRequired,
        handleLogin: PropTypes.func.isRequired,
    }

    constructor (props) {
        xdebug ("constructor");
        super (props);
    }

    componentDidMount () {
        const { location, replace, push, cuser } = this.props;
        var nextPathname = location && location.state && location.state.nextPathname;
        var userId = cuser && cuser.user && cuser.id;
        xdebug ("componentDidMount userId:"+userId+", nextPathname:"+nextPathname);
        if( userId ) {
            xdebug ("componentDidMount already login! go to previous page!");
            replace(nextPathname || '/coin/message');
        }
    }
/*
    componentWillReceiveProps (nextProps) {
        //xdebug ("componentWillReceiveProps");
        const { location, push, replace, cuser } = nextProps;
        var nextPathname = location && location.state && location.state.nextPathname;
        var userId = cuser && cuser.user && cuser.user.id;
        xdebug ("componentWillReceiveProps userId:"+userId+", nextPathname:"+nextPathname);

        if( userId ) {
            xdebug ("already login! go to previous page!");
            replace(nextPathname || '/coin');
        }
    }
*/
    render () {
        const { handleLogin, cuser, replace, location } = this.props;
        var nextPathname = location && location.state && location.state.nextPathname;
        var submit = (values) => {
            // Do something with the form values
            xdebug("login form:", values);
            var userdata = {nicename:values.username, pass: values.password};
            handleLogin (userdata, cuser.user).then(retobj => {
                if (retobj && retobj.id) {
                    var next = nextPathname || '/coin';
                    xdebug ("already login! go to previous page! url="+next);
                    replace(next);
                } else {
                    xdebug("error! login fail! not get user!");
                }
            }).catch (error => {
                xdebug("error! login fail:"+error.message, error);
            });
        }

        return (
      <div>
        <LoginForm onSubmit={submit} initialValues={{username:'demo', password:'demo'}}/>
        <div> { cuser.error && cuser.error.message } </div>
      </div>
        );
    }
}

