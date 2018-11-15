const { couch } = require('./lib')
const opts = {
    url: "http://localhost:5984",
    timeout: 600,
    log: (id, args) => {
      //console.log('opt:',id, args);
    }
  };

const moment = require('moment');
const nano = require('nano')(opts);
const uuidv4 = require('uuid/v4');
var db = nano.db.use('composerchannel_');

const dbinfo = async() => {
    const body = await db.info();
    
    console.log('got database info', body);
 
}

const insert = (data) => {
    db.insert(data, uuidv4(), function(err, body){
        if(!err){
          //console.log('body:', body)
        }
      });
}


const select = async() => {
/// find documents where the name = "Brian" and age > 25.
const q = { 
    selector: {
      name: { "$eq": "Couch"},
      age : { "$gt": 25 }
    },
    fields: [ "name", "age", "tags", "url" ],
    limit:50
  };
  
   const doc = await db.find(q);
   console.log('doc:',doc);
}

const select2 = async(dbname) => {
    /// find documents where the name = "Brian" and age > 25.
    const q = { 
        selector: {
          book: { "$eq": "print"}
        },
        fields: [ "_id", "title", "book" ],
        limit:50
      };
      
       const doc =  await couch.select(dbname);
       console.log('doc:',doc);
}

const count = async(dbname) => {
    /// find documents where the name = "Brian" and age > 25.

    const cnt = await couch.count()
    
    console.log('row length:', cnt)
}


const createIndex = async() => {
    const indexDef = {
        index: { 
            fields: ['name', 'age'] 
        },
        name: 'fooindex'
      };

      const doc = await db.createIndex(indexDef);
      console.log('createIndex:', doc);
}
//createIndex();
const random = (max) => Math.floor(Math.random() * Math.floor(max));
const inserttest = () => {
    const books = ['print', 'ebook', 'Safari'];
    const titles = ['computer', 'food', 'clothes', 'electronics', 'home', 'sports', 'music', 'office', 'car', 'accessories']

    const data = { 
        title: 'Brian', 
        skills: ['thunder bolt', 'iron tail', 'quick attack', 'mega punch'], 
        pages: 0,
        book: 'test'
    };
    try {
        for (var i = 66000 ; i < 67000; i++) {
            data.title = titles[random(10)];
            data.book = books[random(3)];
            data.pages = i;

            if (i % 100 === 0) {
                console.log('index:', i)
            }

            insert(data);
        }
    } catch (err) {
        console.log('error:', err)
    }

}
const del = async(selector) => {
    const q = {
      fields: [ "_id", "_rev" ],
      limit: 9999
    };
    
    q.selector = selector;
    console.log('query:', q)
    const result = await db.find(q);    

    console.log('docs:', result)

    result.docs.forEach(doc => {
        db.destroy(doc._id, doc._rev)
    })
}

const dbs = ()=> {

    nano.db.list(function(err, body) {
        // body is an array
        console.log('list:', body)
        body.filter(db=> db.charAt(0) !== '_').forEach(db => {
            console.log('db:', db)
        })
    });
    
}

const viewtest = () => {
    db.view('book', 'testView', { key: 'computer', 'include_docs': true, group: false}).then((body) => {
        
          console.log(body);
 
      });
}


const getTimeInterval = (startTime, endTime) => {
    return moment(moment(startTime,"HH:mm").diff(moment(endTime,"HH:mm"))).format("HH:mm"); 
}

const books = ['print', 'ebook', 'Safari'];

inserttest()
