import React, { useState, useEffect } from 'react';

const Post = ({ uploadDate }) => {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const millisecondsAgo = new Date() - new Date(uploadDate);
      const secondsAgo = Math.floor(millisecondsAgo / 1000);
      const minutesAgo = Math.floor(secondsAgo / 60);
      const hoursAgo = Math.floor(minutesAgo / 60);
      const daysAgo = Math.floor(hoursAgo / 24);

      if (secondsAgo < 60) {
        setTimeAgo(`${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`);
      } else if (minutesAgo < 60) {
        setTimeAgo(`${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`);
      } else if (hoursAgo < 24) {
        setTimeAgo(`${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`);
      } else {
        setTimeAgo(`${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`);
      }
    };

    // Update time every second
    const intervalId = setInterval(updateTimeAgo, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [uploadDate]);

  return <span>{timeAgo}</span>;
};

export default Post;
