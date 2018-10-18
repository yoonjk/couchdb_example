
const opts = {
    url: "http://localhost:5984",
    timeout: 600,
    log: (id, args) => {
      console.log('opt:',id, args);
    }
  };
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
          console.log('body:', body)
        }
      });
}


const select = async() => {
/// find documents where the name = "Brian" and age > 25.
const q = { 
    selector: {
      name: { "$eq": "Brian"},
      age : { "$gt": 25 }
    },
    fields: [ "name", "age", "tags", "url" ],
    limit:50
  };
  
   const doc = await db.find(q);
   console.log('doc:',doc);
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

const inserttest = () => {
    var data = { 
        name: 'Brian', 
        skills: ['thunder bolt', 'iron tail', 'quick attack', 'mega punch'], 
        age: 30,
        tags: 'test',
        url : 'http://localhost',
        type: 'electric' 
    };
    try {
        for (var i = 0 ; i < 10000; i++) {
            data.name = `Brian_${i}`;
            data.age = i;
            insert(data);
        }
    } catch (err) {
        console.log('error:', err)
    }

}
const del = (name, rev) => {
    db.destroy(name, rev, function(err, body) {
        if (!err)
          console.log('del=====:',body);
      });
}
del('c057f177-6958-4188-8aca-0e237f36b60f', '2-6583b63c78230925328e0e9c86e6e8a5');
select();
