import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import classes from './Login.scss'

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
 
LoginForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
};
 
export default reduxForm({
  form: 'login' // a unique name for this form
})(LoginForm);
