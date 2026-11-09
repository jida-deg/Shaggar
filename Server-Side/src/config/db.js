import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const connections = await mongoose.connect(process.env.MONGO_URI);
        if(connections){
            console.log('MongoDB connected successfully');
        }

    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectDB;