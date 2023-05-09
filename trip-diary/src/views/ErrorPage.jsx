import React from 'react';

const ErrorPage = ({ error }) => (
  <div>
    <p>Wystąpił błąd:</p>
    <p>{error.message}</p>
    <p>Zostaniesz przekierowany na stronę główną</p>
  </div>
);

export default ErrorPage;
