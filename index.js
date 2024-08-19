const functions = require('@google-cloud/functions-framework');
const cors = require('cors');
const corsMiddleware = cors({ origin: true });
const { createClient } = require("@supabase/supabase-js");

const handleRequest = async (req, res) => {
  const { body } = req;

  try {

    
    //if (!body.id) return { error: 'Parâmetro id vazio', location: arguments.callee.name };

    const supabase = createClient(process.env.URL, process.env.KEY);

    const { data, error } = await supabase
    .from('files')
    .select('filename,files')
    .eq('id', body.data.id);
    
    console.log(error)

    let filename = data[0]['filename']
    let files = data[0]['files']
  
    const response = {
      version: "1.0.0",
      prescription: {
        signatureFiles: [
          {
            url:'https://vflhuqqzjmgkdhjgxzni.supabase.co/storage/v1/object/public/pdf/'+files+'/'+filename
          }
        ]
      }
    };

    res.set('Content-Type', 'application/json');
   
    return res.status(200).send(JSON.stringify(response));

  /*   switch (body.path) {
      case 'listPSC':
        const psc = await routeListPSC(body.session);
        return res.status(200).send(psc);
      case 'updateUsersPSC':
        const update = await routeUpdateUsersPSC(body.session);
        return res.status(200).send(update);
      default:
        return res.status(400).send({ error: 'Invalid path' });
    } */
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Error');
  }
};

functions.http('qrcode_validar_iti', (req, res) => {
  corsMiddleware(req, res, () => handleRequest(req, res));
});
