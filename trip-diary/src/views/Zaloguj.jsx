import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/molecules/Button';
import Input from '../components/molecules/Input';
import { AuthContext } from '../Providers/AuthProvider';

const Zaloguj = () => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleInputChange = e => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleUserLogin = async e => {
    e.preventDefault();

    const errors = await login(formValues.email, formValues.password);
    if (errors !== null) setFormErrors(errors);
    else navigate('/');
  };

  return (
    <form onSubmit={handleUserLogin} className="max-w-2/3 flex flex-col gap-5">
      <Input
        type="email"
        label="E-mail"
        id="email"
        name="email"
        placeholder="jan.kowalski@email.com"
        value={formValues.email}
        onChange={handleInputChange}
        error={formErrors.email}
      />
      <Input
        type="password"
        label="Hasło"
        id="password"
        name="password"
        placeholder="qweRTY123!@#"
        value={formValues.password}
        onChange={handleInputChange}
        error={formErrors.password}
      />
      <Button type="submit">Zaloguj się</Button>
    </form>
  );
};

export default Zaloguj;
