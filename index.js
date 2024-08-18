const functions = require('@google-cloud/functions-framework');
const cors = require('cors');
const corsMiddleware = cors({ origin: true });
const { createClient } = require("@supabase/supabase-js");

functions.http('qrcode_validar_iti', async (req, res) => {
    corsMiddleware(req, res, async () => {
        
        if (!req.query.id) return { error: 'Parâmetro id vazio', location: arguments.callee.name };

        const supabase = createClient(process.env.URL, process.env.KEY);
    
        const { data, error } = await supabase
        .from('files')
        .select('filename')
        .eq('id', req.query.id);
        
        console.log(error)

        let filename = data[0]['filename']

        const response = {
          version: "1.0.0",
          prescription: {
            signatureFiles: [
              {
                url:'https://vflhuqqzjmgkdhjgxzni.supabase.co/storage/v1/object/public/pdf/'+filename+'/48ae19b2-a922-4407-9a6d-d168cb412072.pdf'
              }
            ]
          }
        };
      //          url: `https://vflhuqqzjmgkdhjgxzni.supabase.co/storage/v1/object/public/pdf/${files}/${filename}`
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(response));

    });
});
