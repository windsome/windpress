import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import classes from './Styles.scss'


const LoginForm = (props) => {
  const { onSubmit, handleSubmit, pristine, reset, submitting } = props;
  return (
      <form className="form-signin" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="form-signin-heading">Please sign in</h2>
        <label htmlFor="username" className="sr-only">Email address</label>
        <Field component="input" type="text" id="username" name="username" className="form-control" placeholder="Email address"/>
        <label htmlFor="password" className="sr-only">Password</label>
        <Field component="input" type="password" id="password" name="password" className="form-control" placeholder="Password"/>
        <div className="checkbox">
          <label>
            <Field component="input" type="checkbox" id="remember" name="remember" value="remember-me"/> Remember me
          </label>
        </div>
        <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={submitting}>Sign in</button>
      </form>
  );
};
/*
const LoginForm = (props) => {
  const { onSubmit, handleSubmit, pristine, reset, submitting } = props;
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">Username</label>
        <Field component="input"
               type="text"
               name="username" />
 
        <label htmlFor="inputPassword">Password</label>
        <Field component="input"
               type="password"
               name="password" />
        <button type="submit" disabled={pristine || submitting}>Sign in</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
 
      </form>
  );
};
*/
LoginForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
};
 
export default reduxForm({
  form: 'login' // a unique name for this form
})(LoginForm);
