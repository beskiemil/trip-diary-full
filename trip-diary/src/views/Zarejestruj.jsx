import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/molecules/Button';
import Input from '../components/molecules/Input';
import { AuthContext } from '../Providers/AuthProvider';

const Zarejestruj = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = e => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleUserRegister = async e => {
    e.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: 'Wpisane hasła są różne'
      });
      return;
    }

    const errors = await register(formValues);
    if (errors !== null) setFormErrors(errors);
    else navigate('/');
  };

  return (
    <form
      onSubmit={handleUserRegister}
      className="max-w-1/3 flex flex-col gap-5"
    >
      <Input
        type="name"
        label="Imię"
        id="name"
        name="name"
        placeholder="Jan"
        value={formValues.name}
        onChange={handleInputChange}
        error={formErrors.name}
      />
      <Input
        type="lastname"
        label="Nazwisko"
        id="lastname"
        name="lastname"
        placeholder="Kowalski"
        value={formValues.lastname}
        onChange={handleInputChange}
        error={formErrors.lastname}
      />
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
      <Input
        type="password"
        label="Powtórz hasło"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="qweRTY123!@#"
        value={formValues.confirmPassword}
        onChange={handleInputChange}
        error={formErrors.confirmPassword}
      />
      <Button type="submit">Zarejestruj się</Button>
    </form>
  );
};

export default Zarejestruj;
