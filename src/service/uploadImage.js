import FormData from 'form-data';

const uploadImage = async imageUri => {
  // Create a new FormData object
  const formData = new FormData();

  // Append the image data to the FormData object
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'image.jpg',
  });

  // Send a POST request to the imgbb.com API endpoint
  const response = await fetch(
    'https://api.imgbb.com/1/upload?key=5779224fb65d30f2f9b91e747e37ab00',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    },
  );

  // Parse the response JSON data
  const responseData = await response.json();

  // Return the direct image URL from the response data
  console.log(responseData.data.url);
  return responseData.data.url;
};

const deleteImage = async idImage => {
  // Send a DELETE request to the imgbb.com API endpoint
  // const response = await fetch(`https://i.ibb.co/nM0hvJF/5779224fb65d30f2f9b91e747e37ab00`, {
  //     method: 'DELETE',
  // });

  // Send a DELETE request to the imgbb.com API endpoint
  const response = await fetch(
    `https://api.imgbb.com/1/image/nM0hvJF?key=5779224fb65d30f2f9b91e747e37ab0`,
    {
      method: 'DELETE',
    },
  );

  // Log the response data
  console.log('responseData: ', response);
};

export {uploadImage, deleteImage};
