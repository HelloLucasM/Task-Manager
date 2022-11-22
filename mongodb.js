const {MongoClient, ObjectId} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager'

// const id = new ObjectId();
// console.log(id.id); 
// console.log(id);
// console.log(id.toHexString());


MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database!', error)
    }

    const db = client.db(databaseName)

   db.collection("users")
    .deleteMany({age: 29})
        .then(data => console.log(data.deletedCount))
        .catch(err => console.log(err)); 
    
})

