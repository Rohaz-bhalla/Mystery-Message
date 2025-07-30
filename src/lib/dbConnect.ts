import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number;
};

const connection : connectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log('DB already connected')
        return
    }

    try {
        const DB = await mongoose.connect(process.env.MONGO_URI || '', {});
        connection.isConnected = DB.connections[0].readyState;
        console.log('DB connected succesfully');
    } catch (error) {
        console.error('Error in connecting to DB', error);
        process.exit(1);
    }
}

export default dbConnect;
