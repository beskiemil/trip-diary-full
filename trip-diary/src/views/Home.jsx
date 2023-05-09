import React, { useContext } from 'react';

import ErrorPage from './ErrorPage';
import PostBrief from '../components/organisms/PostBrief';
import { PostContext } from '../Providers/PostProvider';

// eslint-disable-next-line arrow-body-style
const Home = () => {
  const { status, data, error } = useContext(PostContext).posts;

  if (status === 'loading') return <p>loading...</p>;
  if (status === 'error') return <ErrorPage error={error} />;

  return (
    <main className="flex flex-col gap-12">
      {data.length > 0 &&
        data.map(post => (
          <PostBrief
            // eslint-disable-next-line no-underscore-dangle
            postId={post._id}
            author={`${post.user.name} ${post.user.lastname}`}
            createdAt={post.createdAt}
            title={post.title}
            cover={post.cover}
            briefText={post.text}
            key={`${post.user.name}-${post.user.lastname}-${post.title}`}
          />
        ))}
    </main>
  );
};

export default Home;
