/* eslint-disable no-underscore-dangle */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Button from '../components/molecules/Button';
import PhotoGallery from '../components/organisms/PhotoGallery';
import { AuthContext } from '../Providers/AuthProvider';
import { PostContext } from '../Providers/PostProvider';

const Post = () => {
  const { postId } = useParams();

  const { data, status, error } = useContext(PostContext).usePost(postId);

  const { userInfo } = useContext(AuthContext);

  const { mutate } = useMutation({
    mutationFn: id =>
      fetch(`http://localhost:3000/delete_post/${id}`, {
        method: 'POST',
        credentials: 'include'
      })
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const deletePost = async () => {
    mutate(postId, {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
        queryClient.invalidateQueries(['post', postId]);
        navigate(`/`);
      }
    });
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Error :{error}</p>;

  return (
    <div className="flex max-w-screen-lg flex-col gap-3">
      {userInfo.id === data.user._id && (
        <div className="flex justify-between">
          <Button>
            <Link to={`/edytuj/${data._id}`}>Edytuj</Link>
          </Button>

          <Button
            className="border-red-600 hover:border-red-600 hover:bg-red-600"
            onClick={deletePost}
          >
            Usuń
          </Button>
        </div>
      )}

      <img src={`http://localhost:3000/${data.cover}`} alt={`${data.title}`} />
      <div className="flex w-full justify-between">
        <h3>{`${data.user.name} ${data.user.lastname}`}</h3>
        <h3>{format(new Date(data.createdAt), 'd.MM.yyy HH:mm')}</h3>
      </div>
      <h1 className="text-4xl">{data.title}</h1>
      <h2 className="text-lg">{data.type}</h2>
      <h2 className="text-lg">Miejsce: {data.destination}</h2>
      <h2 className="text-lg">Dystans: {data.length}</h2>
      <p>{data.text}</p>
      <PhotoGallery images={data.images} className="my-4" />
    </div>
  );
};

export default Post;
