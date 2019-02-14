const express = require("express");
const router = express.Router();

const Model = require("../models");
// module.exports = (router) => {
//     router.get('/')
// }

router.get("/", (req, res, next) => {
  res.send("Ping the homepage!");
});

router.get("/keepalive", (err, res, req) => {
  dns.lookup("google.com", err => {
    if (err && err.code == "ENOTFOUND") {
      return res.send({
        success: false
      });
    } else {
      return res.send({
        success: true
      });
    }
  });
});

router.get("/downloadResources", (err, res, req) => {
  const options = {
    url: `https://www.frontiersin.org/research-topics/6015/articles?index=1&sortby=date&pagesize=12&isrecent=false`,
    json: true
  };
  const options1 = {
    url: `https://api.nextprot.org/entry-publications/entry/NX_P37840/category/curated.json?clientInfo=Calipho%20Group&applicationName=neXtProt%20publications`,
    json: true
  };

  const options2 = {
    url: `https://api.nextprot.org/entry-publications/entry/NX_P37840/category/additional.json?clientInfo=Calipho%20Group&applicationName=neXtProt%20publications`,
    json: true
  };

  const options3 = {
    url: `https://api.nextprot.org/page-view/sequence/NX_P37840/xref?clientInfo=ndu&applicationName=xref-section`,
    json: true
  };

  process.stdout.write("Loading");
  // Articles Section
  rp(options)
    .then(data => {
      for (let article of data.Articles) {
        const Articles = new Model.Articles();
        (Articles.title = article.ArticleTitle),
          (Articles.url = article.ArticleUrl),
          (Articles.abstract = article.Abstract),
          (Articles.authors = article.Authors),
          Articles.save(err => {
            if (err) {
              throw err;
            }
          });

        process.stdout.write(".");
      }
      // console.log(articleData)
    })
    .catch(err => {
      throw err;
    });

  rp(options1)
    .then(data => {
      for (let article of data) {
        const Articles = new Model.Articles();
        (Articles.title = article.publication.title),
          (Articles.url = article.publication.dbXrefs[0].resolvedUrl),
          (Articles.abstract = article.publication.abstractText),
          (Articles.authors = article.publication.authors);
        Articles.save(err => {
          if (err) {
            throw err;
          }
        });
        process.stdout.write(".");
      }
    })
    .catch(err => {
      throw err;
    });

  rp(options2)
    .then(data => {
      for (let article of data) {
        const Articles = new Model.Articles();
        (Articles.title = article.publication.title),
          (Articles.url = article.publication.dbXrefs[0].resolvedUrl),
          (Articles.abstract = article.publication.abstractText),
          (Articles.authors = article.publication.authors);
        Articles.save(err => {
          if (err) {
            throw err;
          }
        });
        process.stdout.write(".");
      }
    })
    .catch(err => {
      throw err;
    });

  // Database Section

  rp(options3)
    .then(data => {
      let databaseData = [];
      for (let database of data.entry.xrefs) {
        const Database = new Model.Database();
        (Database.databaseName = database.databaseName),
          (Database.databaseCategory = database.databaseCategory),
          (Database.databaseUrl = database.resolvedUrl),
          (Database.accession = database.accession),
          Database.save(err => {
            if (err) {
              throw err;
            }
          });

        process.stdout.write(".");
      }
    })
    .catch(err => {
      throw err;
    });

  return res.send({
    message: "Downloaded Articles",
    success: true
  });
});

router.get("/getAllArticles", (err, res, req) => {
  var result = 10,
    articles = [];

  Model.Articles.find(
    {
      title: /.*son*./
    },
    (err, AllArticles) => {
      if (err) {
        throw err;
      }

      return res.send({
        success: true,
        mesage: "All Articles have been sorted and returned",
        articles: AllArticles
      });
    }
  ).sort({
    title: 1
  });
});

router.get("/getDatabase", (err, res, req) => {
  var Database = [];

  Model.Database.find({}, (err, Data) => {
    if (err) {
      throw err;
    }

    return res.send({
      success: true,
      mesage: "All Data have been returned",
      database: Data
    });
  });
});

router.get("/g", (err, res, req) => {
  Model.Articles.aggregate(
    [
      {
        $project: {
          abstractText: {
            $substr: ["$abstract", 0, 100]
          }
        }
      }
    ],
    err => {
      if (err) {
        throw err;
      }
      return res.send({
        message: "Mad oooooooooooooooooooooooooooo"
      });
    }
  );
});

module.exports = router;
