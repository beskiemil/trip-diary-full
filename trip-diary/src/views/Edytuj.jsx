import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ErrorPage from './ErrorPage';
import Button from '../components/molecules/Button';
import Input from '../components/molecules/Input';
import Select from '../components/molecules/Select';
import { PostContext } from '../Providers/PostProvider';

const Edytuj = () => {
  const { postId } = useParams();

  const [title, setTitle] = useState('');
  const [lenght, setLenght] = useState('');
  const [type, setType] = useState('');
  const [destination, setDestination] = useState(0);
  const [text, setText] = useState('');
  const [images, setImages] = useState('');
  const [cover, setCover] = useState('');

  const {
    data: postData,
    status: postStatus,
    error: postError
  } = useContext(PostContext).usePost(postId);

  useEffect(() => {
    if (postStatus === 'success') {
      setTitle(postData.title);
      setLenght(postData.length.toString());
      setType(postData.type);
      setDestination(postData.destination);
      setText(postData.text);
    }
  }, [
    postStatus,
    postData.title,
    postData.type,
    postData.destination,
    postData.text,
    postData.length
  ]);

  const { mutate } = useMutation({
    mutationFn: newPost =>
      fetch(`http://localhost:3000/edit_post/${newPost.id}`, {
        method: 'POST',
        credentials: 'include',
        body: newPost.data
      })
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const editPost = async e => {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('length', lenght);
    data.set('type', type);
    data.set('destination', destination);
    data.set('text', text);
    if (cover !== '') data.append('cover', cover[0]);

    if (images !== '')
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < images.length && i < 4; i++) {
        data.append('images', images[i]);
      }

    mutate(
      { data, id: postId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('posts');
          queryClient.invalidateQueries(['post', postId]);
          navigate(`/posts/${postId}`);
        }
      }
    );
  };

  if (postStatus === 'loading') return <p>Loading...</p>;
  if (postStatus === 'error') return <ErrorPage error={postError} />;

  return (
    <form
      className="flex w-2/3 flex-col gap-5"
      id="newPostForm"
      onSubmit={editPost}
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
      />
      <Button className="" type="submit">
        Edytuj post
      </Button>
    </form>
  );
};

export default Edytuj;
