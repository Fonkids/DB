// Exekutatzeko node js/functions.js
const getAriketakByMota = require("./firebase/database");
const getMultimediaUrl = require("./supabase/storage");


(async () => {
    try {
      var ariketak = await getAriketakByMota("P1");
      console.log(JSON.stringify(ariketak, null, 2));
      if (!ariketak) {
        console.log("Ez da ariketarik aurkitu mota honetarako: P1");
        return;
      }
  
      for (const [ariketaId, ariketa] of Object.entries(ariketak)) {
        for (const [elementuId, elementua] of Object.entries(ariketa.elementuak || {})) {
          const multimediaEdukiak = [
            ["galdera", elementua.galdera],
            ...Object.entries(elementua.erantzunak || {}),
          ];
  
          for (const [edukiMota, edukia] of multimediaEdukiak) {
            if (edukia && edukia.formatua !== "testua") {
              const url = getMultimediaUrl(ariketaId, edukia.edukia);
              console.log(`${ariketaId}/${elementuId} ${edukiMota}: ${url}`);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } 
  })();