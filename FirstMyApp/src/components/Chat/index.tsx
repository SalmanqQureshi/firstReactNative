export const modalInToGiftedChatObjects = (data: []) => {
  console.log('====================================');
  console.log('data==============',data);
  console.log('====================================');
    return data.map(
      ({
        _id,
        message,
        created_at,
        user,
        type,
        url,
        is_read,
        duration,
        thumbnail,
        user_id,
        image_url,
        name,
        file
      }) => {
        // const {id: userId, image_url, name} = user_data;
        const isImage = type == 'image';
        const isFile = type == 'file';
        const isVideo = type == 'video';
  
        const obj = {
          _id: _id,
          text: message,
          createdAt: created_at,
          isImage,
          isFile,
          user: {
            _id: user?._id,
            name: user?.name,
            avatar: user?.image_url,
          },
          is_read,
        };
  
        if (isImage) obj['image'] = url;
        if (isFile) obj['file'] = url;
        if (isVideo) {
          obj['video'] = url;
          obj['duration'] = duration;
          obj['thumbnail'] = thumbnail;
        }
  
        return obj;
      },
    );
  };
  