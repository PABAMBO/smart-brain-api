const Clarifai = require('clarifai');

const clarifaiRequestOptions = (imageUrl) => {
  const PAT = process.env.API_KEY;
  const USER_ID = process.env.API_USER;       
  const APP_ID = process.env.API_APP_ID;

  // const MODEL_ID = 'face-detection';  
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions
}

const handleApiCall = (req, res) => {
  fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", clarifaiRequestOptions(req.body.input))
    .then(response => response.json())
    .then(data => {
      if (data.outputs) {
        res.json(data.outputs);
      } else {
        res.status(400).json('No outputs in API response');
      }
    })
    .catch(err => res.status(400).json('Unable to call API'));
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('Unable to get entries...'))
}

module.exports = {
  handleImage,
  handleApiCall
}