import mongoose from 'mongoose';

const DB_Name = 'HMS_Demo'

export async function connect() {
    try {
        const URL = `${process.env.MONGO_URI}/${DB_Name}`
        mongoose.connect(URL);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        
    }
}