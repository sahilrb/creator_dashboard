import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const UserDataSchema = new mongoose.Schema({
    username: { type: String, required: true },
    role: { type: String, enum: ['User', 'Admin'], required: true },
    credits: { type: Number, required: true },
    savedPosts: { type: [PostSchema], default: [] },
}, { timestamps: true });

const UserData = mongoose.model('UserData', UserDataSchema);

export default UserData;