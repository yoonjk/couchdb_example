

const uuidv4 = require('uuid/v4');
const opts = {
    url: "http://localhost:5984",
    timeout: 600,
    log: (id, args) => {
      
    }
  };

const nano = require('nano')(opts);  

/**
 * CouchDB module
 */
class CouchDB {
    constructor() {
        this.db = nano.db.use('composerchannel_');
    }

    async dbInfo () {
        const info = await db.info();
        
        return info;
    }    
    async createDB(dbname) {
        try {
            if (dbname) {
                this.db = await nano.db.create(dbname)
                
                console.log('database alice created!');
            } else {
                throw new ('Invalid parameter!')
            }
        } catch (err) {
            if (dbname) {
                this.db = await nano.db.use(dbname)
            }
        }
    }


    insert (data) {
        return new Promise((resolve, reject)=> {
            db.insert(data, uuidv4(), function(err, body){
                if(err){
                  return reject(err)
                }

                resolve(err, body);
            });
        })
    }

    /**
     * rich query
     * @param {Object} q 
     */
    async select(q) {
        const docs = await this.db.find(q);
        
        return docs;
    }

    async list(dbname) {
        try {
            const docs = this.db.get(dbname);

            return docs;
        } catch(err) {
            console.log(err)
            throw err;
        }
    }

    async count() {
        try {
            const docs = await this.db.list();

            return docs.rows.length;
        } catch(err) {
            console.log(err)
            throw err;
        }
    }

    /**
     * createIndex
     * @param {Object} index 
     */
    async createIndex (index) {
        const doc = await db.createIndex(indexDef);
        return doc;
    } 
    
    /**
     * del
     * @param {Object} selector 
     */
    async del(selector) {
        const q = {
          fields: [ "_id", "_rev" ]
        };
        
        q.selector = selector;
        const result = await db.find(q);    
    
        console.log('docs:', result)
    
        return new Promise((resolve, reject)=> {
            result.docs.forEach(doc => {
                db.destroy(doc._id, doc._rev, function(err, body) {
                    if (err) return reject(err)
                    
                    resolve(body);
                });
            })
        })
    }  
    
    /**
     * 
     */
    static dbs() {
        return new Promise((resolve, reject)=> {
            nano.db.list(function(err, dbs) {
                // body is an array
                if (err) return reject(err)
                resolve(err, dbs);
            });
        })

    }

}

module.exports = {
    couch : new CouchDB()
}


