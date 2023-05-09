import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorPage from './ErrorPage';
import Button from '../components/molecules/Button';
import Input from '../components/molecules/Input';
import Select from '../components/molecules/Select';
import { AuthContext } from '../Providers/AuthProvider';

const UtworzPost = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [lenght, setLenght] = useState('');
  const [type, setType] = useState('Wycieczka piesza');
  const [destination, setDestination] = useState('');
  const [text, setText] = useState('');
  const [images, setImages] = useState('');
  const [cover, setCover] = useState('');

  const { mutate } = useMutation({
    mutationFn: data =>
      fetch('http://localhost:3000/add_post', {
        method: 'POST',
        credentials: 'include',
        body: data
      })
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleAddPost = async e => {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('length', lenght);
    data.set('type', type);
    data.set('destination', destination);
    data.set('text', text);
    data.append('cover', cover[0]);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < images.length && i < 4; i++) {
      data.append('images', images[i]);
    }
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
        setTitle('');
        setLenght('');
        setType('Wycieczka piesza');
        setDestination('');
        setText('');
        setImages('');
        setCover('');
        navigate('/');
      }
    });
  };

  useEffect(() => {
    if (userInfo === null)
      fetch('http://localhost:3000/profile', {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(info => setUserInfo(info));
  }, [setUserInfo, userInfo]);

  if (userInfo === null)
    return <ErrorPage error="Wystąpił błąd" message="Nie zalogowano" />;

  return (
    <form
      className="flex w-2/3 flex-col gap-5"
      id="newPostForm"
      onSubmit={handleAddPost}
    >
      <Input
        type="text"
        label="Tytuł"
        name="title"
        id="title"
        placeholder="Tytuł mojego wpisu..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full"
      />
      <Input
        type="number"
        label="Długość trasy (km)"
        name="length"
        id="length"
        placeholder="2 km"
        value={lenght}
        onChange={e => setLenght(e.target.value)}
        className="w-full"
      />
      <Select
        label="Rodzaj"
        name="type"
        id="type"
        value={type}
        options={[
          'Wycieczka piesza',
          'Wycieczka rowerowa',
          'Wycieczka krajoznawcza',
          'Wycieczka z biura podróży',
          'Inne'
        ]}
        onChange={e => setType(e.target.value)}
        className="w-full"
      />
      <Input
        type="text"
        label="Miejsce"
        name="destination"
        id="destination"
        placeholder="np. Góry świętokrzyskie..."
        value={destination}
        onChange={e => setDestination(e.target.value)}
        className="w-full"
      />
      <Input
        type="textarea"
        label="Tekst"
        name="text"
        id="text"
        placeholder="Tutaj wpisz tekst wpisu..."
        rows="10"
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full resize-none"
      />
      <Input
        type="file"
        label="Okładka"
        name="cover"
        id="cover"
        className="w-full"
        accept="image/*"
        onChange={e => setCover(e.target.files)}
        required
      />
      <Input
        type="file"
        label="Zdjęcia"
        name="images"
        id="images"
        className="w-full"
        accept="image/*"
        onChange={e => setImages(e.target.files)}
        multiple
        required
      />
      <Button className="" type="submit">
        Dodaj post
      </Button>
    </form>
  );
};

export default UtworzPost;
