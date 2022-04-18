import mongoose from 'mongoose';

// we'll import all the schemas here and return them
// on the mongo connection object
// for use in the handlers
import Tramite from '../../data/models/Tramite';
import User  from '../../data/models/User';

const connectToMongo = async () => {
  if (!mongoose.connection) {
  const connection = await mongoose.createConnection(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useUnifiedTopology: true
    }
  );
  return {
    connection,
    models: {
      Tramite,
      User
    }
  };
}
}

export default connectToMongo;